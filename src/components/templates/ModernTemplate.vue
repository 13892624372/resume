<template>
  <div ref="resumeRef" class="modern-resume">
    <!-- 头部 -->
    <div class="header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="name" :contenteditable="editMode" @blur="updateField('basicInfo.name', $event)">{{ resumeData.basicInfo.name || '姓名' }}</h1>
          <div class="contact-info">
            <span v-if="resumeData.basicInfo.phone || editMode" :contenteditable="editMode" @blur="updateField('basicInfo.phone', $event)">📱 {{ resumeData.basicInfo.phone || '电话' }}</span>
            <span v-if="resumeData.basicInfo.email || editMode" :contenteditable="editMode" @blur="updateField('basicInfo.email', $event)">📧 {{ resumeData.basicInfo.email || '邮箱' }}</span>
            <span v-if="resumeData.basicInfo.location || editMode" :contenteditable="editMode" @blur="updateField('basicInfo.location', $event)">📍 {{ resumeData.basicInfo.location || '地址' }}</span>
            <span v-if="resumeData.basicInfo.age || editMode" :contenteditable="editMode" @blur="updateField('basicInfo.age', $event)">年龄：{{ resumeData.basicInfo.age || '23' }}岁</span>
          </div>
          <div v-if="resumeData.basicInfo.jobTitle || editMode" class="job-title" :contenteditable="editMode" @blur="updateField('basicInfo.jobTitle', $event)">
            求职意向：{{ resumeData.basicInfo.jobTitle || '目标职位' }}
          </div>
        </div>
        <div v-if="photoUrl" class="header-right">
          <img :src="photoUrl" alt="个人照片" class="photo" />
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <div v-if="resumeData.education.length > 0" class="section">
      <h2 class="section-title">教育背景</h2>
      <div v-for="edu in resumeData.education" :key="edu.id" class="education-item">
        <div class="item-header">
          <span class="school">{{ edu.school }}</span>
          <span class="date">{{ edu.startDate }} - {{ edu.endDate }}</span>
        </div>
        <div class="major">{{ edu.major }} | {{ edu.degree }}</div>
        <div v-if="edu.description" class="description">{{ edu.description }}</div>
      </div>
    </div>

    <!-- 工作经历 -->
    <div v-if="resumeData.workExperience.length > 0" class="section">
      <h2 class="section-title">工作经历</h2>
      <div v-for="work in resumeData.workExperience" :key="work.id" class="work-item">
        <div class="item-header">
          <span class="company">{{ work.company }}</span>
          <span class="date">{{ work.startDate }} - {{ work.endDate }}</span>
        </div>
        <div class="position">{{ work.position }}</div>
        <div v-if="work.description" class="description">
          <p v-for="(line, index) in work.description.split('\n').filter(l => l.trim())" :key="index">
            {{ line }}
          </p>
        </div>
      </div>
    </div>

    <!-- 项目经历 -->
    <div v-if="resumeData.projects.length > 0" class="section">
      <h2 class="section-title">项目经历</h2>
      <div v-for="project in resumeData.projects" :key="project.id" class="project-item">
        <div class="item-header">
          <span class="project-name">{{ project.name }}</span>
          <span class="role">{{ project.role }}</span>
        </div>
        <div v-if="project.techStack" class="tech-stack">技术栈：{{ project.techStack }}</div>
        <div v-if="project.description" class="description">
          <p v-for="(line, index) in project.description.split('\n').filter(l => l.trim())" :key="index">
            {{ line }}
          </p>
        </div>
      </div>
    </div>

    <!-- 专业技能 -->
    <div v-if="resumeData.skills.length > 0" class="section">
      <h2 class="section-title">专业技能</h2>
      <div class="skills">
        <span v-for="(skill, index) in resumeData.skills" :key="index" class="skill-tag">
          {{ skill }}
        </span>
      </div>
    </div>

    <!-- 自我评价 -->
    <div v-if="resumeData.selfEvaluation" class="section">
      <h2 class="section-title">自我评价</h2>
      <p class="self-evaluation">{{ resumeData.selfEvaluation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated, watch } from 'vue'
import type { ResumeData } from '@/stores/resume'

const props = defineProps<{
  resumeData: ResumeData
  editMode?: boolean
}>()

const resumeRef = ref<HTMLElement>()
const photoUrl = ref('')
const isEditMode = ref(props.editMode || false)

// 监听编辑模式变化
watch(() => props.editMode, (newVal) => {
  isEditMode.value = newVal || false
  if (resumeRef.value) {
    if (isEditMode.value) {
      resumeRef.value.classList.add('editable')
    } else {
      resumeRef.value.classList.remove('editable')
    }
  }
})

// 加载照片
const loadPhoto = () => {
  const savedPhoto = localStorage.getItem('resume_photo')
  if (savedPhoto) {
    photoUrl.value = savedPhoto
  } else {
    photoUrl.value = ''
  }
}

// 从 localStorage 加载照片
onMounted(() => {
  loadPhoto()
})

// 组件激活时重新加载（用于对话框打开时）
onActivated(() => {
  loadPhoto()
})

// 每秒检查一次照片更新（临时方案）
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

// 更新字段方法
const updateField = (field: string, event: Event) => {
  const target = event.target as HTMLElement
  let value = target.innerText
  
  // 移除 emoji 前缀
  if (value.startsWith('📱 ')) value = value.substring(2)
  if (value.startsWith('📧 ')) value = value.substring(2)
  if (value.startsWith('📍 ')) value = value.substring(2)
  if (value.startsWith('年龄：')) value = value.substring(3)
  if (value.endsWith('岁')) value = value.substring(0, value.length - 1)
  if (value.startsWith('求职意向：')) value = value.substring(5)
  if (value.startsWith('技术栈：')) value = value.substring(4)
  
  // 触发更新事件
  emit('update:field', field, value.trim())
}

const emit = defineEmits<{
  'update:field': [field: string, value: string]
}>()
</script>

<style scoped>
.modern-resume {
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  background: white;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  color: #333;
  line-height: 1.6;
}

.header {
  padding-bottom: 20px;
  border-bottom: 2px solid #333;
  margin-bottom: 25px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left {
  flex: 1;
  text-align: center;
}

.header-right {
  margin-left: 20px;
}

.photo {
  width: 100px;
  height: 140px;
  object-fit: contain;
  object-position: center center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.name {
  font-size: 28pt;
  color: #333;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 10pt;
  color: #666;
  margin-bottom: 8px;
}

.job-title {
  font-size: 12pt;
  color: #333;
  font-weight: 500;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14pt;
  color: #333;
  border-left: 4px solid #333;
  padding-left: 10px;
  margin-bottom: 12px;
  font-weight: bold;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.school, .company, .project-name {
  font-size: 12pt;
  font-weight: bold;
  color: #333;
}

.date {
  font-size: 10pt;
  color: #666;
}

.major, .position, .role {
  font-size: 11pt;
  color: #555;
  margin-bottom: 5px;
}

.tech-stack {
  font-size: 10pt;
  color: #666;
  margin-bottom: 5px;
}

.description {
  font-size: 10pt;
  color: #555;
  line-height: 1.8;
}

.description p {
  margin: 3px 0;
  position: relative;
  padding-left: 12px;
}

.description p::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #666;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: #f5f5f5;
  color: #333;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 10pt;
  border: 1px solid #ddd;
}

.self-evaluation {
  font-size: 10pt;
  color: #555;
  line-height: 1.8;
  text-align: justify;
}

.education-item, .work-item, .project-item {
  margin-bottom: 15px;
}

/* 编辑模式样式 */
.editable .name,
.editable .contact-info span,
.editable .job-title,
.editable .school,
.editable .major,
.editable .date,
.editable .company,
.editable .position,
.editable .project-name,
.editable .role,
.editable .tech-stack,
.editable .description,
.editable .skill-tag,
.editable .self-evaluation {
  cursor: text;
  min-height: 1.2em;
}

.editable .name:hover,
.editable .contact-info span:hover,
.editable .job-title:hover,
.editable .school:hover,
.editable .major:hover,
.editable .date:hover,
.editable .company:hover,
.editable .position:hover,
.editable .project-name:hover,
.editable .role:hover,
.editable .tech-stack:hover,
.editable .description:hover,
.editable .skill-tag:hover,
.editable .self-evaluation:hover {
  background-color: rgba(64, 158, 255, 0.1);
  outline: 1px dashed #409eff;
}

.editable [contenteditable="true"]:focus {
  background-color: rgba(64, 158, 255, 0.15);
  outline: 2px solid #409eff;
}

@media print {
  .modern-resume {
    box-shadow: none;
  }
  
  .editable .name:hover,
  .editable .contact-info span:hover,
  .editable .job-title:hover,
  .editable .school:hover,
  .editable .major:hover,
  .editable .date:hover,
  .editable .company:hover,
  .editable .position:hover,
  .editable .project-name:hover,
  .editable .role:hover,
  .editable .tech-stack:hover,
  .editable .description:hover,
  .editable .skill-tag:hover,
  .editable .self-evaluation:hover {
    background-color: transparent;
    outline: none;
  }
}
</style>
