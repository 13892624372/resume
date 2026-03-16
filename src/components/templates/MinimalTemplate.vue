<template>
  <div ref="resumeRef" class="minimal-resume">
    <div class="header">
      <div class="header-content-wrapper">
        <div class="header-text">
          <h1 class="name">{{ resumeData.basicInfo.name || '姓名' }}</h1>
          <div class="contact-info">
            <span v-if="resumeData.basicInfo.phone">{{ resumeData.basicInfo.phone }}</span>
            <span v-if="resumeData.basicInfo.email">{{ resumeData.basicInfo.email }}</span>
            <span v-if="resumeData.basicInfo.location">{{ resumeData.basicInfo.location }}</span>
            <span v-if="resumeData.basicInfo.age">{{ resumeData.basicInfo.age }}岁</span>
          </div>
          <div v-if="resumeData.basicInfo.jobTitle" class="job-title">
            {{ resumeData.basicInfo.jobTitle }}
            <span v-if="resumeData.basicInfo.targetCity"> · {{ resumeData.basicInfo.targetCity }}</span>
          </div>
        </div>
        <div v-if="photoUrl" class="header-photo">
          <img :src="photoUrl" alt="个人照片" class="photo" />
        </div>
      </div>
    </div>

    <div class="body">
      <div class="left-column">
        <div v-if="resumeData.education.length > 0" class="section">
          <h2 class="section-title">教育背景</h2>
          <div v-for="edu in resumeData.education" :key="edu.id" class="item">
            <div class="item-title">{{ edu.school }}</div>
            <div class="item-subtitle">{{ edu.major }} <span v-if="edu.degree">· {{ edu.degree }}</span></div>
            <div class="item-time">{{ edu.startDate }} - {{ edu.endDate }}</div>
          </div>
        </div>

        <div v-if="resumeData.skills.length > 0" class="section">
          <h2 class="section-title">技能特长</h2>
          <div class="skills-list">
            <span v-for="(skill, index) in resumeData.skills" :key="index" class="skill-item">{{ skill }}</span>
          </div>
        </div>

        <div v-if="resumeData.selfEvaluation" class="section">
          <h2 class="section-title">自我评价</h2>
          <p class="evaluation-text">{{ resumeData.selfEvaluation }}</p>
        </div>
      </div>

      <div class="right-column">
        <div v-if="resumeData.workExperience.length > 0" class="section">
          <h2 class="section-title">工作经历</h2>
          <div v-for="work in resumeData.workExperience" :key="work.id" class="item">
            <div class="item-header-row">
              <span class="item-title">{{ work.company }}</span>
              <span class="item-time">{{ work.startDate }} - {{ work.endDate }}</span>
            </div>
            <div class="item-subtitle">{{ work.position }}</div>
            <div class="item-desc">{{ work.description }}</div>
          </div>
        </div>

        <div v-if="resumeData.projects.length > 0" class="section">
          <h2 class="section-title">项目经历</h2>
          <div v-for="project in resumeData.projects" :key="project.id" class="item">
            <div class="item-header-row">
              <span class="item-title">{{ project.name }}</span>
              <span class="item-time">{{ project.startDate }} - {{ project.endDate }}</span>
            </div>
            <div class="item-subtitle">{{ project.role }}</div>
            <div class="item-desc">{{ project.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ResumeData } from '@/stores/resume'

defineProps<{
  resumeData: ResumeData
}>()

const resumeRef = ref<HTMLElement>()
const photoUrl = ref('')

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
.minimal-resume {
  width: 210mm;
  min-height: 297mm;
  background: white;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  color: #333;
  line-height: 1.6;
}

.header {
  background: #10b981;
  padding: 25mm 20mm 20mm;
  color: white;
}

.header-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-text {
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
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.name {
  font-size: 32pt;
  font-weight: 300;
  margin: 0 0 12px 0;
  letter-spacing: 2px;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.contact-info span {
  font-size: 10pt;
  opacity: 0.95;
}

.contact-info span:not(:last-child)::after {
  content: " · ";
  margin-left: 8px;
}

.job-title {
  font-size: 13pt;
  opacity: 0.9;
  font-weight: 300;
}

.body {
  display: flex;
  padding: 15mm 20mm;
  gap: 15mm;
}

.left-column {
  width: 65mm;
}

.right-column {
  flex: 1;
}

.section {
  margin-bottom: 22px;
}

.section-title {
  font-size: 12pt;
  color: #10b981;
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5e7eb;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.item {
  margin-bottom: 15px;
}

.item-header-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 3px;
}

.item-title {
  font-weight: 600;
  font-size: 11pt;
  color: #1f2937;
}

.item-subtitle {
  font-size: 10pt;
  color: #6b7280;
  margin-bottom: 5px;
}

.item-time {
  font-size: 9pt;
  color: #9ca3af;
}

.item-desc {
  font-size: 9.5pt;
  color: #4b5563;
  line-height: 1.5;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-item {
  background: #ecfdf5;
  color: #059669;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 9pt;
}

.evaluation-text {
  font-size: 9.5pt;
  color: #4b5563;
  line-height: 1.6;
}
</style>
