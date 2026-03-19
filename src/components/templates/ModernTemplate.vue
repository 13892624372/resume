<template>
  <div ref="resumeRef" class="modern-resume" :class="{ 'edit-mode': editMode }">
    <!-- 头部 -->
    <div class="header" :class="{ 'editable-section': editMode }">
      <div v-if="editMode" class="section-actions">
        <el-button type="primary" size="small" circle @click="moveSection('header', 'down')" :disabled="sectionOrder.indexOf('header') === sectionOrder.length - 1">
          <el-icon><ArrowDown /></el-icon>
        </el-button>
      </div>
      <div class="header-content">
        <div class="header-left">
          <h1 class="name">
            <EditableField
              v-model="localData.basicInfo.name"
              :edit-mode="editMode"
              tag="span"
              placeholder="姓名"
              @update:model-value="updateBasicInfo('name', $event)"
            />
          </h1>
          <div class="contact-info">
            <span v-if="localData.basicInfo.gender || editMode" class="contact-item">
              <span>性别：</span>
              <EditableField
                v-model="localData.basicInfo.gender"
                :edit-mode="editMode"
                tag="span"
                placeholder="性别"
                @update:model-value="updateBasicInfo('gender', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.politicalStatus || editMode" class="contact-item">
              <span>政治面貌：</span>
              <EditableField
                v-model="localData.basicInfo.politicalStatus"
                :edit-mode="editMode"
                tag="span"
                placeholder="政治面貌"
                @update:model-value="updateBasicInfo('politicalStatus', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.birthDate || editMode" class="contact-item">
              <span>出生年月：</span>
              <EditableField
                v-model="localData.basicInfo.birthDate"
                :edit-mode="editMode"
                tag="span"
                placeholder="2000.01"
                @update:model-value="updateBasicInfo('birthDate', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.degree || editMode" class="contact-item">
              <span>学历：</span>
              <EditableField
                v-model="localData.basicInfo.degree"
                :edit-mode="editMode"
                tag="span"
                placeholder="学历"
                @update:model-value="updateBasicInfo('degree', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.phone || editMode" class="contact-item">
              <span class="icon">📱</span>
              <EditableField
                v-model="localData.basicInfo.phone"
                :edit-mode="editMode"
                tag="span"
                placeholder="电话"
                @update:model-value="updateBasicInfo('phone', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.email || editMode" class="contact-item">
              <span class="icon">📧</span>
              <EditableField
                v-model="localData.basicInfo.email"
                :edit-mode="editMode"
                tag="span"
                placeholder="邮箱"
                @update:model-value="updateBasicInfo('email', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.location || editMode" class="contact-item">
              <span class="icon">📍</span>
              <EditableField
                v-model="localData.basicInfo.location"
                :edit-mode="editMode"
                tag="span"
                placeholder="地址"
                @update:model-value="updateBasicInfo('location', $event)"
              />
            </span>
          </div>
          <div v-if="localData.basicInfo.jobTitle || editMode" class="job-title">
            <span>求职意向：</span>
            <EditableField
              v-model="localData.basicInfo.jobTitle"
              :edit-mode="editMode"
              tag="span"
              placeholder="目标职位"
              @update:model-value="updateBasicInfo('jobTitle', $event)"
            />
          </div>
        </div>
        <div v-if="photoUrl || editMode" class="header-right">
          <img v-if="photoUrl" :src="photoUrl" alt="个人照片" class="photo" />
          <div v-else-if="editMode" class="photo-placeholder">
            <el-icon><User /></el-icon>
            <span>照片</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 动态区块 -->
    <template v-for="(sectionId, index) in sectionOrder" :key="sectionId">
      <!-- 教育背景 -->
      <div v-if="sectionId === 'education' && (localData.education.length > 0 || editMode)" 
           class="section" :class="{ 'editable-section': editMode }">
        <div v-if="editMode" class="section-actions">
          <el-button type="danger" size="small" circle @click="removeSection('education')">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('education', 'up')" :disabled="index === 0">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('education', 'down')" :disabled="index === sectionOrder.length - 1">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
        <h2 class="section-title">
          <EditableField
            v-model="sectionTitles.education"
            :edit-mode="editMode"
            tag="span"
            placeholder="教育背景"
          />
        </h2>
        <div class="items-list">
          <div v-for="(edu, eduIndex) in localData.education" :key="edu.id" class="item-card"
               :class="{ 'dragging': draggingEducation === eduIndex }"
               draggable="true"
               @dragstart="handleDragStart('education', eduIndex, $event)"
               @dragover="handleDragOver('education', eduIndex, $event)"
               @drop="handleDrop('education', eduIndex, $event)"
               @dragend="handleDragEnd('education')">
            <div v-if="editMode" class="drag-handle">
              <el-icon><Rank /></el-icon>
            </div>
            <div class="item-content">
              <div class="item-header">
                <div class="item-title-row">
                  <EditableField
                    v-model="edu.school"
                    :edit-mode="editMode"
                    tag="span"
                    class="item-name"
                    placeholder="学校名称"
                    @update:model-value="updateEducation(eduIndex, 'school', $event)"
                  />
                  <div class="date-range">
                    <EditableField
                      v-model="edu.startDate"
                      :edit-mode="editMode"
                      tag="span"
                      placeholder="开始时间"
                      @update:model-value="updateEducation(eduIndex, 'startDate', $event)"
                    />
                    <span> - </span>
                    <EditableField
                      v-model="edu.endDate"
                      :edit-mode="editMode"
                      tag="span"
                      placeholder="结束时间"
                      @update:model-value="updateEducation(eduIndex, 'endDate', $event)"
                    />
                  </div>
                </div>
                <div class="item-subtitle">
                  <EditableField
                    v-model="edu.major"
                    :edit-mode="editMode"
                    tag="span"
                    placeholder="专业"
                    @update:model-value="updateEducation(eduIndex, 'major', $event)"
                  />
                  <span> | </span>
                  <EditableField
                    v-model="edu.degree"
                    :edit-mode="editMode"
                    tag="span"
                    placeholder="学历"
                    @update:model-value="updateEducation(eduIndex, 'degree', $event)"
                  />
                </div>
              </div>
              <div class="item-body">
                <EditableField
                  v-model="edu.description"
                  :edit-mode="editMode"
                  tag="div"
                  class="item-description"
                  placeholder="描述内容（可选）"
                  multiline
                  @update:model-value="updateEducation(eduIndex, 'description', $event)"
                />
              </div>
            </div>
            <div v-if="editMode" class="item-actions">
              <el-button type="danger" size="small" text @click="deleteEducation(eduIndex)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="editMode" class="add-item-row">
          <el-button type="primary" plain size="small" @click="addEducation">
            <el-icon><Plus /></el-icon>添加教育经历
          </el-button>
        </div>
      </div>

      <!-- 工作经历 -->
      <div v-if="sectionId === 'work' && (localData.workExperience.length > 0 || editMode)" 
           class="section" :class="{ 'editable-section': editMode }">
        <div v-if="editMode" class="section-actions">
          <el-button type="danger" size="small" circle @click="removeSection('work')">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('work', 'up')" :disabled="index === 0">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('work', 'down')" :disabled="index === sectionOrder.length - 1">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
        <h2 class="section-title">
          <EditableField
            v-model="sectionTitles.work"
            :edit-mode="editMode"
            tag="span"
            placeholder="工作经历"
          />
        </h2>
        <div class="items-list">
          <div v-for="(work, workIndex) in localData.workExperience" :key="work.id" class="item-card"
               :class="{ 'dragging': draggingWork === workIndex }"
               draggable="true"
               @dragstart="handleDragStart('work', workIndex, $event)"
               @dragover="handleDragOver('work', workIndex, $event)"
               @drop="handleDrop('work', workIndex, $event)"
               @dragend="handleDragEnd('work')">
            <div v-if="editMode" class="drag-handle">
              <el-icon><Rank /></el-icon>
            </div>
            <div class="item-content">
              <div class="item-header">
                <div class="item-title-row">
                  <EditableField
                    v-model="work.company"
                    :edit-mode="editMode"
                    tag="span"
                    class="item-name"
                    placeholder="公司名称"
                    @update:model-value="updateWork(workIndex, 'company', $event)"
                  />
                  <div class="date-range">
                    <EditableField
                      v-model="work.startDate"
                      :edit-mode="editMode"
                      tag="span"
                      placeholder="开始时间"
                      @update:model-value="updateWork(workIndex, 'startDate', $event)"
                    />
                    <span> - </span>
                    <EditableField
                      v-model="work.endDate"
                      :edit-mode="editMode"
                      tag="span"
                      placeholder="结束时间"
                      @update:model-value="updateWork(workIndex, 'endDate', $event)"
                    />
                  </div>
                </div>
                <div class="item-subtitle">
                  <EditableField
                    v-model="work.position"
                    :edit-mode="editMode"
                    tag="span"
                    placeholder="职位"
                    @update:model-value="updateWork(workIndex, 'position', $event)"
                  />
                </div>
              </div>
              <div class="item-body">
                <EditableField
                  v-model="work.description"
                  :edit-mode="editMode"
                  tag="div"
                  class="item-description"
                  placeholder="工作描述"
                  multiline
                  @update:model-value="updateWork(workIndex, 'description', $event)"
                />
              </div>
            </div>
            <div v-if="editMode" class="item-actions">
              <el-button type="danger" size="small" text @click="deleteWork(workIndex)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="editMode" class="add-item-row">
          <el-button type="primary" plain size="small" @click="addWork">
            <el-icon><Plus /></el-icon>添加工作经历
          </el-button>
        </div>
      </div>

      <!-- 项目经历 -->
      <div v-if="sectionId === 'projects' && (localData.projects.length > 0 || editMode)" 
           class="section" :class="{ 'editable-section': editMode }">
        <div v-if="editMode" class="section-actions">
          <el-button type="danger" size="small" circle @click="removeSection('projects')">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('projects', 'up')" :disabled="index === 0">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('projects', 'down')" :disabled="index === sectionOrder.length - 1">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
        <h2 class="section-title">
          <EditableField
            v-model="sectionTitles.projects"
            :edit-mode="editMode"
            tag="span"
            placeholder="项目经历"
          />
        </h2>
        <div class="items-list">
          <div v-for="(project, projIndex) in localData.projects" :key="project.id" class="item-card"
               :class="{ 'dragging': draggingProject === projIndex }"
               draggable="true"
               @dragstart="handleDragStart('projects', projIndex, $event)"
               @dragover="handleDragOver('projects', projIndex, $event)"
               @drop="handleDrop('projects', projIndex, $event)"
               @dragend="handleDragEnd('projects')">
            <div v-if="editMode" class="drag-handle">
              <el-icon><Rank /></el-icon>
            </div>
            <div class="item-content">
              <div class="item-header">
                <div class="item-title-row">
                  <EditableField
                    v-model="project.name"
                    :edit-mode="editMode"
                    tag="span"
                    class="item-name"
                    placeholder="项目名称"
                    @update:model-value="updateProject(projIndex, 'name', $event)"
                  />
                  <EditableField
                    v-model="project.role"
                    :edit-mode="editMode"
                    tag="span"
                    class="item-role"
                    placeholder="担任角色"
                    @update:model-value="updateProject(projIndex, 'role', $event)"
                  />
                </div>
                <div v-if="project.techStack || editMode" class="tech-stack">
                  <span>技术栈：</span>
                  <EditableField
                    v-model="project.techStack"
                    :edit-mode="editMode"
                    tag="span"
                    placeholder="技术栈"
                    @update:model-value="updateProject(projIndex, 'techStack', $event)"
                  />
                </div>
              </div>
              <div class="item-body">
                <EditableField
                  v-model="project.description"
                  :edit-mode="editMode"
                  tag="div"
                  class="item-description"
                  placeholder="项目描述"
                  multiline
                  @update:model-value="updateProject(projIndex, 'description', $event)"
                />
              </div>
            </div>
            <div v-if="editMode" class="item-actions">
              <el-button type="danger" size="small" text @click="deleteProject(projIndex)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="editMode" class="add-item-row">
          <el-button type="primary" plain size="small" @click="addProject">
            <el-icon><Plus /></el-icon>添加项目经历
          </el-button>
        </div>
      </div>

      <!-- 专业技能 -->
      <div v-if="sectionId === 'skills' && (localData.skills.length > 0 || editMode)" 
           class="section" :class="{ 'editable-section': editMode }">
        <div v-if="editMode" class="section-actions">
          <el-button type="danger" size="small" circle @click="removeSection('skills')">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('skills', 'up')" :disabled="index === 0">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('skills', 'down')" :disabled="index === sectionOrder.length - 1">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
        <h2 class="section-title">
          <EditableField
            v-model="sectionTitles.skills"
            :edit-mode="editMode"
            tag="span"
            placeholder="专业技能"
          />
        </h2>
        <div class="skills-container">
          <div v-for="(skill, skillIndex) in localData.skills" :key="skillIndex" class="skill-tag-wrapper">
            <span class="skill-tag">
              <EditableField
                :model-value="skill"
                :edit-mode="editMode"
                tag="span"
                placeholder="技能"
                @update:model-value="updateSkill(skillIndex, $event)"
              />
            </span>
            <el-button v-if="editMode" type="danger" size="small" text circle @click="deleteSkill(skillIndex)">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          <el-button v-if="editMode" type="primary" plain size="small" @click="addSkill">
            <el-icon><Plus /></el-icon>添加技能
          </el-button>
        </div>
      </div>

      <!-- 自我评价 -->
      <div v-if="sectionId === 'evaluation' && (localData.selfEvaluation || editMode)" 
           class="section" :class="{ 'editable-section': editMode }">
        <div v-if="editMode" class="section-actions">
          <el-button type="danger" size="small" circle @click="removeSection('evaluation')">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('evaluation', 'up')" :disabled="index === 0">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('evaluation', 'down')" :disabled="index === sectionOrder.length - 1">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
        <h2 class="section-title">
          <EditableField
            v-model="sectionTitles.evaluation"
            :edit-mode="editMode"
            tag="span"
            placeholder="自我评价"
          />
        </h2>
        <EditableField
          v-model="localData.selfEvaluation"
          :edit-mode="editMode"
          tag="div"
          class="self-evaluation"
          placeholder="请输入自我评价"
          multiline
          @update:model-value="updateSelfEvaluation"
        />
      </div>
    </template>

    <!-- 添加区块按钮 -->
    <div v-if="editMode && availableSections.length > 0" class="add-section-row">
      <el-dropdown @command="addSection">
        <el-button type="success" plain>
          <el-icon><Plus /></el-icon>添加区块
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="section in availableSections" :key="section.id" :command="section.id">
              {{ section.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onActivated, watch } from 'vue'
import { Delete, ArrowUp, ArrowDown, Rank, Plus, Close, User } from '@element-plus/icons-vue'
import EditableField from '../EditableField.vue'
import type { ResumeData, Education, WorkExperience, Project } from '@/stores/resume'

const props = defineProps<{
  resumeData: ResumeData
  editMode?: boolean
}>()

const emit = defineEmits<{
  'update:data': [data: ResumeData]
}>()

const resumeRef = ref<HTMLElement>()
const photoUrl = ref('')

// 本地数据副本
const localData = ref<ResumeData>(JSON.parse(JSON.stringify(props.resumeData)))

// 区块标题
const sectionTitles = ref({
  education: '教育背景',
  work: '工作经历',
  projects: '项目经历',
  skills: '专业技能',
  evaluation: '自我评价'
})

// 区块顺序
const sectionOrder = ref(['education', 'projects', 'work', 'skills', 'evaluation'])

// 拖拽状态
const draggingEducation = ref<number | null>(null)
const draggingWork = ref<number | null>(null)
const draggingProject = ref<number | null>(null)

// 监听外部数据变化
watch(() => props.resumeData, (newVal) => {
  localData.value = JSON.parse(JSON.stringify(newVal))
}, { deep: true })

// 监听编辑模式
watch(() => props.editMode, (newVal) => {
  if (!newVal) {
    // 退出编辑模式时同步数据
    emit('update:data', JSON.parse(JSON.stringify(localData.value)))
  }
})

// 生成唯一ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

// 加载照片
const loadPhoto = () => {
  const savedPhoto = localStorage.getItem('resume_photo')
  photoUrl.value = savedPhoto || ''
}

onMounted(() => {
  loadPhoto()
  setInterval(() => {
    const savedPhoto = localStorage.getItem('resume_photo')
    if (savedPhoto !== photoUrl.value) {
      photoUrl.value = savedPhoto || ''
    }
  }, 1000)
})

onActivated(() => {
  loadPhoto()
})

// 可添加的区块
const availableSections = computed(() => {
  const allSections = [
    { id: 'education', name: '教育背景' },
    { id: 'work', name: '工作经历' },
    { id: 'projects', name: '项目经历' },
    { id: 'skills', name: '专业技能' },
    { id: 'evaluation', name: '自我评价' }
  ]
  return allSections.filter(s => !sectionOrder.value.includes(s.id))
})

// 更新基本信息
const updateBasicInfo = (field: string, value: string) => {
  localData.value.basicInfo = { ...localData.value.basicInfo, [field]: value }
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

// 更新自我评价
const updateSelfEvaluation = (value: string) => {
  localData.value.selfEvaluation = value
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

// 教育经历操作
const addEducation = () => {
  localData.value.education.push({
    id: generateId(),
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: '',
    description: ''
  })
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

const deleteEducation = (index: number) => {
  localData.value.education.splice(index, 1)
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

const updateEducation = (index: number, field: keyof Education, value: string) => {
  const item = localData.value.education[index]
  if (item) {
    localData.value.education[index] = { ...item, [field]: value }
    emit('update:data', JSON.parse(JSON.stringify(localData.value)))
  }
}

// 工作经历操作
const addWork = () => {
  localData.value.workExperience.push({
    id: generateId(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  })
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

const deleteWork = (index: number) => {
  localData.value.workExperience.splice(index, 1)
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

const updateWork = (index: number, field: keyof WorkExperience, value: string) => {
  const item = localData.value.workExperience[index]
  if (item) {
    localData.value.workExperience[index] = { ...item, [field]: value }
    emit('update:data', JSON.parse(JSON.stringify(localData.value)))
  }
}

// 项目经历操作
const addProject = () => {
  localData.value.projects.push({
    id: generateId(),
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    techStack: '',
    description: ''
  })
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

const deleteProject = (index: number) => {
  localData.value.projects.splice(index, 1)
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

const updateProject = (index: number, field: keyof Project, value: string) => {
  const item = localData.value.projects[index]
  if (item) {
    localData.value.projects[index] = { ...item, [field]: value }
    emit('update:data', JSON.parse(JSON.stringify(localData.value)))
  }
}

// 技能操作
const addSkill = () => {
  localData.value.skills.push('')
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

const deleteSkill = (index: number) => {
  localData.value.skills.splice(index, 1)
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

const updateSkill = (index: number, value: string) => {
  localData.value.skills[index] = value
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
}

// 区块操作
const addSection = (sectionId: string) => {
  sectionOrder.value.push(sectionId)
}

const removeSection = (sectionId: string) => {
  const index = sectionOrder.value.indexOf(sectionId)
  if (index > -1) {
    sectionOrder.value.splice(index, 1)
  }
}

const moveSection = (sectionId: string, direction: 'up' | 'down') => {
  const index = sectionOrder.value.indexOf(sectionId)
  if (direction === 'up' && index > 0) {
    const temp = sectionOrder.value[index]
    sectionOrder.value[index] = sectionOrder.value[index - 1]!
    sectionOrder.value[index - 1] = temp!
  } else if (direction === 'down' && index < sectionOrder.value.length - 1) {
    const temp = sectionOrder.value[index]
    sectionOrder.value[index] = sectionOrder.value[index + 1]!
    sectionOrder.value[index + 1] = temp!
  }
}

// 拖拽功能
const handleDragStart = (type: string, index: number, e: DragEvent) => {
  if (type === 'education') draggingEducation.value = index
  if (type === 'work') draggingWork.value = index
  if (type === 'projects') draggingProject.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, index }))
  }
}

const handleDragOver = (type: string, index: number, e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

const handleDrop = (type: string, index: number, e: DragEvent) => {
  e.preventDefault()
  const data = JSON.parse(e.dataTransfer?.getData('text/plain') || '{}')
  if (data.type !== type) return
  
  const fromIndex = data.index
  if (fromIndex === index) return
  
  if (type === 'education') {
    const items = [...localData.value.education]
    const movedItem = items[fromIndex]
    if (movedItem) {
      items.splice(fromIndex, 1)
      items.splice(index, 0, movedItem)
      localData.value.education = items
    }
  } else if (type === 'work') {
    const items = [...localData.value.workExperience]
    const movedItem = items[fromIndex]
    if (movedItem) {
      items.splice(fromIndex, 1)
      items.splice(index, 0, movedItem)
      localData.value.workExperience = items
    }
  } else if (type === 'projects') {
    const items = [...localData.value.projects]
    const movedItem = items[fromIndex]
    if (movedItem) {
      items.splice(fromIndex, 1)
      items.splice(index, 0, movedItem)
      localData.value.projects = items
    }
  }
  
  emit('update:data', JSON.parse(JSON.stringify(localData.value)))
  handleDragEnd(type)
}

const handleDragEnd = (type: string) => {
  if (type === 'education') draggingEducation.value = null
  if (type === 'work') draggingWork.value = null
  if (type === 'projects') draggingProject.value = null
}

defineExpose({
  resumeRef
})
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

/* 编辑模式样式 */
.edit-mode .editable-section {
  position: relative;
  padding: 12px;
  margin: -12px;
  border-radius: 8px;
  border: 2px dashed transparent;
  transition: all 0.2s ease;
}

.edit-mode .editable-section:hover {
  border-color: #409eff;
  background: rgba(64, 158, 255, 0.05);
}

.section-actions {
  position: absolute;
  right: 4px;
  top: 4px;
  display: flex;
  gap: 4px;
  z-index: 10;
}

/* 头部样式 */
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

.name {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #333;
}

.contact-info {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon {
  font-size: 14px;
}

.job-title {
  font-size: 16px;
  color: #409eff;
  font-weight: 500;
}

.photo {
  width: 100px;
  height: 130px;
  object-fit: cover;
  border-radius: 4px;
}

.photo-placeholder {
  width: 100px;
  height: 130px;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 12px;
}

.photo-placeholder .el-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

/* 区块样式 */
.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #333;
  padding-bottom: 5px;
  margin-bottom: 12px;
}

/* 条目卡片样式 */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  position: relative;
  display: flex;
  gap: 8px;
}

.edit-mode .item-card {
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.edit-mode .item-card:hover {
  border-color: #409eff;
}

.item-card.dragging {
  opacity: 0.5;
}

.drag-handle {
  display: flex;
  align-items: center;
  color: #909399;
  cursor: move;
}

.drag-handle:hover {
  color: #409eff;
}

.item-content {
  flex: 1;
}

.item-header {
  margin-bottom: 4px;
}

.item-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2px;
}

.item-name {
  font-weight: bold;
  font-size: 15px;
  color: #333;
}

.date-range {
  font-size: 13px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 4px;
}

.item-subtitle {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.item-role {
  font-size: 13px;
  color: #666;
}

.tech-stack {
  font-size: 13px;
  color: #666;
  margin-top: 2px;
}

.item-description {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
}

.item-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.item-card:hover .item-actions {
  opacity: 1;
}

/* 技能样式 */
.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.skill-tag-wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
}

.skill-tag {
  display: inline-block;
  padding: 4px 12px;
  background: #f0f2f5;
  border-radius: 4px;
  font-size: 13px;
  color: #333;
}

/* 自我评价 */
.self-evaluation {
  font-size: 14px;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

/* 添加按钮 */
.add-item-row {
  margin-top: 12px;
  text-align: center;
}

.add-section-row {
  margin-top: 24px;
  text-align: center;
  padding: 20px;
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
}

.add-section-row:hover {
  border-color: #409eff;
}
</style>
