<template>
  <div ref="resumeRef" class="minimal-resume" :class="{ 'edit-mode': editMode }">
    <!-- 头部 -->
    <div class="header" :class="{ 'editable-section': editMode }">
      <div v-if="editMode" class="section-actions">
        <el-button type="primary" size="small" circle @click="moveSection('header', 'down')" :disabled="sectionOrder.indexOf('header') === sectionOrder.length - 1">
          <el-icon><ArrowDown /></el-icon>
        </el-button>
      </div>
      <div class="header-content-wrapper">
        <div class="header-text">
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
              <EditableField
                v-model="localData.basicInfo.gender"
                :edit-mode="editMode"
                tag="span"
                placeholder="性别"
                @update:model-value="updateBasicInfo('gender', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.politicalStatus || editMode" class="contact-item">
              <EditableField
                v-model="localData.basicInfo.politicalStatus"
                :edit-mode="editMode"
                tag="span"
                placeholder="政治面貌"
                @update:model-value="updateBasicInfo('politicalStatus', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.birthDate || editMode" class="contact-item">
              <EditableField
                v-model="localData.basicInfo.birthDate"
                :edit-mode="editMode"
                tag="span"
                placeholder="2000.01"
                @update:model-value="updateBasicInfo('birthDate', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.degree || editMode" class="contact-item">
              <EditableField
                v-model="localData.basicInfo.degree"
                :edit-mode="editMode"
                tag="span"
                placeholder="学历"
                @update:model-value="updateBasicInfo('degree', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.phone || editMode" class="contact-item">
              <EditableField
                v-model="localData.basicInfo.phone"
                :edit-mode="editMode"
                tag="span"
                placeholder="电话"
                @update:model-value="updateBasicInfo('phone', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.email || editMode" class="contact-item">
              <EditableField
                v-model="localData.basicInfo.email"
                :edit-mode="editMode"
                tag="span"
                placeholder="邮箱"
                @update:model-value="updateBasicInfo('email', $event)"
              />
            </span>
            <span v-if="localData.basicInfo.location || editMode" class="contact-item">
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
            <EditableField
              v-model="localData.basicInfo.jobTitle"
              :edit-mode="editMode"
              tag="span"
              placeholder="目标职位"
              @update:model-value="updateBasicInfo('jobTitle', $event)"
            />
            <span v-if="localData.basicInfo.targetCities?.length > 0 || editMode">
              <span> · </span>
              <span v-for="(city, index) in localData.basicInfo.targetCities" :key="index">
                <EditableField
                  :model-value="city"
                  :edit-mode="editMode"
                  tag="span"
                  placeholder="目标城市"
                />
                <span v-if="index < localData.basicInfo.targetCities.length - 1">、</span>
              </span>
            </span>
          </div>
        </div>
        <div v-if="photoUrl || editMode" class="header-photo">
          <img v-if="photoUrl" :src="photoUrl" alt="个人照片" class="photo" />
          <div v-else-if="editMode" class="photo-placeholder">
            <el-icon><User /></el-icon>
          </div>
        </div>
      </div>
    </div>

    <div class="body">
      <div class="left-column">
        <!-- 动态左侧区块 -->
        <template v-for="(sectionId, index) in leftSectionOrder" :key="sectionId">
          <!-- 教育背景 -->
          <div v-if="sectionId === 'education' && (localData.education.length > 0 || editMode)" class="section" :class="{ 'editable-section': editMode }">
            <div v-if="editMode" class="section-actions">
              <el-button type="danger" size="small" circle @click="removeLeftSection('education')">
                <el-icon><Delete /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="moveLeftSection('education', 'up')" :disabled="leftSectionOrder.indexOf('education') === 0">
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="moveLeftSection('education', 'down')" :disabled="leftSectionOrder.indexOf('education') === leftSectionOrder.length - 1">
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
              <div v-for="(edu, eduIndex) in localData.education" :key="edu.id" class="item"
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
                  <div class="item-title">
                    <EditableField
                      v-model="edu.school"
                      :edit-mode="editMode"
                      tag="span"
                      placeholder="学校名称"
                      @update:model-value="updateEducation(eduIndex, 'school', $event)"
                    />
                  </div>
                  <div class="item-subtitle">
                    <EditableField
                      v-model="edu.major"
                      :edit-mode="editMode"
                      tag="span"
                      placeholder="专业"
                      @update:model-value="updateEducation(eduIndex, 'major', $event)"
                    />
                    <span v-if="edu.degree || editMode">
                      <span> · </span>
                      <EditableField
                        v-model="edu.degree"
                        :edit-mode="editMode"
                        tag="span"
                        placeholder="学历"
                        @update:model-value="updateEducation(eduIndex, 'degree', $event)"
                      />
                    </span>
                  </div>
                  <div class="item-time">
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

          <!-- 技能特长 -->
          <div v-if="sectionId === 'skills' && (localData.skills.length > 0 || editMode)" class="section" :class="{ 'editable-section': editMode }">
            <div v-if="editMode" class="section-actions">
              <el-button type="danger" size="small" circle @click="removeLeftSection('skills')">
                <el-icon><Delete /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="moveLeftSection('skills', 'up')" :disabled="leftSectionOrder.indexOf('skills') === 0">
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="moveLeftSection('skills', 'down')" :disabled="leftSectionOrder.indexOf('skills') === leftSectionOrder.length - 1">
                <el-icon><ArrowDown /></el-icon>
              </el-button>
            </div>
            <h2 class="section-title">
              <EditableField
                v-model="sectionTitles.skills"
                :edit-mode="editMode"
                tag="span"
                placeholder="技能特长"
              />
            </h2>
            <div class="skills-list">
              <div v-for="(skill, skillIndex) in localData.skills" :key="skillIndex" class="skill-item-wrapper">
                <span class="skill-item">
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
          <div v-if="sectionId === 'evaluation' && (localData.selfEvaluation || editMode)" class="section" :class="{ 'editable-section': editMode }">
            <div v-if="editMode" class="section-actions">
              <el-button type="danger" size="small" circle @click="removeLeftSection('evaluation')">
                <el-icon><Delete /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="moveLeftSection('evaluation', 'up')" :disabled="leftSectionOrder.indexOf('evaluation') === 0">
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="moveLeftSection('evaluation', 'down')" :disabled="leftSectionOrder.indexOf('evaluation') === leftSectionOrder.length - 1">
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
            <div class="evaluation-text">
              <EditableField
                v-model="localData.selfEvaluation"
                :edit-mode="editMode"
                tag="div"
                placeholder="请输入自我评价"
                multiline
                @update:model-value="updateSelfEvaluation"
              />
            </div>
          </div>
        </template>

        <!-- 添加左侧区块按钮 -->
        <div v-if="editMode && availableLeftSections.length > 0" class="add-section-row">
          <el-dropdown @command="addLeftSection">
            <el-button type="success" plain>
              <el-icon><Plus /></el-icon>添加区块
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="section in availableLeftSections" :key="section.id" :command="section.id">
                  {{ section.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <div class="right-column">
        <!-- 动态右侧区块 -->
        <template v-for="(sectionId, index) in rightSectionOrder" :key="sectionId">
          <!-- 工作经历 -->
          <div v-if="sectionId === 'work' && (localData.workExperience.length > 0 || editMode)" class="section" :class="{ 'editable-section': editMode }">
            <div v-if="editMode" class="section-actions">
              <el-button type="danger" size="small" circle @click="removeRightSection('work')">
                <el-icon><Delete /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="moveRightSection('work', 'up')" :disabled="rightSectionOrder.indexOf('work') === 0">
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="moveRightSection('work', 'down')" :disabled="rightSectionOrder.indexOf('work') === rightSectionOrder.length - 1">
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
              <div v-for="(work, workIndex) in localData.workExperience" :key="work.id" class="item"
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
                  <div class="item-header-row">
                    <span class="item-title">
                      <EditableField
                        v-model="work.company"
                        :edit-mode="editMode"
                        tag="span"
                        placeholder="公司名称"
                        @update:model-value="updateWork(workIndex, 'company', $event)"
                      />
                    </span>
                    <span class="item-time">
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
                    </span>
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
                  <div class="item-desc">
                    <EditableField
                      v-model="work.description"
                      :edit-mode="editMode"
                      tag="div"
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
          <div v-if="sectionId === 'projects' && (localData.projects.length > 0 || editMode)" class="section" :class="{ 'editable-section': editMode }">
            <div v-if="editMode" class="section-actions">
              <el-button type="danger" size="small" circle @click="removeRightSection('projects')">
                <el-icon><Delete /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="moveRightSection('projects', 'up')" :disabled="rightSectionOrder.indexOf('projects') === 0">
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <el-button type="primary" size="small" circle @click="moveRightSection('projects', 'down')" :disabled="rightSectionOrder.indexOf('projects') === rightSectionOrder.length - 1">
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
              <div v-for="(project, projIndex) in localData.projects" :key="project.id" class="item"
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
                  <div class="item-header-row">
                    <span class="item-title">
                      <EditableField
                        v-model="project.name"
                        :edit-mode="editMode"
                        tag="span"
                        placeholder="项目名称"
                        @update:model-value="updateProject(projIndex, 'name', $event)"
                      />
                    </span>
                    <span class="item-time">
                      <EditableField
                        v-model="project.startDate"
                        :edit-mode="editMode"
                        tag="span"
                        placeholder="开始时间"
                        @update:model-value="updateProject(projIndex, 'startDate', $event)"
                      />
                      <span> - </span>
                      <EditableField
                        v-model="project.endDate"
                        :edit-mode="editMode"
                        tag="span"
                        placeholder="结束时间"
                        @update:model-value="updateProject(projIndex, 'endDate', $event)"
                      />
                    </span>
                  </div>
                  <div class="item-subtitle">
                    <EditableField
                      v-model="project.role"
                      :edit-mode="editMode"
                      tag="span"
                      placeholder="担任角色"
                      @update:model-value="updateProject(projIndex, 'role', $event)"
                    />
                  </div>
                  <div class="item-desc">
                    <EditableField
                      v-model="project.description"
                      :edit-mode="editMode"
                      tag="div"
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
        </template>

        <!-- 添加右侧区块按钮 -->
        <div v-if="editMode && availableRightSections.length > 0" class="add-section-row">
          <el-dropdown @command="addRightSection">
            <el-button type="success" plain>
              <el-icon><Plus /></el-icon>添加区块
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="section in availableRightSections" :key="section.id" :command="section.id">
                  {{ section.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { User, Delete, ArrowUp, ArrowDown, Rank, Plus, Close } from '@element-plus/icons-vue'
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
  skills: '技能特长',
  evaluation: '自我评价',
  work: '工作经历',
  projects: '项目经历'
})

// 区块顺序
const sectionOrder = ref(['header'])
const leftSectionOrder = ref(['education', 'skills', 'evaluation'])
const rightSectionOrder = ref(['projects', 'work'])

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

// 可添加的左侧区块
const availableLeftSections = computed(() => {
  const allSections = [
    { id: 'education', name: '教育背景' },
    { id: 'skills', name: '技能特长' },
    { id: 'evaluation', name: '自我评价' }
  ]
  return allSections.filter(s => !leftSectionOrder.value.includes(s.id))
})

// 可添加的右侧区块
const availableRightSections = computed(() => {
  const allSections = [
    { id: 'work', name: '工作经历' },
    { id: 'projects', name: '项目经历' }
  ]
  return allSections.filter(s => !rightSectionOrder.value.includes(s.id))
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
const moveSection = (sectionId: string, direction: 'up' | 'down') => {
  const index = sectionOrder.value.indexOf(sectionId)
  if (direction === 'down' && index < sectionOrder.value.length - 1) {
    const temp = sectionOrder.value[index]
    sectionOrder.value[index] = sectionOrder.value[index + 1]!
    sectionOrder.value[index + 1] = temp!
  }
}

// 左侧区块操作
const addLeftSection = (sectionId: string) => {
  leftSectionOrder.value.push(sectionId)
}

const removeLeftSection = (sectionId: string) => {
  const index = leftSectionOrder.value.indexOf(sectionId)
  if (index > -1) {
    leftSectionOrder.value.splice(index, 1)
  }
}

const moveLeftSection = (sectionId: string, direction: 'up' | 'down') => {
  const index = leftSectionOrder.value.indexOf(sectionId)
  if (direction === 'up' && index > 0) {
    const temp = leftSectionOrder.value[index]
    leftSectionOrder.value[index] = leftSectionOrder.value[index - 1]!
    leftSectionOrder.value[index - 1] = temp!
  } else if (direction === 'down' && index < leftSectionOrder.value.length - 1) {
    const temp = leftSectionOrder.value[index]
    leftSectionOrder.value[index] = leftSectionOrder.value[index + 1]!
    leftSectionOrder.value[index + 1] = temp!
  }
}

// 右侧区块操作
const addRightSection = (sectionId: string) => {
  rightSectionOrder.value.push(sectionId)
}

const removeRightSection = (sectionId: string) => {
  const index = rightSectionOrder.value.indexOf(sectionId)
  if (index > -1) {
    rightSectionOrder.value.splice(index, 1)
  }
}

const moveRightSection = (sectionId: string, direction: 'up' | 'down') => {
  const index = rightSectionOrder.value.indexOf(sectionId)
  if (direction === 'up' && index > 0) {
    const temp = rightSectionOrder.value[index]
    rightSectionOrder.value[index] = rightSectionOrder.value[index - 1]!
    rightSectionOrder.value[index - 1] = temp!
  } else if (direction === 'down' && index < rightSectionOrder.value.length - 1) {
    const temp = rightSectionOrder.value[index]
    rightSectionOrder.value[index] = rightSectionOrder.value[index + 1]!
    rightSectionOrder.value[index + 1] = temp!
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
.minimal-resume {
  width: 210mm;
  min-height: 297mm;
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
  object-fit: contain;
  object-position: center center;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
}

.photo-placeholder {
  width: 100px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  font-size: 32px;
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

.contact-item {
  font-size: 10pt;
  opacity: 0.95;
}

.contact-item:not(:last-child)::after {
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

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.item {
  margin-bottom: 15px;
  position: relative;
  display: flex;
  gap: 8px;
}

.edit-mode .item {
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.edit-mode .item:hover {
  border-color: #409eff;
}

.item.dragging {
  opacity: 0.5;
}

.drag-handle {
  display: flex;
  align-items: flex-start;
  padding-top: 2px;
  color: #909399;
  cursor: move;
}

.drag-handle:hover {
  color: #409eff;
}

.item-content {
  flex: 1;
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

.item-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.item:hover .item-actions {
  opacity: 1;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.skill-item-wrapper {
  display: flex;
  align-items: center;
  gap: 2px;
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
