<template>
  <div ref="resumeRef" class="classic-resume">
    <!-- 头部 -->
    <div class="header">
      <div class="header-main">
        <h1 class="name">{{ resumeData.basicInfo.name || '姓名' }}</h1>
        <div class="contact-row">
          <span v-if="resumeData.basicInfo.phone" class="contact-item">
            <el-icon><Phone /></el-icon>{{ resumeData.basicInfo.phone }}
          </span>
          <span v-if="resumeData.basicInfo.email" class="contact-item">
            <el-icon><Message /></el-icon>{{ resumeData.basicInfo.email }}
          </span>
          <span v-if="resumeData.basicInfo.location" class="contact-item">
            <el-icon><Location /></el-icon>{{ resumeData.basicInfo.location }}
          </span>
          <span v-if="resumeData.basicInfo.age" class="contact-item">
            <el-icon><User /></el-icon>{{ resumeData.basicInfo.age }}岁
          </span>
        </div>
        <div v-if="resumeData.basicInfo.jobTitle" class="job-title">
          求职意向：{{ resumeData.basicInfo.jobTitle }}
          <span v-if="resumeData.basicInfo.targetCity"> | {{ resumeData.basicInfo.targetCity }}</span>
        </div>
      </div>
      <div v-if="photoUrl" class="header-photo">
        <img :src="photoUrl" alt="个人照片" class="photo" />
      </div>
    </div>

    <!-- 教育背景 -->
    <div v-if="resumeData.education.length > 0" class="section">
      <h2 class="section-title">
        <span class="title-icon">&#127891;</span>教育背景
      </h2>
      <div v-for="edu in resumeData.education" :key="edu.id" class="education-item">
        <div class="item-header">
          <span class="school">{{ edu.school }}</span>
          <span class="time">{{ edu.startTime }} - {{ edu.endTime }}</span>
        </div>
        <div class="item-detail">
          <span>{{ edu.major }}</span>
          <span v-if="edu.degree"> | {{ edu.degree }}</span>
        </div>
      </div>
    </div>

    <!-- 工作经历 -->
    <div v-if="resumeData.workExperience.length > 0" class="section">
      <h2 class="section-title">
        <span class="title-icon">&#128188;</span>工作经历
      </h2>
      <div v-for="work in resumeData.workExperience" :key="work.id" class="work-item">
        <div class="item-header">
          <span class="company">{{ work.company }}</span>
          <span class="time">{{ work.startTime }} - {{ work.endTime }}</span>
        </div>
        <div class="position">{{ work.position }}</div>
        <div class="description">{{ work.description }}</div>
      </div>
    </div>

    <!-- 项目经历 -->
    <div v-if="resumeData.projects.length > 0" class="section">
      <h2 class="section-title">
        <span class="title-icon">&#128187;</span>项目经历
      </h2>
      <div v-for="project in resumeData.projects" :key="project.id" class="project-item">
        <div class="item-header">
          <span class="project-name">{{ project.name }}</span>
          <span class="time">{{ project.startTime }} - {{ project.endTime }}</span>
        </div>
        <div class="role">{{ project.role }}</div>
        <div class="description">{{ project.description }}</div>
      </div>
    </div>

    <!-- 技能特长 -->
    <div v-if="resumeData.skills.length > 0" class="section">
      <h2 class="section-title">
        <span class="title-icon">&#128295;</span>技能特长
      </h2>
      <div class="skills-list">
        <span v-for="(skill, index) in resumeData.skills" :key="index" class="skill-tag">
          {{ skill }}
        </span>
      </div>
    </div>

    <!-- 自我评价 -->
    <div v-if="resumeData.selfEvaluation" class="section">
      <h2 class="section-title">
        <span class="title-icon">&#128172;</span>自我评价
      </h2>
      <p class="self-evaluation">{{ resumeData.selfEvaluation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ResumeData } from '@/stores/resume'
import { Phone, Message, Location, User } from '@element-plus/icons-vue'

defineProps<{
  resumeData: ResumeData
}>()

const resumeRef = ref<HTMLElement>()
const photoUrl = ref('')

// 加载照片
const loadPhoto = () => {
  const savedPhoto = localStorage.getItem('resume_photo')
  if (savedPhoto) {
    photoUrl.value = savedPhoto
  } else {
    photoUrl.value = ''
  }
}

onMounted(() => {
  loadPhoto()
})

// 每秒检查一次照片更新
setInterval(() => {
  const savedPhoto = localStorage.getItem('resume_photo')
  if (savedPhoto && savedPhoto !== photoUrl.value) {
    photoUrl.value = savedPhoto
  } else if (!savedPhoto && photoUrl.value) {
    photoUrl.value = ''
  }
}, 1000)

defineExpose({
  resumeRef
})
</script>

<style scoped>
.classic-resume {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  background: white;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  color: #2c3e50;
  line-height: 1.6;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 20px;
  border-bottom: 3px solid #1e3a8a;
  margin-bottom: 25px;
}

.header-main {
  flex: 1;
}

.header-photo {
  margin-left: 20px;
}

.photo {
  width: 100px;
  height: 140px;
  object-fit: cover;
  object-position: center top;
  border: 2px solid #1e3a8a;
  border-radius: 4px;
}

.name {
  font-size: 32pt;
  color: #1e3a8a;
  margin: 0 0 15px 0;
  font-weight: bold;
}

.contact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5pt;
  color: #4b5563;
}

.job-title {
  font-size: 12pt;
  color: #1e3a8a;
  font-weight: 600;
  margin-top: 10px;
}

.section {
  margin-bottom: 22px;
}

.section-title {
  font-size: 14pt;
  color: #1e3a8a;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 16pt;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.school, .company, .project-name {
  font-weight: bold;
  font-size: 11pt;
  color: #1f2937;
}

.time {
  font-size: 9.5pt;
  color: #6b7280;
}

.item-detail, .position, .role {
  font-size: 10.5pt;
  color: #4b5563;
  margin-bottom: 5px;
}

.description {
  font-size: 10pt;
  color: #374151;
  line-height: 1.5;
  text-align: justify;
}

.education-item, .work-item, .project-item {
  margin-bottom: 15px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.skill-tag {
  background: #dbeafe;
  color: #1e3a8a;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 10pt;
  border: 1px solid #93c5fd;
}

.self-evaluation {
  font-size: 10.5pt;
  color: #374151;
  line-height: 1.6;
  text-align: justify;
}
</style>
