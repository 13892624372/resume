import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface BasicInfo {
  name: string
  gender: string
  politicalStatus: string
  birthDate: string
  degree: string
  phone: string
  email: string
  location: string
  jobTitle: string
  targetCities: string[]
  signature: string
}

export interface Education {
  id: string
  school: string
  major: string
  degree: string
  startDate: string
  endDate: string
  description: string
}

export interface WorkExperience {
  id: string
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

export interface Project {
  id: string
  name: string
  role: string
  startDate: string
  endDate: string
  description: string
  techStack: string
}

export interface ResumeData {
  basicInfo: BasicInfo
  education: Education[]
  workExperience: WorkExperience[]
  projects: Project[]
  skills: string[]
  selfEvaluation: string
}

export interface JDAnalysis {
  position: string
  hardSkills: string[]
  softSkills: string[]
  experienceRequired: string
  keywords: string[]
  matchTips: string
}

export const useResumeStore = defineStore('resume', () => {
  // 简历数据
  const resumeData = ref<ResumeData>({
    basicInfo: {
      name: '',
      gender: '',
      politicalStatus: '',
      birthDate: '',
      degree: '',
      phone: '',
      email: '',
      location: '',
      jobTitle: '',
      targetCities: [],
      signature: ''
    },
    education: [],
    workExperience: [],
    projects: [],
    skills: [],
    selfEvaluation: ''
  })

  // JD分析结果
  const jdAnalysis = ref<JDAnalysis | null>(null)

  // 匹配度分数
  const matchScore = ref(0)

  // 计算属性：简历完整度
  const completionRate = computed(() => {
    let score = 0
    let total = 0

    // 基本信息（20分）
    total += 20
    if (resumeData.value.basicInfo.name?.trim()) score += 5
    if (resumeData.value.basicInfo.phone?.trim()) score += 5
    if (resumeData.value.basicInfo.email?.trim()) score += 5
    if (resumeData.value.basicInfo.jobTitle?.trim()) score += 5

    // 教育经历（20分）- 检查具体内容
    total += 20
    if (resumeData.value.education.length > 0) {
      const edu = resumeData.value.education[0]!
      let eduScore = 0
      if (edu.school?.trim()) eduScore += 5
      if (edu.major?.trim()) eduScore += 5
      if (edu.degree?.trim()) eduScore += 5
      if (edu.startDate?.trim() && edu.endDate?.trim()) eduScore += 5
      score += eduScore
    }

    // 工作经历（20分）- 检查具体内容
    total += 20
    if (resumeData.value.workExperience.length > 0) {
      const work = resumeData.value.workExperience[0]!
      let workScore = 0
      if (work.company?.trim()) workScore += 5
      if (work.position?.trim()) workScore += 5
      if (work.startDate?.trim() && work.endDate?.trim()) workScore += 5
      // 描述至少50字才算完整
      if (work.description?.trim().length >= 50) workScore += 5
      else if (work.description?.trim()) workScore += 2
      score += workScore
    }

    // 项目经历（20分）- 检查具体内容
    total += 20
    if (resumeData.value.projects.length > 0) {
      const project = resumeData.value.projects[0]!
      let projectScore = 0
      if (project.name?.trim()) projectScore += 5
      if (project.role?.trim()) projectScore += 5
      if (project.startDate?.trim() && project.endDate?.trim()) projectScore += 5
      // 描述至少50字才算完整
      if (project.description?.trim().length >= 50) projectScore += 5
      else if (project.description?.trim()) projectScore += 2
      score += projectScore
    }

    // 技能（10分）- 至少3个技能才算完整
    total += 10
    const skillCount = resumeData.value.skills.filter(s => s?.trim()).length
    if (skillCount >= 5) score += 10
    else if (skillCount >= 3) score += 7
    else if (skillCount >= 1) score += 3

    // 自我评价（10分）- 至少50字
    total += 10
    const evalLength = resumeData.value.selfEvaluation?.trim().length || 0
    if (evalLength >= 100) score += 10
    else if (evalLength >= 50) score += 7
    else if (evalLength >= 20) score += 3

    return Math.round((score / total) * 100)
  })

  // 更新基本信息
  const updateBasicInfo = (info: Partial<BasicInfo>) => {
    resumeData.value.basicInfo = { ...resumeData.value.basicInfo, ...info }
  }

  // 添加教育经历
  const addEducation = (edu: Education) => {
    resumeData.value.education.push(edu)
  }

  // 删除教育经历
  const removeEducation = (id: string) => {
    resumeData.value.education = resumeData.value.education.filter(e => e.id !== id)
  }

  // 添加工作经历
  const addWorkExperience = (work: WorkExperience) => {
    resumeData.value.workExperience.push(work)
  }

  // 删除工作经历
  const removeWorkExperience = (id: string) => {
    resumeData.value.workExperience = resumeData.value.workExperience.filter(w => w.id !== id)
  }

  // 添加项目经历
  const addProject = (project: Project) => {
    resumeData.value.projects.push(project)
  }

  // 删除项目经历
  const removeProject = (id: string) => {
    resumeData.value.projects = resumeData.value.projects.filter(p => p.id !== id)
  }

  // 更新技能
  const updateSkills = (skills: string[]) => {
    resumeData.value.skills = skills
  }

  // 更新自我评价
  const updateSelfEvaluation = (evaluation: string) => {
    resumeData.value.selfEvaluation = evaluation
  }

  // 设置JD分析结果
  const setJDAnalysis = (analysis: JDAnalysis) => {
    jdAnalysis.value = analysis
  }

  // 设置匹配度分数
  const setMatchScore = (score: number) => {
    matchScore.value = score
  }

  // 清空数据
  const clearData = () => {
    resumeData.value = {
      basicInfo: {
        name: '',
        age: '',
        phone: '',
        email: '',
        location: '',
        jobTitle: '',
        targetCity: ''
      },
      education: [],
      workExperience: [],
      projects: [],
      skills: [],
      selfEvaluation: ''
    }
    jdAnalysis.value = null
    matchScore.value = 0
  }

  // 保存到 localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('resume_data', JSON.stringify(resumeData.value))
    } catch (error) {
      console.error('保存简历数据失败:', error)
    }
  }

  // 从 localStorage 加载
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('resume_data')
      if (saved) {
        resumeData.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('加载简历数据失败:', error)
    }
  }

  return {
    resumeData,
    jdAnalysis,
    matchScore,
    completionRate,
    updateBasicInfo,
    addEducation,
    removeEducation,
    addWorkExperience,
    removeWorkExperience,
    addProject,
    removeProject,
    updateSkills,
    updateSelfEvaluation,
    setJDAnalysis,
    setMatchScore,
    clearData,
    saveToLocalStorage,
    loadFromLocalStorage
  }
})
