<template>
  <div class="resume-preview">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">👁️ 简历预览</span>
          <div class="actions">
            <el-button type="primary" @click="showPreviewDialog">
              <el-icon><View /></el-icon>查看简历
            </el-button>
          </div>
        </div>
      </template>

      <!-- 匹配度分析 -->
      <div v-if="resumeStore.jdAnalysis" class="match-analysis">
        <div class="match-score">
          <div class="score-circle" :style="{ background: scoreColor }">
            <span class="score-number">{{ matchScore }}</span>
            <span class="score-label">匹配度</span>
          </div>
        </div>
        <div class="match-details">
          <h4>匹配分析</h4>
          
          <!-- 多维度评分 -->
          <div v-if="matchDimensions" class="dimension-scores">
            <div class="dimension-item">
              <span class="dimension-name">技能匹配</span>
              <el-progress :percentage="matchDimensions.skills.score" :color="scoreColor" :show-text="true" :stroke-width="8" />
            </div>
            <div class="dimension-item">
              <span class="dimension-name">项目相关</span>
              <template v-if="matchDimensions.projects.score > 0">
                <el-progress :percentage="matchDimensions.projects.score" :color="scoreColor" :show-text="true" :stroke-width="8" />
              </template>
              <template v-else>
                <span class="dimension-empty">未填写</span>
              </template>
            </div>
            <div class="dimension-item">
              <span class="dimension-name">经验匹配</span>
              <template v-if="matchDimensions.experience.score > 0">
                <el-progress :percentage="matchDimensions.experience.score" :color="scoreColor" :show-text="true" :stroke-width="8" />
              </template>
              <template v-else>
                <span class="dimension-empty">未填写</span>
              </template>
            </div>
            <div class="dimension-item">
              <span class="dimension-name">教育背景</span>
              <template v-if="matchDimensions.education.score > 0">
                <el-progress :percentage="matchDimensions.education.score" :color="scoreColor" :show-text="true" :stroke-width="8" />
              </template>
              <template v-else>
                <span class="dimension-empty">未填写</span>
              </template>
            </div>
          </div>
          
          <div class="skill-match">
            <div class="match-label">已匹配技能：</div>
            <div class="match-tags">
              <el-tag
                v-for="skill in matchDimensions?.skills.matched || matchedSkills"
                :key="skill"
                type="success"
                size="small"
              >
                {{ skill }}
              </el-tag>
              <span v-if="(matchDimensions?.skills.matched.length || matchedSkills.length) === 0" class="no-match">暂无匹配技能</span>
            </div>
          </div>
          <div class="skill-missing">
            <div class="match-label">缺失技能：</div>
            <div class="match-tags">
              <el-tag
                v-for="skill in matchDimensions?.skills.missing || missingSkills"
                :key="skill"
                type="danger"
                size="small"
              >
                {{ skill }}
              </el-tag>
              <span v-if="(matchDimensions?.skills.missing.length || missingSkills.length) === 0" class="no-match">无缺失技能</span>
            </div>
          </div>
          
          <!-- 改进建议 -->
          <div v-if="matchSuggestions.length > 0" class="match-suggestions">
            <div class="match-label">改进建议：</div>
            <ul class="suggestion-list">
              <li v-for="(suggestion, index) in matchSuggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <el-divider v-if="resumeStore.jdAnalysis" />

      <!-- 简历完整度 -->
      <div class="completion-rate">
        <div class="rate-label">简历完整度</div>
        <el-progress
          :percentage="resumeStore.completionRate"
          :status="resumeStore.completionRate === 100 ? 'success' : ''"
        />
      </div>

      <el-divider />

      <!-- 简历信息摘要 -->
      <div class="resume-summary">
        <h4>简历信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ resumeStore.resumeData.basicInfo.name || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="求职岗位">{{ resumeStore.resumeData.basicInfo.jobTitle || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="教育经历">{{ resumeStore.resumeData.education.length }} 段</el-descriptions-item>
          <el-descriptions-item label="工作经历">{{ resumeStore.resumeData.workExperience.length }} 段</el-descriptions-item>
          <el-descriptions-item label="项目经历">{{ resumeStore.resumeData.projects.length }} 段</el-descriptions-item>
          <el-descriptions-item label="技能标签">
            <div class="skills-tags-preview">
              <el-tag
                v-for="skill in resumeStore.resumeData.skills"
                :key="skill"
                type="primary"
                size="small"
                class="skill-tag-item"
              >
                {{ skill }}
              </el-tag>
              <span v-if="resumeStore.resumeData.skills.length === 0" class="no-skills">未填写</span>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="preview-hint">
        <el-alert
          title="点击「查看简历」按钮可预览完整简历效果，支持Word式编辑"
          type="info"
          :closable="false"
          show-icon
        />
      </div>
    </el-card>

    <!-- 简历预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="简历预览"
      :width="isFullscreen ? '100%' : '950px'"
      :top="isFullscreen ? '0' : '3vh'"
      :fullscreen="isFullscreen"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="preview-dialog"
      :class="{ 'fullscreen-dialog': isFullscreen }"
      @close="handleDialogClose"
    >
      <div class="preview-container">
        <!-- 模板选择和编辑工具栏 -->
        <div class="template-selector-dialog">
          <div class="template-selector">
            <span class="label">选择模板：</span>
            <el-radio-group v-model="selectedTemplate" :disabled="isEditMode">
              <el-radio-button label="creative">创意现代</el-radio-button>
              <el-radio-button label="modern">现代简约</el-radio-button>
              <el-radio-button label="minimal">简约清新</el-radio-button>
            </el-radio-group>
          </div>
          <div class="dialog-actions">
            <!-- 缩放控制 -->
            <div class="zoom-controls">
              <el-button size="small" circle @click="decreaseZoom">
                <el-icon><Minus /></el-icon>
              </el-button>
              <span class="zoom-value">{{ Math.round(zoomLevel * 100) }}%</span>
              <el-button size="small" circle @click="increaseZoom">
                <el-icon><Plus /></el-icon>
              </el-button>
              <el-button size="small" @click="resetZoom">重置</el-button>
            </div>
            <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏显示'" placement="top">
              <el-button 
                type="info" 
                size="small" 
                @click="toggleFullscreen"
              >
                <el-icon><FullScreen /></el-icon>
                {{ isFullscreen ? '退出全屏' : '全屏' }}
              </el-button>
            </el-tooltip>
            <el-tooltip :content="isEditMode ? '点击完成保存修改' : '进入Word式编辑模式'" placement="top">
              <el-button 
                :type="isEditMode ? 'success' : 'warning'" 
                size="small" 
                @click="toggleEditMode"
              >
                <el-icon><Edit /></el-icon>
                {{ isEditMode ? '完成编辑' : '编辑简历' }}
              </el-button>
            </el-tooltip>
            <el-button type="success" size="small" @click="exportWord" class="export-btn" :disabled="isEditMode">
              <el-icon><Document /></el-icon>导出Word
            </el-button>
            <el-button type="primary" size="small" @click="exportPDF" class="export-btn" :disabled="isEditMode">
              <el-icon><Download /></el-icon>导出PDF
            </el-button>
          </div>
        </div>

        <!-- 编辑模式提示 -->
        <div v-if="isEditMode" class="edit-mode-banner">
          <el-alert
            title="📝 Word式编辑模式已开启 - 点击任意文字即可编辑，支持增删条目、拖拽排序"
            type="warning"
            :closable="false"
            show-icon
          />
        </div>

        <!-- 简历内容 -->
        <div 
          class="resume-container-wrapper-dialog" 
          :class="{ 'edit-mode': isEditMode, 'fullscreen-wrapper': isFullscreen }"
          :style="resumeWrapperStyle"
        >
          <div class="resume-scale-wrapper" :style="resumeScaleStyle">
            <CreativeTemplate
              v-if="selectedTemplate === 'creative'"
              :key="templateKey"
              ref="templateRef"
              :resume-data="editableResumeData"
              :edit-mode="isEditMode"
              @update:data="handleDataUpdate"
            />
            <ModernTemplate
              v-if="selectedTemplate === 'modern'"
              :key="templateKey"
              ref="templateRef"
              :resume-data="editableResumeData"
              :edit-mode="isEditMode"
              @update:data="handleDataUpdate"
            />
            <MinimalTemplate
              v-if="selectedTemplate === 'minimal'"
              :key="templateKey"
              ref="templateRef"
              :resume-data="editableResumeData"
              :edit-mode="isEditMode"
              @update:data="handleDataUpdate"
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, View, Edit, FullScreen, Plus, Minus, Document } from '@element-plus/icons-vue'
import { useResumeStore } from '@/stores/resume'
import CreativeTemplate from './templates/CreativeTemplate.vue'
import ModernTemplate from './templates/ModernTemplate.vue'
import MinimalTemplate from './templates/MinimalTemplate.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { aiService, type JDAnalysisResult } from '@/services/aiService'
import { WordExportService } from '@/services/wordExport'
import type { ResumeData } from '@/stores/resume'

const resumeStore = useResumeStore()
const selectedTemplate = ref('creative')
const templateRef = ref<InstanceType<typeof CreativeTemplate | typeof ModernTemplate | typeof MinimalTemplate>>()
const previewDialogVisible = ref(false)
const templateKey = ref(0)
const isEditMode = ref(false)
const isFullscreen = ref(false)
const zoomLevel = ref(1)

// 可编辑的简历数据副本
const editableResumeData = ref<ResumeData>(JSON.parse(JSON.stringify(resumeStore.resumeData)))

// 匹配度分数
const matchScore = ref(0)
const matchDimensions = ref<{
  skills: { score: number; matched: string[]; missing: string[] }
  projects: { score: number; relevance: string[] }
  experience: { score: number; years: number; required: string }
  education: { score: number; match: boolean }
} | null>(null)
const matchSuggestions = ref<string[]>([])

// 简历容器样式
const resumeWrapperStyle = computed(() => {
  if (isFullscreen.value) {
    return {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: 'calc(100vh - 200px)',
      overflow: 'auto'
    }
  }
  return {}
})

// 简历缩放样式
const resumeScaleStyle = computed(() => {
  return {
    transform: `scale(${zoomLevel.value})`,
    transformOrigin: 'top center',
    transition: 'transform 0.2s ease'
  }
})

// 全屏切换
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

// 缩放控制
const increaseZoom = () => {
  if (zoomLevel.value < 1.5) {
    zoomLevel.value += 0.1
  }
}

const decreaseZoom = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value -= 0.1
  }
}

const resetZoom = () => {
  zoomLevel.value = 1
}

// 显示预览对话框
const showPreviewDialog = () => {
  previewDialogVisible.value = true
  // 复制当前数据到可编辑副本
  editableResumeData.value = JSON.parse(JSON.stringify(resumeStore.resumeData))
  // 强制刷新模板组件
  templateKey.value++
  // 重置编辑模式、全屏和缩放
  isEditMode.value = false
  isFullscreen.value = false
  zoomLevel.value = 1
}

// 处理对话框关闭
const handleDialogClose = () => {
  if (isEditMode.value) {
    // 如果还在编辑模式，询问是否保存
    ElMessageBox.confirm(
      '您正在编辑模式中，是否保存修改？',
      '提示',
      {
        confirmButtonText: '保存',
        cancelButtonText: '放弃',
        type: 'warning'
      }
    ).then(() => {
      saveEditData()
    }).catch(() => {
      // 放弃修改
      editableResumeData.value = JSON.parse(JSON.stringify(resumeStore.resumeData))
    })
  }
  isEditMode.value = false
}

// 切换编辑模式
const toggleEditMode = async () => {
  if (isEditMode.value) {
    // 退出编辑模式，保存数据
    await saveEditData()
  }
  isEditMode.value = !isEditMode.value
}

// 保存编辑数据
const saveEditData = async () => {
  try {
    // 更新store中的数据
    resumeStore.resumeData = JSON.parse(JSON.stringify(editableResumeData.value))
    // 保存到localStorage
    resumeStore.saveToLocalStorage()
    ElMessage.success('修改已保存')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

// 处理数据更新
const handleDataUpdate = (newData: ResumeData) => {
  editableResumeData.value = newData
}

// 计算匹配的技能（本地计算，用于快速显示）
const matchedSkills = computed(() => {
  if (!resumeStore.jdAnalysis) return []
  
  // 从技能列表、项目名称、技术栈、描述中提取所有可能的技能
  const resumeSkills = resumeStore.resumeData.skills.map(s => s.toLowerCase().trim())
  const projectTexts = resumeStore.resumeData.projects.map(p => 
    `${p.name} ${p.techStack} ${p.description}`.toLowerCase()
  )
  const workTexts = resumeStore.resumeData.workExperience.map(w =>
    `${w.position} ${w.description}`.toLowerCase()
  )
  const allText = [
    ...resumeStore.resumeData.skills,
    resumeStore.resumeData.basicInfo.jobTitle,
    ...projectTexts,
    ...workTexts,
    resumeStore.resumeData.selfEvaluation
  ].join(' ').toLowerCase()

  return resumeStore.jdAnalysis.hardSkills.filter(skill => {
    const skillLower = skill.toLowerCase().trim()
    // 1. 检查是否在技能列表中（支持互相包含）
    const inSkills = resumeSkills.some(rs => 
      rs === skillLower || 
      rs.includes(skillLower) || 
      skillLower.includes(rs)
    )
    if (inSkills) return true
    
    // 2. 检查是否在所有文本中（支持互相包含）
    // 将文本拆分成词组进行检查
    const textParts = allText.split(/[\s,，、]+/)
    const inText = textParts.some(part => 
      part === skillLower ||
      part.includes(skillLower) ||
      skillLower.includes(part)
    )
    return inText
  })
})

// 计算缺失的技能
const missingSkills = computed(() => {
  if (!resumeStore.jdAnalysis) return []
  const matched = matchedSkills.value
  return resumeStore.jdAnalysis.hardSkills.filter(skill => 
    !matched.includes(skill)
  )
})

// 分数颜色
const scoreColor = computed(() => {
  if (matchScore.value >= 80) return '#67c23a'
  if (matchScore.value >= 60) return '#e6a23c'
  return '#f56c6c'
})

// 计算本地多维度匹配度（基于实际简历内容）
const calculateLocalMatchDimensions = (jdAnalysis: JDAnalysisResult) => {
  const resumeData = resumeStore.resumeData
  
  // 1. 技能匹配度（基于实际匹配的技能）
  const localMatched = matchedSkills.value
  const localMissing = missingSkills.value
  const skillMatchRate = jdAnalysis.hardSkills.length > 0 
    ? Math.round((localMatched.length / jdAnalysis.hardSkills.length) * 100) 
    : 0
  
  // 2. 项目相关度（检查是否有项目经历）
  const hasProjects = resumeData.projects.length > 0 && 
    resumeData.projects.some(p => p.name?.trim() || p.description?.trim() || p.techStack?.trim())
  // 项目匹配度：如果有项目，检查项目描述中是否包含JD关键词
  let projectMatchRate = 0
  if (hasProjects) {
    const projectText = resumeData.projects.map(p => `${p.name} ${p.description} ${p.techStack}`).join(' ').toLowerCase()
    // 如果有JD关键词，检查匹配度；如果没有关键词，只要有项目就给60分
    if (jdAnalysis.keywords && jdAnalysis.keywords.length > 0) {
      const matchedKeywords = jdAnalysis.keywords.filter((kw: string) => projectText.includes(kw.toLowerCase()))
      projectMatchRate = Math.round((matchedKeywords.length / jdAnalysis.keywords.length) * 100)
    } else {
      projectMatchRate = 60 // 有项目但没有JD关键词，给基础分
    }
  }
  
  // 3. 经验匹配度（检查是否有工作经历）
  const hasWorkExperience = resumeData.workExperience.length > 0 &&
    resumeData.workExperience.some(w => w.company?.trim() || w.position?.trim() || w.description?.trim())
  // 经验匹配度：如果有工作经历，检查是否包含JD关键词
  let experienceMatchRate = 0
  if (hasWorkExperience) {
    const workText = resumeData.workExperience.map(w => `${w.company} ${w.position} ${w.description}`).join(' ').toLowerCase()
    // 如果有JD关键词，检查匹配度；如果没有关键词，只要有经历就给60分
    if (jdAnalysis.keywords && jdAnalysis.keywords.length > 0) {
      const matchedKeywords = jdAnalysis.keywords.filter((kw: string) => workText.includes(kw.toLowerCase()))
      experienceMatchRate = Math.round((matchedKeywords.length / jdAnalysis.keywords.length) * 100)
    } else {
      experienceMatchRate = 60 // 有经历但没有JD关键词，给基础分
    }
  }
  
  // 4. 教育背景匹配度
  const hasEducation = resumeData.education.length > 0 &&
    resumeData.education.some(e => e.school?.trim() && e.major?.trim())
  const educationMatchRate = hasEducation ? 100 : 0
  
  return {
    skills: {
      score: skillMatchRate,
      matched: localMatched,
      missing: localMissing
    },
    projects: {
      score: projectMatchRate,
      relevance: hasProjects ? resumeData.projects.map(p => p.name).filter(Boolean) : []
    },
    experience: {
      score: experienceMatchRate,
      years: resumeData.workExperience.length,
      required: jdAnalysis.experienceRequired
    },
    education: {
      score: educationMatchRate,
      match: hasEducation
    }
  }
}

// 计算并更新匹配度（优先使用AI分析）
const updateMatchAnalysis = async () => {
  const jdAnalysis = resumeStore.jdAnalysis
  if (!jdAnalysis) return
  
  try {
    // 尝试使用AI进行多维度匹配度分析
    const resumeData = resumeStore.resumeData
    const analysis = await aiService.analyzeMatchDimensions(
      {
        skills: resumeData.skills,
        projects: resumeData.projects.map(p => ({
          name: p.name,
          description: p.description,
          technologies: p.techStack ? p.techStack.split(/[,，、\s]+/) : []
        })),
        workExperience: resumeData.workExperience.map(w => ({
          company: w.company,
          position: w.position,
          description: w.description
        })),
        education: resumeData.education.map(e => ({
          school: e.school,
          major: e.major,
          degree: e.degree
        }))
      },
      jdAnalysis
    )
    
    // 使用AI返回的结果，但技能匹配以本地计算为准（更准确）
    const localMatched = matchedSkills.value
    const localMissing = missingSkills.value
    const skillMatchRate = jdAnalysis.hardSkills.length > 0 
      ? Math.round((localMatched.length / jdAnalysis.hardSkills.length) * 100) 
      : 0
    
    matchScore.value = analysis.overallScore
    matchDimensions.value = {
      ...analysis.dimensions,
      skills: {
        score: skillMatchRate,
        matched: localMatched,
        missing: localMissing
      }
    }
    matchSuggestions.value = analysis.suggestions
    resumeStore.setMatchScore(analysis.overallScore)
    
  } catch (error) {
    console.log('AI匹配度分析失败，使用本地计算:', error)
    
    // AI失败时回退到本地计算
    const dimensions = calculateLocalMatchDimensions(jdAnalysis)
    
    const weights = { skills: 0.4, projects: 0.3, experience: 0.2, education: 0.1 }
    const overallScore = Math.round(
      dimensions.skills.score * weights.skills +
      dimensions.projects.score * weights.projects +
      dimensions.experience.score * weights.experience +
      dimensions.education.score * weights.education
    )
    
    matchScore.value = overallScore
    matchDimensions.value = dimensions
    
    const suggestions: string[] = []
    if (dimensions.skills.score < 50) {
      suggestions.push(`技能匹配度较低，建议学习：${dimensions.skills.missing.slice(0, 3).join('、')}`)
    }
    if (dimensions.projects.score === 0) {
      suggestions.push('缺少项目经历，建议补充相关项目')
    }
    if (dimensions.experience.score === 0) {
      suggestions.push('缺少工作经历，建议补充实习或工作经验')
    }
    if (dimensions.education.score === 0) {
      suggestions.push('缺少教育背景信息')
    }
    if (suggestions.length === 0) {
      suggestions.push('简历整体匹配度良好，建议继续优化项目描述')
    }
    matchSuggestions.value = suggestions
    
    resumeStore.setMatchScore(overallScore)
  }
}

// 监听JD分析变化
watch(() => resumeStore.jdAnalysis, async (newVal) => {
  if (newVal) {
    await updateMatchAnalysis()
  }
}, { immediate: true })

// 监听简历数据变化（深度监听）
watch(() => resumeStore.resumeData, async () => {
  if (resumeStore.jdAnalysis) {
    await updateMatchAnalysis()
  }
}, { deep: true })

// 导出PDF
const exportPDF = async () => {
  await new Promise(resolve => setTimeout(resolve, 500))

  if (!templateRef.value?.resumeRef) {
    ElMessage.error('简历内容未加载')
    return
  }

  // 保存当前状态
  const originalZoom = zoomLevel.value
  const originalEditMode = isEditMode.value

  try {
    ElMessage.info('正在生成PDF...')

    const element = templateRef.value.resumeRef
    
    // 临时重置缩放为1，并退出编辑模式，确保导出与预览一致
    zoomLevel.value = 1
    isEditMode.value = false
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 200))

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      foreignObjectRendering: false,
      imageTimeout: 0,
      onclone: (clonedDoc) => {
        // 确保克隆的文档中背景图片样式正确
        const photoBgs = clonedDoc.querySelectorAll('.photo-bg')
        photoBgs.forEach(photoBg => {
          ;(photoBg as HTMLElement).style.backgroundSize = 'cover'
          ;(photoBg as HTMLElement).style.backgroundPosition = 'center'
          ;(photoBg as HTMLElement).style.backgroundRepeat = 'no-repeat'
        })
      }
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)

    const imgX = (pdfWidth - imgWidth * ratio) / 2
    let imgY = 0

    let heightLeft = imgHeight * ratio
    let position = 0

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    heightLeft -= pdfHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight * ratio
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio)
      heightLeft -= pdfHeight
    }

    const fileName = `${resumeStore.resumeData.basicInfo.name || '简历'}_${resumeStore.resumeData.basicInfo.jobTitle || '求职'}.pdf`
    pdf.save(fileName)

    ElMessage.success('PDF导出成功')
  } catch (error) {
    console.error('PDF导出错误:', error)
    ElMessage.error('PDF导出失败')
  } finally {
    // 确保无论成功或失败都恢复原始状态
    zoomLevel.value = originalZoom
    isEditMode.value = originalEditMode
  }
}

// 导出Word
const exportWord = async () => {
  if (isEditMode.value) {
    ElMessage.warning('请先完成编辑再导出')
    return
  }

  try {
    ElMessage.info('正在生成Word文档...')
    await WordExportService.generateResumeWord(
      editableResumeData.value,
      selectedTemplate.value
    )
    ElMessage.success('Word导出成功')
  } catch (error) {
    console.error('Word导出错误:', error)
    ElMessage.error('Word导出失败')
  }
}
</script>

<style scoped>
.resume-preview {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.match-analysis {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 20px;
}

.match-score {
  flex-shrink: 0;
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.score-number {
  font-size: 28px;
  font-weight: bold;
}

.score-label {
  font-size: 12px;
}

.match-details {
  flex: 1;
}

.match-details h4 {
  margin: 0 0 10px 0;
}

.dimension-scores {
  margin-bottom: 15px;
}

.dimension-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 10px;
}

.dimension-name {
  font-size: 12px;
  color: #666;
  width: 60px;
  flex-shrink: 0;
}

.dimension-empty {
  font-size: 12px;
  color: #999;
  flex: 1;
  font-style: italic;
}

.dimension-item .el-progress {
  flex: 1;
}

.skill-match, .skill-missing {
  margin-bottom: 10px;
}

.match-suggestions {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px dashed #e0e0e0;
}

.suggestion-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #666;
}

.suggestion-list li {
  margin-bottom: 5px;
  line-height: 1.5;
}

.match-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
}

.match-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.no-match {
  font-size: 12px;
  color: #999;
}

.completion-rate {
  margin: 15px 0;
}

.rate-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.resume-summary {
  margin: 15px 0;
}

.resume-summary h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #333;
}

.skills-tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag-item {
  margin: 0;
}

.no-skills {
  color: #999;
  font-size: 12px;
}

.preview-hint {
  margin-top: 15px;
}

.preview-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.template-selector-dialog {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #f5f7fa;
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 10px;
}

.template-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.template-selector .label {
  font-size: 14px;
  color: #666;
}

.dialog-actions {
  display: flex;
  gap: 10px;
}

.edit-mode-banner {
  margin-bottom: 5px;
}

.resume-container-wrapper-dialog {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: #f0f2f5;
  border-radius: 8px;
  overflow: auto;
  max-height: 65vh;
}

.resume-container-wrapper-dialog.edit-mode {
  background: #e6f2ff;
  border: 2px dashed #409eff;
}

.resume-container-wrapper-dialog.fullscreen-wrapper {
  max-height: none;
  height: calc(100vh - 180px);
  padding: 40px;
}

.resume-scale-wrapper {
  transform-origin: top center;
}

/* 全屏对话框样式 */
:deep(.fullscreen-dialog) {
  margin: 0 !important;
  border-radius: 0 !important;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

:deep(.fullscreen-dialog .el-dialog__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.fullscreen-dialog .el-dialog__body) {
  flex: 1;
  padding: 0;
  overflow: hidden;
}

:deep(.preview-dialog .el-dialog__body) {
  padding: 10px 20px 20px;
}

/* 缩放控制样式 */
.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  border-right: 1px solid #dcdfe6;
  margin-right: 10px;
}

.zoom-value {
  font-size: 13px;
  color: #606266;
  min-width: 45px;
  text-align: center;
}

@media print {
  .template-selector-dialog,
  .edit-mode-banner {
    display: none !important;
  }
}
</style>
