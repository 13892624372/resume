<template>
  <div class="resume-preview">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">👁️ 简历预览</span>
          <div class="actions">
            <el-button type="primary" @click="showPreviewDialog">
              <el-icon><View /></el-icon>查看简历
            </el-button>
          </div>
        </div>
      </template>

      <!-- 匹配度分析 -->
      <div v-if="resumeStore.jdAnalysis" class="match-analysis">
        <div class="match-score">
          <div class="score-circle" :style="{ background: scoreColor }">
            <span class="score-number">{{ matchScore }}</span>
            <span class="score-label">匹配度</span>
          </div>
        </div>
        <div class="match-details">
          <h4>匹配分析</h4>
          <div class="skill-match">
            <div class="match-label">已匹配技能：</div>
            <div class="match-tags">
              <el-tag
                v-for="skill in matchedSkills"
                :key="skill"
                type="success"
                size="small"
              >
                {{ skill }}
              </el-tag>
              <span v-if="matchedSkills.length === 0" class="no-match">暂无匹配技能</span>
            </div>
          </div>
          <div class="skill-missing">
            <div class="match-label">缺失技能：</div>
            <div class="match-tags">
              <el-tag
                v-for="skill in missingSkills"
                :key="skill"
                type="danger"
                size="small"
              >
                {{ skill }}
              </el-tag>
              <span v-if="missingSkills.length === 0" class="no-match">无缺失技能</span>
            </div>
          </div>
        </div>
      </div>

      <el-divider v-if="resumeStore.jdAnalysis" />

      <!-- 简历完整度 -->
      <div class="completion-rate">
        <div class="rate-label">简历完整度</div>
        <el-progress
          :percentage="resumeStore.completionRate"
          :status="resumeStore.completionRate === 100 ? 'success' : ''"
        />
      </div>

      <el-divider />

      <!-- 简历信息摘要 -->
      <div class="resume-summary">
        <h4>简历信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ resumeStore.resumeData.basicInfo.name || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="求职岗位">{{ resumeStore.resumeData.basicInfo.jobTitle || '未填写' }}</el-descriptions-item>
          <el-descriptions-item label="教育经历">{{ resumeStore.resumeData.education.length }} 段</el-descriptions-item>
          <el-descriptions-item label="工作经历">{{ resumeStore.resumeData.workExperience.length }} 段</el-descriptions-item>
          <el-descriptions-item label="项目经历">{{ resumeStore.resumeData.projects.length }} 段</el-descriptions-item>
          <el-descriptions-item label="技能标签">{{ resumeStore.resumeData.skills.length }} 个</el-descriptions-item>
        </el-descriptions>
      </div>

      <div class="preview-hint">
        <el-alert
          title="点击「查看简历」按钮可预览完整简历效果"
          type="info"
          :closable="false"
          show-icon
        />
      </div>
    </el-card>

    <!-- 简历预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="简历预览"
      width="900px"
      top="5vh"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="preview-dialog"
    >
      <div class="preview-container">
        <!-- 模板选择 -->
        <div class="template-selector-dialog">
          <span class="label">选择模板：</span>
          <el-radio-group v-model="selectedTemplate">
            <el-radio-button label="modern">现代简约</el-radio-button>
            <el-radio-button label="classic">经典商务</el-radio-button>
            <el-radio-button label="creative">创意现代</el-radio-button>
            <el-radio-button label="minimal">简约清新</el-radio-button>
          </el-radio-group>
          <el-button type="primary" size="small" @click="exportPDF" class="export-btn">
            <el-icon><Download /></el-icon>导出PDF
          </el-button>
        </div>

        <!-- 简历内容 -->
        <div class="resume-container-wrapper-dialog">
          <ModernTemplate
            v-if="selectedTemplate === 'modern'"
            :key="templateKey"
            ref="templateRef"
            :resume-data="resumeStore.resumeData"
          />
          <ClassicTemplate
            v-if="selectedTemplate === 'classic'"
            :key="templateKey"
            ref="templateRef"
            :resume-data="resumeStore.resumeData"
          />
          <CreativeTemplate
            v-if="selectedTemplate === 'creative'"
            :key="templateKey"
            ref="templateRef"
            :resume-data="resumeStore.resumeData"
          />
          <MinimalTemplate
            v-if="selectedTemplate === 'minimal'"
            :key="templateKey"
            ref="templateRef"
            :resume-data="resumeStore.resumeData"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Download, View } from '@element-plus/icons-vue'
import { useResumeStore } from '@/stores/resume'
import ModernTemplate from './templates/ModernTemplate.vue'
import ClassicTemplate from './templates/ClassicTemplate.vue'
import CreativeTemplate from './templates/CreativeTemplate.vue'
import MinimalTemplate from './templates/MinimalTemplate.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { aiService } from '@/services/aiService'

const resumeStore = useResumeStore()
const selectedTemplate = ref('modern')
const templateRef = ref<InstanceType<typeof ModernTemplate | typeof ClassicTemplate | typeof CreativeTemplate | typeof MinimalTemplate>>()
const previewDialogVisible = ref(false)
const templateKey = ref(0) // 用于强制刷新模板组件

// 匹配度分数
const matchScore = ref(0)

// 显示预览对话框
const showPreviewDialog = () => {
  previewDialogVisible.value = true
  // 强制刷新模板组件以加载最新照片
  templateKey.value++
}

// 计算匹配的技能
const matchedSkills = computed(() => {
  if (!resumeStore.jdAnalysis) return []
  const resumeSkills = resumeStore.resumeData.skills.map(s => s.toLowerCase())
  return resumeStore.jdAnalysis.hardSkills.filter(skill =>
    resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
  )
})

// 计算缺失的技能
const missingSkills = computed(() => {
  if (!resumeStore.jdAnalysis) return []
  const resumeSkills = resumeStore.resumeData.skills.map(s => s.toLowerCase())
  return resumeStore.jdAnalysis.hardSkills.filter(skill =>
    !resumeSkills.some(rs => rs.includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs))
  )
})

// 分数颜色
const scoreColor = computed(() => {
  if (matchScore.value >= 80) return '#67c23a'
  if (matchScore.value >= 60) return '#e6a23c'
  return '#f56c6c'
})

// 监听JD分析变化，计算匹配度
watch(() => resumeStore.jdAnalysis, async (newVal) => {
  if (newVal && resumeStore.resumeData.skills.length > 0) {
    try {
      const score = await aiService.calculateMatchScore(
        resumeStore.resumeData.skills,
        newVal.hardSkills
      )
      matchScore.value = score
      resumeStore.setMatchScore(score)
    } catch (error) {
      // 计算简单匹配度
      const total = newVal.hardSkills.length
      const matched = matchedSkills.value.length
      matchScore.value = total > 0 ? Math.round((matched / total) * 100) : 0
    }
  }
}, { immediate: true })

// 导出PDF
const exportPDF = async () => {
  // 等待对话框打开并渲染完成
  await new Promise(resolve => setTimeout(resolve, 500))

  if (!templateRef.value?.resumeRef) {
    ElMessage.error('简历内容未加载')
    return
  }

  try {
    ElMessage.info('正在生成PDF...')

    const element = templateRef.value.resumeRef
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)

    const imgX = (pdfWidth - imgWidth * ratio) / 2
    let imgY = 0

    let heightLeft = imgHeight * ratio
    let position = 0

    // 添加第一页
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    heightLeft -= pdfHeight

    // 如果内容超过一页，添加新页面
    while (heightLeft > 0) {
      position = heightLeft - imgHeight * ratio
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio)
      heightLeft -= pdfHeight
    }

    // 下载PDF
    const fileName = `${resumeStore.resumeData.basicInfo.name || '简历'}_${resumeStore.resumeData.basicInfo.jobTitle || '求职'}.pdf`
    pdf.save(fileName)

    ElMessage.success('PDF导出成功')
  } catch (error) {
    console.error('PDF导出错误:', error)
    ElMessage.error('PDF导出失败')
  }
}
</script>

<style scoped>
.resume-preview {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 16px;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.match-analysis {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.match-score {
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.score-number {
  font-size: 28px;
  font-weight: bold;
}

.score-label {
  font-size: 12px;
}

.match-details {
  flex: 1;
}

.match-details h4 {
  margin-bottom: 10px;
  color: #333;
}

.skill-match,
.skill-missing {
  margin-bottom: 10px;
}

.match-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.match-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.no-match {
  color: #999;
  font-size: 12px;
}

.completion-rate {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.rate-label {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.resume-summary {
  margin-bottom: 15px;
}

.resume-summary h4 {
  margin-bottom: 10px;
  color: #333;
}

.preview-hint {
  margin-top: 15px;
}

/* 预览对话框样式 */
.preview-dialog :deep(.el-dialog) {
  z-index: 2000 !important;
}

.preview-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.preview-container {
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.template-selector-dialog {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
}

.template-selector-dialog .label {
  font-size: 14px;
  color: #666;
}

.export-btn {
  margin-left: auto;
}

.resume-container-wrapper-dialog {
  flex: 1;
  overflow: auto;
  padding: 20px;
  background: #e8e8e8;
  display: flex;
  justify-content: center;
}
</style>
