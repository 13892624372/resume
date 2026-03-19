<template>
  <div class="resume-editor">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 基本信息 -->
      <el-tab-pane label="基本信息" name="basic">
        <el-form :model="resumeStore.resumeData.basicInfo" label-width="100px">
          <!-- 照片上传 -->
          <el-form-item label="个人照片">
            <div class="photo-upload">
              <div v-if="photoPreview" class="photo-preview">
                <img :src="photoPreview" alt="个人照片" />
                <el-button type="danger" size="small" @click="removePhoto">删除</el-button>
              </div>
              <el-upload
                v-else
                class="photo-uploader"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handlePhotoChange"
                accept="image/*"
              >
                <el-icon class="upload-icon"><Plus /></el-icon>
                <div class="upload-text">点击上传照片</div>
                <div class="upload-tip">建议尺寸：100x130px</div>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="resumeStore.resumeData.basicInfo.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="resumeStore.resumeData.basicInfo.gender" placeholder="请选择性别" style="width: 100%">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="政治面貌">
            <el-select v-model="resumeStore.resumeData.basicInfo.politicalStatus" placeholder="请选择政治面貌" style="width: 100%">
              <el-option label="中共党员" value="中共党员" />
              <el-option label="中共预备党员" value="中共预备党员" />
              <el-option label="共青团员" value="共青团员" />
              <el-option label="群众" value="群众" />
              <el-option label="民主党派" value="民主党派" />
            </el-select>
          </el-form-item>
          <el-form-item label="出生年月">
            <div class="birth-date-picker">
              <el-select v-model="birthYear" placeholder="年份" style="width: 120px" @change="updateBirthDate">
                <el-option
                  v-for="year in yearOptions"
                  :key="year"
                  :label="year + '年'"
                  :value="year"
                />
              </el-select>
              <el-select v-model="birthMonth" placeholder="月份" style="width: 100px; margin-left: 10px;" @change="updateBirthDate">
                <el-option
                  v-for="month in 12"
                  :key="month"
                  :label="month + '月'"
                  :value="month"
                />
              </el-select>
            </div>
          </el-form-item>
          <el-form-item label="学历">
            <el-select v-model="resumeStore.resumeData.basicInfo.degree" placeholder="请选择学历" style="width: 100%">
              <el-option label="高中" value="高中" />
              <el-option label="大专" value="大专" />
              <el-option label="本科" value="本科" />
              <el-option label="硕士" value="硕士" />
              <el-option label="博士" value="博士" />
            </el-select>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="resumeStore.resumeData.basicInfo.phone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="resumeStore.resumeData.basicInfo.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="所在城市">
            <el-cascader
              v-model="selectedLocation"
              :options="regionOptions"
              :props="{ value: 'value', label: 'label', children: 'children' }"
              placeholder="请选择省/市/区"
              style="width: 100%"
              @change="handleLocationChange"
            />
          </el-form-item>
          <el-form-item label="求职岗位">
            <el-input v-model="resumeStore.resumeData.basicInfo.jobTitle" placeholder="请输入求职岗位" />
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input v-model="resumeStore.resumeData.basicInfo.signature" type="textarea" :rows="2" placeholder="请输入个性签名，如：热爱技术，追求极致" />
          </el-form-item>
          <el-form-item label="期望城市">
            <el-cascader
              v-model="selectedTargetCities"
              :options="cityLevelOptions"
              :props="{ value: 'value', label: 'label', children: 'children', multiple: true, emitPath: true }"
              placeholder="可选择多个期望城市"
              style="width: 100%"
              @change="handleTargetCitiesChange"
            />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 教育经历 -->
      <el-tab-pane label="教育经历" name="education">
        <div v-for="edu in resumeStore.resumeData.education" :key="edu.id" class="experience-item">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ edu.school || '未填写学校' }}</span>
                <el-button type="danger" size="small" @click="resumeStore.removeEducation(edu.id)">删除</el-button>
              </div>
            </template>
            <el-form label-width="80px">
              <el-form-item label="学校">
                <el-input v-model="edu.school" />
              </el-form-item>
              <el-form-item label="专业">
                <el-input v-model="edu.major" />
              </el-form-item>
              <el-form-item label="学历">
                <el-select v-model="edu.degree" style="width: 100%">
                  <el-option label="高中" value="高中" />
                  <el-option label="大专" value="大专" />
                  <el-option label="本科" value="本科" />
                  <el-option label="硕士" value="硕士" />
                  <el-option label="博士" value="博士" />
                </el-select>
              </el-form-item>
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="edu.startDate"
                  type="month"
                  placeholder="选择开始时间"
                  style="width: 100%"
                  value-format="YYYY.MM"
                />
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="edu.endDate"
                  type="month"
                  placeholder="选择结束时间"
                  style="width: 100%"
                  value-format="YYYY.MM"
                />
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="edu.description" type="textarea" :rows="2" />
              </el-form-item>
            </el-form>
          </el-card>
        </div>
        <el-button type="primary" @click="addEducation">
          <el-icon><Plus /></el-icon>添加教育经历
        </el-button>
      </el-tab-pane>

      <!-- 项目经历 -->
      <el-tab-pane label="项目经历" name="project">
        <div v-for="project in resumeStore.resumeData.projects" :key="project.id" class="experience-item">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ project.name || '未填写项目' }}</span>
                <div>
                  <el-button type="primary" size="small" @click="optimizeProject(project)">AI优化</el-button>
                  <el-button type="danger" size="small" @click="resumeStore.removeProject(project.id)">删除</el-button>
                </div>
              </div>
            </template>
            <el-form label-width="80px">
              <el-form-item label="项目名称">
                <el-input v-model="project.name" />
              </el-form-item>
              <el-form-item label="担任角色">
                <el-input v-model="project.role" />
              </el-form-item>
              <el-form-item label="技术栈">
                <el-input v-model="project.techStack" placeholder="如：Vue3 + TypeScript + Node.js" />
              </el-form-item>
              <el-form-item label="项目描述">
                <el-input v-model="project.description" type="textarea" :rows="4" placeholder="描述项目背景、职责和成果..." />
              </el-form-item>
            </el-form>
          </el-card>
        </div>
        <el-button type="primary" @click="addProject">
          <el-icon><Plus /></el-icon>添加项目经历
        </el-button>
      </el-tab-pane>

      <!-- 工作经历 -->
      <el-tab-pane label="工作经历" name="work">
        <div v-for="work in resumeStore.resumeData.workExperience" :key="work.id" class="experience-item">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>{{ work.company || '未填写公司' }}</span>
                <div>
                  <el-button type="primary" size="small" @click="optimizeWork(work)">AI优化</el-button>
                  <el-button type="danger" size="small" @click="resumeStore.removeWorkExperience(work.id)">删除</el-button>
                </div>
              </div>
            </template>
            <el-form label-width="80px">
              <el-form-item label="公司">
                <el-input v-model="work.company" />
              </el-form-item>
              <el-form-item label="职位">
                <el-input v-model="work.position" />
              </el-form-item>
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="work.startDate"
                  type="month"
                  placeholder="选择开始时间"
                  style="width: 100%"
                  value-format="YYYY.MM"
                />
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="work.endDate"
                  type="month"
                  placeholder="选择结束时间"
                  style="width: 100%"
                  value-format="YYYY.MM"
                />
              </el-form-item>
              <el-form-item label="工作描述">
                <el-input v-model="work.description" type="textarea" :rows="4" placeholder="描述工作内容、职责和成果..." />
              </el-form-item>
            </el-form>
          </el-card>
        </div>
        <el-button type="primary" @click="addWorkExperience">
          <el-icon><Plus /></el-icon>添加工作经历
        </el-button>
      </el-tab-pane>

      <!-- 技能标签 -->
      <el-tab-pane label="技能标签" name="skills">
        <el-form label-width="100px">
          <el-form-item label="技能标签">
            <el-input
              v-model="skillsInput"
              type="textarea"
              :rows="3"
              placeholder="输入技能标签，用顿号（、）分隔，如：Vue.js、TypeScript、JavaScript、AI产品"
              @blur="parseSkillsInput"
            />
          </el-form-item>
          <el-form-item>
            <div class="skills-preview">
              <el-tag v-for="skill in resumeStore.resumeData.skills" :key="skill" closable @close="removeSkill(skill)">
                {{ skill }}
              </el-tag>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 自我评价 -->
      <el-tab-pane label="自我评价" name="evaluation">
        <el-form label-width="100px">
          <el-form-item label="自我评价">
            <el-input v-model="resumeStore.resumeData.selfEvaluation" type="textarea" :rows="6" placeholder="描述个人优势、职业素养..." />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="!resumeStore.jdAnalysis" @click="generateSelfEvaluation">
              <el-icon><MagicStick /></el-icon>AI生成自我评价
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- AI优化对话框 -->
    <el-dialog v-model="optimizeDialogVisible" title="AI优化结果" width="600px">
      <div v-if="optimizing" class="optimizing">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>正在优化中...</span>
      </div>
      <div v-else>
        <h4>优化后的描述：</h4>
        <el-input v-model="optimizedContent" type="textarea" :rows="6" />
        <h4 style="margin-top: 15px">优化建议：</h4>
        <ul>
          <li v-for="(suggestion, index) in optimizeSuggestions" :key="index">{{ suggestion }}</li>
        </ul>
      </div>
      <template #footer>
        <el-button @click="optimizeDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="applyOptimization">应用优化</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, MagicStick, Loading } from '@element-plus/icons-vue'
import { useResumeStore, type Education, type WorkExperience, type Project } from '@/stores/resume'
import { aiService } from '@/services/aiService'
import { regionData, getCityLevelData, getCityDisplayName } from '@/data/regionData'

const resumeStore = useResumeStore()
const activeTab = ref('basic')
const selectedSkills = ref<string[]>([])
const skillsInput = ref('')

// 从 store 初始化 skillsInput
const initSkillsInput = () => {
  skillsInput.value = resumeStore.resumeData.skills.join('、')
}

// 解析技能标签输入
const parseSkillsInput = () => {
  const skills = skillsInput.value
    .split('、')
    .map(s => s.trim())
    .filter(s => s.length > 0)
  resumeStore.updateSkills(skills)
}

// 初始化
initSkillsInput()

// 照片上传
const photoPreview = ref('')

// 处理照片选择
const handlePhotoChange = (file: any) => {
  const isJPG = file.raw.type === 'image/jpeg'
  const isPNG = file.raw.type === 'image/png'
  const isLt2M = file.raw.size / 1024 / 1024 < 2

  if (!isJPG && !isPNG) {
    ElMessage.error('只支持 JPG 或 PNG 格式的图片！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }

  // 读取图片并预览
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target?.result as string
    // 将图片保存到 localStorage
    localStorage.setItem('resume_photo', photoPreview.value)
    ElMessage.success('照片上传成功')
  }
  reader.readAsDataURL(file.raw)
  return false
}

// 删除照片
const removePhoto = () => {
  photoPreview.value = ''
  localStorage.removeItem('resume_photo')
  ElMessage.success('照片已删除')
}

// 从 localStorage 加载照片
const loadPhotoFromStorage = () => {
  const savedPhoto = localStorage.getItem('resume_photo')
  if (savedPhoto) {
    photoPreview.value = savedPhoto
  }
}

// 页面加载时读取保存的照片
loadPhotoFromStorage()

// 省市区选择
const regionOptions = regionData
const cityLevelOptions = getCityLevelData()
const selectedLocation = ref<string[]>([])
const selectedTargetCities = ref<string[][]>([])

// 处理所在城市选择变化
const handleLocationChange = (value: string[]) => {
  selectedLocation.value = value
  resumeStore.resumeData.basicInfo.location = value[value.length - 1] || ''
}

// 处理期望城市选择变化（多选，只到市级别）
const handleTargetCitiesChange = (value: string[][]) => {
  selectedTargetCities.value = value
  resumeStore.resumeData.basicInfo.targetCities = value.map(cityPath => getCityDisplayName(cityPath))
}

const skillOptions = [
  { label: 'JavaScript', value: 'JavaScript' },
  { label: 'TypeScript', value: 'TypeScript' },
  { label: 'Vue.js', value: 'Vue.js' },
  { label: 'React', value: 'React' },
  { label: 'Node.js', value: 'Node.js' },
  { label: 'Python', value: 'Python' },
  { label: 'Java', value: 'Java' },
  { label: 'C/C++', value: 'C/C++' },
  { label: 'HTML/CSS', value: 'HTML/CSS' },
  { label: 'MySQL', value: 'MySQL' },
  { label: 'Redis', value: 'Redis' },
  { label: 'Git', value: 'Git' },
  { label: 'Docker', value: 'Docker' },
  { label: 'Linux', value: 'Linux' },
  { label: '微信小程序', value: '微信小程序' }
]

// 出生年月选择
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 60 }, (_, i) => currentYear - i)
const birthYear = ref<number | null>(null)
const birthMonth = ref<number | null>(null)

// 从 store 中解析已有的出生年月
const parseBirthDate = () => {
  const birthDate = resumeStore.resumeData.basicInfo.birthDate
  if (birthDate) {
    const parts = birthDate.split('.')
    if (parts.length === 2) {
      birthYear.value = parseInt(parts[0])
      birthMonth.value = parseInt(parts[1])
    }
  }
}

// 初始化时解析
parseBirthDate()

// 更新出生年月
const updateBirthDate = () => {
  if (birthYear.value && birthMonth.value) {
    const monthStr = birthMonth.value.toString().padStart(2, '0')
    resumeStore.resumeData.basicInfo.birthDate = `${birthYear.value}.${monthStr}`
  } else if (!birthYear.value && !birthMonth.value) {
    resumeStore.resumeData.basicInfo.birthDate = ''
  }
}

const addEducation = () => {
  const newEdu: Education = {
    id: Date.now().toString(),
    school: '',
    major: '',
    degree: '本科',
    startDate: '',
    endDate: '',
    description: ''
  }
  resumeStore.addEducation(newEdu)
}

const addWorkExperience = () => {
  const newWork: WorkExperience = {
    id: Date.now().toString(),
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  }
  resumeStore.addWorkExperience(newWork)
}

const addProject = () => {
  const newProject: Project = {
    id: Date.now().toString(),
    name: '',
    role: '',
    startDate: '',
    endDate: '',
    description: '',
    techStack: ''
  }
  resumeStore.addProject(newProject)
}

const handleSkillsChange = (value: string[]) => {
  resumeStore.updateSkills(value)
}

const removeSkill = (skill: string) => {
  const newSkills = resumeStore.resumeData.skills.filter(s => s !== skill)
  resumeStore.updateSkills(newSkills)
  selectedSkills.value = newSkills
  skillsInput.value = newSkills.join('、')
}

// AI优化相关
const optimizeDialogVisible = ref(false)
const optimizing = ref(false)
const optimizedContent = ref('')
const optimizeSuggestions = ref<string[]>([])
const currentEditingItem = ref<WorkExperience | Project | null>(null)
const currentEditingType = ref<'work' | 'project'>('work')

const optimizeWork = async (work: WorkExperience) => {
  if (!resumeStore.jdAnalysis) {
    ElMessage.warning('请先解析岗位JD')
    return
  }
  currentEditingItem.value = work
  currentEditingType.value = 'work'
  optimizeDialogVisible.value = true
  optimizing.value = true

  try {
    const result = await aiService.optimizeWorkExperience(
      work.description,
      resumeStore.jdAnalysis.hardSkills
    )
    optimizedContent.value = result.optimized
    optimizeSuggestions.value = result.suggestions
  } catch (error) {
    ElMessage.error('优化失败')
  } finally {
    optimizing.value = false
  }
}

const optimizeProject = async (project: Project) => {
  if (!resumeStore.jdAnalysis) {
    ElMessage.warning('请先解析岗位JD')
    return
  }
  currentEditingItem.value = project
  currentEditingType.value = 'project'
  optimizeDialogVisible.value = true
  optimizing.value = true

  try {
    const result = await aiService.optimizeProject(
      project.description,
      project.techStack,
      resumeStore.jdAnalysis.hardSkills
    )
    optimizedContent.value = result.optimized
    optimizeSuggestions.value = result.suggestions
  } catch (error) {
    ElMessage.error('优化失败')
  } finally {
    optimizing.value = false
  }
}

const applyOptimization = () => {
  if (currentEditingItem.value) {
    currentEditingItem.value.description = optimizedContent.value
    ElMessage.success('已应用优化')
  }
  optimizeDialogVisible.value = false
}

const generateSelfEvaluation = async () => {
  if (!resumeStore.jdAnalysis) {
    ElMessage.warning('请先解析岗位JD')
    return
  }

  try {
    const evaluation = await aiService.generateSelfEvaluation(
      resumeStore.resumeData.basicInfo.jobTitle,
      resumeStore.resumeData.skills,
      [...resumeStore.jdAnalysis.hardSkills, ...resumeStore.jdAnalysis.softSkills]
    )
    resumeStore.updateSelfEvaluation(evaluation)
    ElMessage.success('自我评价生成成功')
  } catch (error) {
    ElMessage.error('生成失败')
  }
}
</script>

<style scoped>
.resume-editor {
  height: 100%;
}

.experience-item {
  margin-bottom: 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skills-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.optimizing {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px;
  font-size: 16px;
  color: #666;
}

/* 照片上传样式 */
.photo-upload {
  display: flex;
  align-items: center;
}

.photo-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.photo-preview img {
  width: 100px;
  height: 140px;
  object-fit: cover;
  object-position: center top;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.photo-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
  width: 120px;
  height: 168px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.photo-uploader:hover {
  border-color: #409eff;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 12px;
  color: #606266;
}

.upload-tip {
  font-size: 10px;
  color: #909399;
  margin-top: 4px;
}

/* 出生年月选择器样式 */
.birth-date-picker {
  display: flex;
  align-items: center;
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .resume-editor {
    padding: 10px;
  }

  .experience-item {
    margin-bottom: 10px;
  }

  .card-header {
    flex-direction: column;
    gap: 10px;
  }

  .card-header .el-button {
    width: 100%;
  }

  .photo-uploader {
    width: 100px;
    height: 140px;
  }

  .photo-preview img {
    width: 80px;
    height: 112px;
  }
}

@media screen and (max-width: 480px) {
  .resume-editor :deep(.el-form-item__label) {
    float: none;
    display: block;
    text-align: left;
    margin-bottom: 5px;
  }

  .resume-editor :deep(.el-form-item__content) {
    margin-left: 0 !important;
  }
}
</style>
