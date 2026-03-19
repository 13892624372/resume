<template>
  <div ref="resumeRef" class="creative-resume" :class="{ 'edit-mode': editMode }">
    <div class="left-sidebar">
      <!-- 头像区块 -->
      <div v-if="photoUrl || editMode" class="sidebar-block photo-section" :class="{ 'editable-section': editMode }">
        <div class="photo-container">
          <div v-if="photoUrl" class="photo-bg" :style="{ backgroundImage: `url(${photoUrl})` }"></div>
          <div v-else-if="editMode" class="photo-placeholder">
            <el-icon><User /></el-icon>
          </div>
        </div>
        <div v-if="localData.basicInfo.jobTitle || editMode" class="job-title">
          <EditableField
            v-model="localData.basicInfo.jobTitle"
            :edit-mode="editMode"
            tag="span"
            placeholder="求职岗位"
            @update:model-value="updateBasicInfo('jobTitle', $event)"
          />
        </div>
        <div v-if="localData.basicInfo.signature || editMode" class="signature">
          <EditableField
            v-model="localData.basicInfo.signature"
            :edit-mode="editMode"
            tag="span"
            placeholder="个人签名"
            @update:model-value="updateBasicInfo('signature', $event)"
          />
        </div>
      </div>

      <!-- 个人信息区块 -->
      <div v-if="sectionOrder.includes('personalInfo')" class="sidebar-block sidebar-section" :class="{ 'editable-section': editMode }">
        <div v-if="editMode" class="section-actions">
          <el-button type="danger" size="small" circle @click="removeSection('personalInfo')">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('personalInfo', 'down')" :disabled="sectionOrder.indexOf('personalInfo') === sectionOrder.length - 1">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
        <h3 class="sidebar-title">
          <EditableField
            v-model="sectionTitles.personalInfo"
            :edit-mode="editMode"
            tag="span"
            placeholder="个人信息"
          />
        </h3>
        <div class="personal-info-list">
          <div v-if="localData.basicInfo.gender || editMode" class="personal-info-item">
            <span class="info-label">性别：</span>
            <EditableField
              v-model="localData.basicInfo.gender"
              :edit-mode="editMode"
              tag="span"
              placeholder="性别"
              @update:model-value="updateBasicInfo('gender', $event)"
            />
          </div>
          <div v-if="localData.basicInfo.degree || editMode" class="personal-info-item">
            <span class="info-label">学历：</span>
            <EditableField
              v-model="localData.basicInfo.degree"
              :edit-mode="editMode"
              tag="span"
              placeholder="学历"
              @update:model-value="updateBasicInfo('degree', $event)"
            />
          </div>
          <div v-if="localData.basicInfo.politicalStatus || editMode" class="personal-info-item">
            <span class="info-label">政治面貌：</span>
            <EditableField
              v-model="localData.basicInfo.politicalStatus"
              :edit-mode="editMode"
              tag="span"
              placeholder="政治面貌"
              @update:model-value="updateBasicInfo('politicalStatus', $event)"
            />
          </div>
          <div v-if="localData.basicInfo.birthDate || editMode" class="personal-info-item">
            <span class="info-label">出生年月：</span>
            <EditableField
              v-model="localData.basicInfo.birthDate"
              :edit-mode="editMode"
              tag="span"
              placeholder="2000.01"
              @update:model-value="updateBasicInfo('birthDate', $event)"
            />
          </div>
          <div v-if="localData.basicInfo.location || editMode" class="personal-info-item">
            <span class="info-label">所在城市：</span>
            <EditableField
              v-model="localData.basicInfo.location"
              :edit-mode="editMode"
              tag="span"
              placeholder="所在城市"
              @update:model-value="updateBasicInfo('location', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 联系方式区块 -->
      <div v-if="sectionOrder.includes('contact')" class="sidebar-block sidebar-section" :class="{ 'editable-section': editMode }">
        <div v-if="editMode" class="section-actions">
          <el-button type="danger" size="small" circle @click="removeSection('contact')">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('contact', 'up')" :disabled="sectionOrder.indexOf('contact') === 0">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('contact', 'down')" :disabled="sectionOrder.indexOf('contact') === sectionOrder.length - 1">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
        <h3 class="sidebar-title">
          <EditableField
            v-model="sectionTitles.contact"
            :edit-mode="editMode"
            tag="span"
            placeholder="联系方式"
          />
        </h3>
        <div class="contact-list">
          <div v-if="localData.basicInfo.phone || editMode" class="contact-item">
            <span class="contact-label">电话：</span>
            <EditableField
              v-model="localData.basicInfo.phone"
              :edit-mode="editMode"
              tag="span"
              placeholder="电话"
              @update:model-value="updateBasicInfo('phone', $event)"
            />
          </div>
          <div v-if="localData.basicInfo.email || editMode" class="contact-item">
            <span class="contact-label">邮箱：</span>
            <EditableField
              v-model="localData.basicInfo.email"
              :edit-mode="editMode"
              tag="span"
              placeholder="邮箱"
              @update:model-value="updateBasicInfo('email', $event)"
            />
          </div>
        </div>
      </div>

      <!-- 期望城市区块 -->
      <div v-if="sectionOrder.includes('targetCities') && (localData.basicInfo.targetCities?.length > 0 || editMode)" class="sidebar-block sidebar-section" :class="{ 'editable-section': editMode }">
        <div v-if="editMode" class="section-actions">
          <el-button type="danger" size="small" circle @click="removeSection('targetCities')">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('targetCities', 'up')" :disabled="sectionOrder.indexOf('targetCities') === 0">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('targetCities', 'down')" :disabled="sectionOrder.indexOf('targetCities') === sectionOrder.length - 1">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
        <h3 class="sidebar-title">
          <EditableField
            v-model="sectionTitles.targetCities"
            :edit-mode="editMode"
            tag="span"
            placeholder="期望城市"
          />
        </h3>
        <div class="target-cities-list">
          <div v-for="(city, cityIndex) in localData.basicInfo.targetCities" :key="cityIndex" class="target-city-item">
            <span class="city-tag">{{ city }}</span>
          </div>
          <div v-if="editMode && localData.basicInfo.targetCities?.length === 0" class="placeholder-text">
            <EditableField
              v-model="placeholderTargetCities"
              :edit-mode="editMode"
              tag="span"
              placeholder="添加期望城市"
            />
          </div>
        </div>
      </div>

      <!-- 教育背景区块 -->
      <div v-if="sectionOrder.includes('education') && (localData.education.length > 0 || editMode)" class="sidebar-block sidebar-section" :class="{ 'editable-section': editMode }">
        <div v-if="editMode" class="section-actions">
          <el-button type="danger" size="small" circle @click="removeSection('education')">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('education', 'up')" :disabled="sectionOrder.indexOf('education') === 0">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button type="primary" size="small" circle @click="moveSection('education', 'down')" :disabled="sectionOrder.indexOf('education') === sectionOrder.length - 1">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
        </div>
        <h3 class="sidebar-title">
          <EditableField
            v-model="sectionTitles.education"
            :edit-mode="editMode"
            tag="span"
            placeholder="教育背景"
          />
        </h3>
        <div class="sidebar-education-list">
          <div v-for="(edu, eduIndex) in localData.education" :key="edu.id" class="sidebar-education-item"
               :class="{ 'dragging': draggingEducation === eduIndex }"
               draggable="true"
               @dragstart="handleDragStart('education', eduIndex, $event)"
               @dragover="handleDragOver('education', eduIndex, $event)"
               @drop="handleDrop('education', eduIndex, $event)"
               @dragend="handleDragEnd('education')">
            <div v-if="editMode" class="drag-handle">
              <el-icon><Rank /></el-icon>
            </div>
            <div class="sidebar-edu-content">
              <div class="sidebar-edu-school">
                <EditableField
                  v-model="edu.school"
                  :edit-mode="editMode"
                  tag="span"
                  placeholder="学校名称"
                  @update:model-value="updateEducation(eduIndex, 'school', $event)"
                />
              </div>
              <div class="sidebar-edu-major">
                <EditableField
                  v-model="edu.major"
                  :edit-mode="editMode"
                  tag="span"
                  placeholder="专业"
                  @update:model-value="updateEducation(eduIndex, 'major', $event)"
                />
                <span v-if="edu.degree || editMode">
                  <span> | </span>
                  <EditableField
                    v-model="edu.degree"
                    :edit-mode="editMode"
                    tag="span"
                    placeholder="学历"
                    @update:model-value="updateEducation(eduIndex, 'degree', $event)"
                  />
                </span>
              </div>
              <div class="sidebar-edu-time">
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
    </div>

    <div class="main-content">
      <!-- 动态右侧区块 -->
      <template v-for="(sectionId, index) in rightSectionOrder" :key="sectionId">
        <!-- 工作经历 -->
        <div v-if="sectionId === 'work' && (localData.workExperience.length > 0 || editMode)" class="content-section" :class="{ 'editable-section': editMode }">
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
          <h2 class="content-title">
            <EditableField
              v-model="sectionTitles.work"
              :edit-mode="editMode"
              tag="span"
              placeholder="工作经历"
            />
          </h2>
          <div class="timeline-list">
            <div v-for="(work, workIndex) in localData.workExperience" :key="work.id" class="timeline-item"
                 :class="{ 'dragging': draggingWork === workIndex }"
                 draggable="true"
                 @dragstart="handleDragStart('work', workIndex, $event)"
                 @dragover="handleDragOver('work', workIndex, $event)"
                 @drop="handleDrop('work', workIndex, $event)"
                 @dragend="handleDragEnd('work')">
              <div v-if="editMode" class="drag-handle">
                <el-icon><Rank /></el-icon>
              </div>
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="item-header">
                  <span class="company">
                    <EditableField
                      v-model="work.company"
                      :edit-mode="editMode"
                      tag="span"
                      placeholder="公司名称"
                      @update:model-value="updateWork(workIndex, 'company', $event)"
                    />
                  </span>
                  <span class="time">
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
                <div class="position">
                  <EditableField
                    v-model="work.position"
                    :edit-mode="editMode"
                    tag="span"
                    placeholder="职位"
                    @update:model-value="updateWork(workIndex, 'position', $event)"
                  />
                </div>
                <div class="description">
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
        <div v-if="sectionId === 'projects' && (localData.projects.length > 0 || editMode)" class="content-section" :class="{ 'editable-section': editMode }">
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
          <h2 class="content-title">
            <EditableField
              v-model="sectionTitles.projects"
              :edit-mode="editMode"
              tag="span"
              placeholder="项目经历"
            />
          </h2>
          <div class="timeline-list">
            <div v-for="(project, projIndex) in localData.projects" :key="project.id" class="timeline-item"
                 :class="{ 'dragging': draggingProject === projIndex }"
                 draggable="true"
                 @dragstart="handleDragStart('projects', projIndex, $event)"
                 @dragover="handleDragOver('projects', projIndex, $event)"
                 @drop="handleDrop('projects', projIndex, $event)"
                 @dragend="handleDragEnd('projects')">
              <div v-if="editMode" class="drag-handle">
                <el-icon><Rank /></el-icon>
              </div>
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="item-header">
                  <span class="project-name">
                    <EditableField
                      v-model="project.name"
                      :edit-mode="editMode"
                      tag="span"
                      placeholder="项目名称"
                      @update:model-value="updateProject(projIndex, 'name', $event)"
                    />
                  </span>
                  <span class="role-inline">
                    <EditableField
                      v-model="project.role"
                      :edit-mode="editMode"
                      tag="span"
                      placeholder="担任角色"
                      @update:model-value="updateProject(projIndex, 'role', $event)"
                    />
                  </span>
                </div>
                <div class="time">
                  <EditableField
                    v-model="project.startDate"
                    :edit-mode="editMode"
                    tag="span"
                    placeholder="开始时间"
                    @update:model-value="updateProject(projIndex, 'startDate', $event)"
                  />
                  <EditableField
                    v-model="project.endDate"
                    :edit-mode="editMode"
                    tag="span"
                    placeholder="结束时间"
                    @update:model-value="updateProject(projIndex, 'endDate', $event)"
                  />
                </div>
                <div class="description">
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

        <!-- 技能标签 -->
        <div v-if="sectionId === 'skills' && (localData.skills.length > 0 || editMode)" class="content-section" :class="{ 'editable-section': editMode }">
          <div v-if="editMode" class="section-actions">
            <el-button type="danger" size="small" circle @click="removeRightSection('skills')">
              <el-icon><Delete /></el-icon>
            </el-button>
            <el-button type="primary" size="small" circle @click="moveRightSection('skills', 'up')" :disabled="rightSectionOrder.indexOf('skills') === 0">
              <el-icon><ArrowUp /></el-icon>
            </el-button>
            <el-button type="primary" size="small" circle @click="moveRightSection('skills', 'down')" :disabled="rightSectionOrder.indexOf('skills') === rightSectionOrder.length - 1">
              <el-icon><ArrowDown /></el-icon>
            </el-button>
          </div>
          <h2 class="content-title">
            <EditableField
              v-model="sectionTitles.skills"
              :edit-mode="editMode"
              tag="span"
              placeholder="技能标签"
            />
          </h2>
          <div class="skills-container">
            <span v-for="(skill, skillIndex) in localData.skills" :key="skillIndex" class="skill-tag">
              <EditableField
                :model-value="skill"
                :edit-mode="editMode"
                tag="span"
                placeholder="技能"
                @update:model-value="updateSkill(skillIndex, $event)"
              />
              <el-icon v-if="editMode" class="delete-skill-btn" @click="deleteSkill(skillIndex)"><Close /></el-icon>
            </span>
            <el-button v-if="editMode" type="primary" plain size="small" class="add-skill-btn" @click="addSkill">
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 自我评价 -->
        <div v-if="sectionId === 'evaluation' && (localData.selfEvaluation || editMode)" class="content-section" :class="{ 'editable-section': editMode }">
          <div v-if="editMode" class="section-actions">
            <el-button type="danger" size="small" circle @click="removeRightSection('evaluation')">
              <el-icon><Delete /></el-icon>
            </el-button>
            <el-button type="primary" size="small" circle @click="moveRightSection('evaluation', 'up')" :disabled="rightSectionOrder.indexOf('evaluation') === 0">
              <el-icon><ArrowUp /></el-icon>
            </el-button>
            <el-button type="primary" size="small" circle @click="moveRightSection('evaluation', 'down')" :disabled="rightSectionOrder.indexOf('evaluation') === rightSectionOrder.length - 1">
              <el-icon><ArrowDown /></el-icon>
            </el-button>
          </div>
          <h2 class="content-title">
            <EditableField
              v-model="sectionTitles.evaluation"
              :edit-mode="editMode"
              tag="span"
              placeholder="自我评价"
            />
          </h2>
          <div class="self-evaluation">
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
  personalInfo: '个人信息',
  contact: '联系方式',
  targetCities: '期望城市',
  education: '教育背景',
  work: '工作经历',
  projects: '项目经历',
  skills: '技能标签',
  evaluation: '自我评价'
})

// 期望城市占位符
const placeholderTargetCities = ref('')

// 左侧区块顺序：个人信息 → 联系方式 → 期望城市 → 教育背景
const sectionOrder = ref(['personalInfo', 'contact', 'targetCities', 'education'])

// 右侧区块顺序
const rightSectionOrder = ref(['projects', 'work', 'skills', 'evaluation'])

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
const availableSections = computed(() => {
  const allSections = [
    { id: 'personalInfo', name: '个人信息' },
    { id: 'education', name: '教育背景' },
    { id: 'contact', name: '联系方式' },
    { id: 'targetCities', name: '期望城市' }
  ]
  return allSections.filter(s => !sectionOrder.value.includes(s.id))
})

// 可添加的右侧区块
const availableRightSections = computed(() => {
  const allSections = [
    { id: 'education', name: '教育背景' },
    { id: 'work', name: '工作经历' },
    { id: 'projects', name: '项目经历' },
    { id: 'skills', name: '技能标签' },
    { id: 'evaluation', name: '自我评价' }
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

// 左侧区块操作
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
.creative-resume {
  width: 210mm;
  min-height: 297mm;
  display: flex;
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

.left-sidebar {
  width: 70mm;
  background: #f8f9fa;
  color: #333;
  padding: 20mm 8mm;
  border-right: 1px solid #e5e7eb;
}

.sidebar-block {
  margin-bottom: 25px;
}

.profile-section {
  text-align: center;
}

.photo-container {
  width: 120px;
  height: 120px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #e5e7eb;
  background: white;
}

.photo-bg {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background-color: #f5f5f5;
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  font-size: 32px;
  color: #6b7280;
}

.name {
  font-size: 20pt;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.photo-section {
  text-align: center;
}

.job-title {
  font-size: 12pt;
  color: #1f2937;
  font-weight: 600;
  margin-top: 10px;
}

.signature {
  font-size: 9pt;
  color: #6b7280;
  margin-top: 6px;
  font-style: italic;
}

/* 个人信息样式 */
.personal-info-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.personal-info-item {
  font-size: 9.5pt;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-label {
  color: #6b7280;
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 12pt;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
  margin-bottom: 15px;
  color: #1f2937;
  font-weight: 600;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.contact-item {
  font-size: 9.5pt;
  color: #4b5563;
  display: flex;
  align-items: center;
  gap: 4px;
}

.contact-label {
  color: #6b7280;
  flex-shrink: 0;
}

.skills-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-item-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.skill-item {
  flex: 1;
  margin-bottom: 8px;
}

.skill-name {
  font-size: 9.5pt;
  margin-bottom: 4px;
}

.skill-bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: #6b7280;
  border-radius: 3px;
}

/* 右侧技能标签样式 */
.main-content .content-section .skills-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.main-content .skill-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  background: #e5e7eb;
  border-radius: 3px;
  font-size: 8pt;
  color: #4b5563;
  line-height: 1.3;
}

.main-content .skill-tag .delete-skill-btn {
  margin-left: 4px;
  font-size: 9px;
  cursor: pointer;
  color: #6b7280;
  opacity: 0.5;
}

.main-content .skill-tag .delete-skill-btn:hover {
  opacity: 1;
}

.main-content .add-skill-btn {
  padding: 2px 6px !important;
  font-size: 8pt !important;
  height: auto !important;
}

/* 期望城市样式 */
.target-cities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.target-city-item {
  font-size: 9.5pt;
}

.city-tag {
  display: inline-block;
  padding: 4px 10px;
  background: #e5e7eb;
  border-radius: 4px;
  color: #4b5563;
}

.placeholder-text {
  font-size: 9.5pt;
  color: #9ca3af;
  font-style: italic;
}

/* 左侧教育背景样式 */
.sidebar-education-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-education-item {
  padding: 10px 0;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.sidebar-education-item:last-child {
  border-bottom: none;
}

.edit-mode .sidebar-education-item {
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.edit-mode .sidebar-education-item:hover {
  border-color: #409eff;
}

.sidebar-education-item.dragging {
  opacity: 0.5;
}

.sidebar-edu-school {
  font-weight: 600;
  font-size: 10pt;
  color: #1f2937;
  margin-bottom: 4px;
}

.sidebar-edu-major {
  font-size: 9pt;
  color: #6b7280;
  margin-bottom: 4px;
}

.sidebar-edu-time {
  font-size: 8.5pt;
  color: #9ca3af;
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
  color: #1f2937;
  margin-bottom: 15px;
  padding-left: 10px;
  border-left: 4px solid #6b7280;
}

.timeline-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline-item {
  display: flex;
  gap: 12px;
  margin-bottom: 18px;
  position: relative;
}

.edit-mode .timeline-item {
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
  border: 1px dashed #dcdfe6;
}

.edit-mode .timeline-item:hover {
  border-color: #409eff;
}

.timeline-item.dragging {
  opacity: 0.5;
}

.drag-handle {
  display: flex;
  align-items: flex-start;
  padding-top: 5px;
  color: #909399;
  cursor: move;
}

.drag-handle:hover {
  color: #409eff;
}

.timeline-dot {
  width: 10px;
  height: 10px;
  background: #6b7280;
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
  display: flex;
  gap: 4px;
}

.time .editable-field:empty::before {
  content: '';
}

.major, .position, .role {
  font-size: 10pt;
  color: #6b7280;
  margin-bottom: 5px;
}

.role-inline {
  font-size: 9pt;
  color: #6b7280;
  padding: 2px 8px;
  background: #f3f4f6;
  border-radius: 3px;
}

.description {
  font-size: 9.5pt;
  color: #4b5563;
  line-height: 1.5;
}

.item-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.timeline-item:hover .item-actions {
  opacity: 1;
}

.self-evaluation {
  font-size: 10pt;
  color: #374151;
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
