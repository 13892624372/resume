const API_KEY = import.meta.env.VITE_ZHIPU_API_KEY || ''
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

export interface JDAnalysisResult {
  position: string
  hardSkills: string[]
  softSkills: string[]
  experienceRequired: string
  keywords: string[]
  matchTips: string
}

export interface OptimizeResult {
  optimized: string
  suggestions: string[]
}

class AIService {
  private async request(prompt: string): Promise<string> {
    if (!API_KEY) {
      throw new Error('请先配置智谱AI API Key')
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'glm-4-flash',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('AI请求错误:', error)
      throw error
    }
  }

  // 解析JD
  async parseJD(jdText: string): Promise<JDAnalysisResult> {
    const prompt = `请分析以下岗位JD，提取关键信息并以JSON格式返回：

岗位JD：
${jdText}

请提取以下信息并以JSON格式返回（不要包含markdown格式标记）：
{
  "position": "岗位名称",
  "hardSkills": ["硬性技能要求1", "硬性技能要求2"],
  "softSkills": ["软技能1", "软技能2"],
  "experienceRequired": "经验要求",
  "keywords": ["关键词1", "关键词2"],
  "matchTips": "简历匹配建议"
}

注意：
1. hardSkills提取技术栈、工具、语言等硬性要求
2. softSkills提取沟通、协作、抗压等软技能要求
3. keywords提取岗位核心关键词，用于简历优化
4. matchTips给出具体的简历优化建议`

    try {
      const result = await this.request(prompt)
      // 清理可能的markdown标记
      const cleanJson = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleanJson)
    } catch (error) {
      console.error('JD解析错误:', error)
      // 返回默认结构
      return {
        position: '',
        hardSkills: [],
        softSkills: [],
        experienceRequired: '',
        keywords: [],
        matchTips: '解析失败，请手动输入关键信息'
      }
    }
  }

  // 优化工作经历
  async optimizeWorkExperience(description: string, jobRequirements: string[]): Promise<OptimizeResult> {
    const prompt = `请根据以下岗位要求，优化工作经历描述，使用STAR法则：

岗位要求：${jobRequirements.join(', ')}

当前工作经历描述：
${description}

优化要求：
1. 使用STAR法则（情境-任务-行动-结果）
2. 突出与岗位相关的经验和成果
3. 尽可能量化成果（使用数字、百分比）
4. 融入岗位关键词
5. 保持简洁，分点描述，每点不超过30字
6. 最多输出3-4点

请以JSON格式返回（不要包含markdown格式标记）：
{
  "optimized": "优化后的描述（用\\n分隔每条）",
  "suggestions": ["建议1", "建议2"]
}`

    try {
      const result = await this.request(prompt)
      const cleanJson = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleanJson)
    } catch (error) {
      return {
        optimized: description,
        suggestions: ['优化失败，请手动调整']
      }
    }
  }

  // 优化项目经历
  async optimizeProject(description: string, techStack: string, jobRequirements: string[]): Promise<OptimizeResult> {
    const prompt = `请根据以下岗位要求，优化项目经历描述：

岗位要求：${jobRequirements.join(', ')}
当前技术栈：${techStack}

当前项目描述：
${description}

优化要求：
1. 突出项目的技术难点和解决方案
2. 强调与岗位相关的技术栈
3. 量化项目成果（用户数、性能提升等）
4. 体现个人贡献和职责
5. 分点描述，简洁明了

请以JSON格式返回（不要包含markdown格式标记）：
{
  "optimized": "优化后的描述（用\\n分隔每条）",
  "suggestions": ["建议1", "建议2"]
}`

    try {
      const result = await this.request(prompt)
      const cleanJson = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleanJson)
    } catch (error) {
      return {
        optimized: description,
        suggestions: ['优化失败，请手动调整']
      }
    }
  }

  // 生成自我评价
  async generateSelfEvaluation(jobTitle: string, skills: string[], jobRequirements: string[]): Promise<string> {
    const prompt = `请根据以下信息，生成一段针对性的自我评价：

目标岗位：${jobTitle}
个人技能：${skills.join(', ')}
岗位要求：${jobRequirements.join(', ')}

要求：
1. 突出与岗位匹配的核心优势
2. 体现学习能力和成长潜力
3. 展现职业素养和工作态度
4. 控制在100-150字
5. 语言专业、真诚、有说服力

直接返回自我评价内容，不要包含JSON格式。`

    try {
      const result = await this.request(prompt)
      return result.trim()
    } catch (error) {
      return '个人学习能力强，具备扎实的专业技能和良好的团队协作精神，期待在新岗位上创造价值。'
    }
  }

  // 计算匹配度
  async calculateMatchScore(resumeSkills: string[], jobRequirements: string[]): Promise<number> {
    const prompt = `请计算简历技能与岗位要求的匹配度：

简历技能：${resumeSkills.join(', ')}
岗位要求：${jobRequirements.join(', ')}

请分析：
1. 技能重合度
2. 关键技能缺失情况
3. 综合匹配度评分（0-100分）

只返回一个数字（0-100），表示匹配度分数。`

    try {
      const result = await this.request(prompt)
      const score = parseInt(result.trim())
      return isNaN(score) ? 60 : Math.min(100, Math.max(0, score))
    } catch (error) {
      return 60
    }
  }

  // 多维度匹配度分析（简化版，避免请求过长）
  async analyzeMatchDimensions(
    resumeData: {
      skills: string[]
      projects: { name: string; description: string; technologies: string[] }[]
      workExperience: { company: string; position: string; description: string }[]
      education: { school: string; major: string; degree: string }[]
    },
    jdAnalysis: JDAnalysisResult
  ): Promise<{
    overallScore: number
    dimensions: {
      skills: { score: number; matched: string[]; missing: string[] }
      projects: { score: number; relevance: string[] }
      experience: { score: number; years: number; required: string }
      education: { score: number; match: boolean }
    }
    suggestions: string[]
  }> {
    // 如果请求内容过长，直接返回本地计算结果，避免500错误
    const estimatedLength = JSON.stringify(resumeData).length + JSON.stringify(jdAnalysis).length
    if (estimatedLength > 3000) {
      console.warn('请求内容过长，使用本地计算')
      throw new Error('Request too long')
    }

    const prompt = `分析简历与岗位匹配度：

简历技能：${resumeData.skills.join('、')}
项目：${resumeData.projects.map(p => p.name).join('、')}
岗位：${jdAnalysis.position}
要求技能：${jdAnalysis.hardSkills.join('、')}
经验要求：${jdAnalysis.experienceRequired}

返回JSON格式：
{
  "overallScore": 85,
  "dimensions": {
    "skills": {"score": 80, "matched": [], "missing": []},
    "projects": {"score": 90, "relevance": []},
    "experience": {"score": 85, "years": 0, "required": ""},
    "education": {"score": 100, "match": true}
  },
  "suggestions": ["建议1", "建议2"]
}`

    try {
      const result = await this.request(prompt)
      const cleanJson = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      return JSON.parse(cleanJson)
    } catch (error) {
      console.error('匹配度分析错误:', error)
      // 抛出错误让调用方处理
      throw error
    }
  }
}

export const aiService = new AIService()
