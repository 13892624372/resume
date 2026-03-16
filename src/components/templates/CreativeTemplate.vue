<template>
  <div ref="resumeRef" class="creative-resume">
    <!-- 左侧栏 -->
    <div class="left-sidebar">
      <div class="profile-section">
        <div v-if="photoUrl" class="photo-container">
          <img :src="photoUrl" alt="个人照片" class="photo" />
        </div>
        <h1 class="name">{{ resumeData.basicInfo.name || '姓名' }}</h1>
        <div v-if="resumeData.basicInfo.jobTitle" class="job-title">
          {{ resumeData.basicInfo.jobTitle }}
        </div>
      </div>

      <!-- 联系信息 -->
      <div class="sidebar-section">
        <h3 class="sidebar-title">联系方式</h3>
        <div class="contact-list">
          <div v-if="resumeData.basicInfo.phone" class="contact-item">
            <span class="contact-icon">&#128241;</span>
            <span>{{ resumeData.basicInfo.phone }}</span>
          </div>
          <div v-if="resumeData.basicInfo.email" class="contact-item">
            <span class="contact-icon">&#9993;</span>
            <span>{{ resumeData.basicInfo.email }}</span>
          </div>
          <div v-if="resumeData.basicInfo.location" class="contact-item">
            <span class="contact-icon">&#128205;</span>
            <span>{{ resumeData.basicInfo.location }}</span>
          </div>
          <div v-if="resumeData.basicInfo.age" class="contact-item">
            <span class="contact-icon">&#128100;</span>
            <span>{{ resumeData.basicInfo.age }}岁</span>
          </div>
        </div>
      </div>

      <!-- 技能 -->
      <div v-if="resumeData.skills.length > 0" class="sidebar-section">
        <h3 class="sidebar-title">技能特长</h3>
        <div class="skills-container">
          <div v-for="(skill, index) in resumeData.skills" :key="index" class="skill-item">
            <div class="skill-name">{{ skill }}</div>
            <div class="skill-bar">
              <div class="skill-progress" :style="{ width: (85 + Math.random() * 15) + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 期望城市 -->
      <div v-if="resumeData.basicInfo.targetCity" class="sidebar-section">
        <h3 class="sidebar-title">期望城市</h3>
        <div class="target-city">{{ resumeData.basicInfo.targetCity }}</div>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="main-content">
      <!-- 教育背景 -->
      <div v-if="resumeData.education.length > 0" class="content-section">
        <h2 class="content-title">
          <span class="title-deco"></span>教育背景
        </h2>
        <div v-for="edu in resumeData.education" :key="edu.id" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="item-header">
              <span class="school">{{ edu.school }}</span>
              <span class="time">{{ edu.startTime }} - {{ edu.endTime }}</span>
            </div>
            <div class="major">{{ edu.major }} <span v-if="edu.degree">| {{ edu.degree }}</span></div>
          </div>
        </div>
      </div>

      <!-- 工作经历 -->
      <div v-if="resumeData.workExperience.length > 0" class="content-section">
        <h2 class="content-title">
          <span class="title-deco"></span>工作经历
        </h2>
        <div v-for="work in resumeData.workExperience" :key="work.id" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="item-header">
              <span class="company">{{ work.company }}</span>
              <span class="time">{{ work.startTime }} - {{ work.endTime }}</span>
            </div>
            <div class="position">{{ work.position }}</div>
            <div class="description">{{ work.description }}</div>
          </div>
        </div>
      </div>

      <!-- 项目经历 -->
      <div v-if="resumeData.projects.length > 0" class="content-section">
        <h2 class="content-title">
          <span class="title-deco"></span>项目经历
        </h2>
        <div v-for="project in resumeData.projects" :key="project.id" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="item-header">
              <span class="project-name">{{ project.name }}</span>
              <span class="time">{{ project.startTime }} - {{ project.endTime }}</span>
            </div>
            <div class="role">{{ project.role }}</div>
            <div class="description">{{ project.description }}</div>
          </div>
        </div>
      </div>

      <!-- 自我评价 -->
      <div v-if="resumeData.selfEvaluation" class="content-section">
        <h2 class="content-title">
          <span class="title-deco"></span>自我评价
        </h2>
        <p class="self-evaluation">{{ resumeData.selfEvaluation }}</p>
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
.creative-resume {
  width: 210mm;
  min-height: 297mm;
  display: flex;
  background: white;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  color: #333;
  line-height: 1.6;
}

.left-sidebar {
  width: 70mm;
  background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 20mm 8mm;
}

.profile-section {
  text-align: center;
  margin-bottom: 25px;
}

.photo-container {
  width: 90px;
  height: 90px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.name {
  font-size: 20pt;
  font-weight: bold;
  margin: 0 0 8px 0;
}

.job-title {
  font-size: 11pt;
  opacity: 0.9;
}

.sidebar-section {
  margin-bottom: 25px;
}

.sidebar-title {
  font-size: 12pt;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 8px;
  margin-bottom: 15px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 9.5pt;
}

.contact-icon {
  font-size: 12pt;
}

.skills-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-item {
  margin-bottom: 8px;
}

.skill-name {
  font-size: 9.5pt;
  margin-bottom: 4px;
}

.skill-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: white;
  border-radius: 3px;
  transition: width 0.3s;
}

.target-city {
  font-size: 10pt;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.main-content {
  flex: 1;
  padding: 15mm 12mm;
  background: white;
}

.content-section {
  margin-bottom: 25px;
}

.content-title {
  font-size: 14pt;
  color: #6366f1;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-deco {
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 2px;
}

.timeline-item {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  position: relative;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  background: #6366f1;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 5px;
}

.timeline-content {
  flex: 1;
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
  font-size: 9pt;
  color: #6b7280;
}

.major, .position, .role {
  font-size: 10pt;
  color: #6366f1;
  margin-bottom: 5px;
}

.description {
  font-size: 9.5pt;
  color: #4b5563;
  line-height: 1.5;
}

.self-evaluation {
  font-size: 10pt;
  color: #374151;
  line-height: 1.6;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
  border-left: 3px solid #6366f1;
}
</style>
