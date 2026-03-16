import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface BasicInfo {
  name: string
  age: string
  phone: string
  email: string
  location: string
  jobTitle: string
  targetCity: string
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
  })

  // JD分析结果
  const jdAnalysis = ref<JDAnalysis | null>(null)

  // 匹配度分数
  const matchScore = ref(0)

  // 计算属性：简历完整度
  const completionRate = computed(() => {
    let score = 0
    let total = 0

    // 基本信息
    total += 20
    if (resumeData.value.basicInfo.name) score += 5
    if (resumeData.value.basicInfo.phone) score += 5
    if (resumeData.value.basicInfo.email) score += 5
    if (resumeData.value.basicInfo.jobTitle) score += 5

    // 教育经历
    total += 20
    if (resumeData.value.education.length > 0) score += 20

    // 工作经历
    total += 20
    if (resumeData.value.workExperience.length > 0) score += 20

    // 项目经历
    total += 20
    if (resumeData.value.projects.length > 0) score += 20

    // 技能
    total += 10
    if (resumeData.value.skills.length > 0) score += 10

    // 自我评价
    total += 10
    if (resumeData.value.selfEvaluation) score += 10

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
    clearData
  }
})
