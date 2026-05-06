<template>
  <div class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <h1 class="app-title">AI简历助手</h1>
        <div class="header-actions">
          <el-button class="gray-btn" text @click="showHelp">
            使用帮助
          </el-button>
          <el-button class="gray-btn" text @click="clearAll">
            清空数据
          </el-button>
        </div>
      </div>
    </el-header>

    <el-main class="app-main">
      <div class="main-layout">
        <!-- 左侧：JD解析区域 -->
        <div class="left-panel">
          <JDParser />
        </div>

        <!-- 右侧：编辑区域 -->
        <div class="right-panel">
          <div class="editor-header">
            <span class="editor-title">简历编辑</span>
            <el-button class="dark-btn preview-btn" @click="showPreviewDialog">
              查看简历
            </el-button>
          </div>
          <div class="editor-content">
            <ResumeEditor />
          </div>
        </div>
      </div>
    </el-main>

    <!-- 帮助对话框 -->
    <el-dialog v-model="helpDialogVisible" title="使用帮助" width="600px">
      <div class="help-content">
        <h4>快速开始</h4>
        <ol>
          <li><strong>解析岗位JD：</strong>在左侧上方粘贴招聘网站的岗位描述，点击"解析岗位需求"</li>
          <li><strong>填写简历信息：</strong>在编辑器中填写你的基本信息、教育经历、工作经历等</li>
          <li><strong>AI智能优化：</strong>点击工作经历和项目经历卡片上的"AI优化"按钮</li>
          <li><strong>查看匹配度：</strong>右侧会显示简历与岗位的匹配度分析</li>
          <li><strong>导出PDF：</strong>点击"导出PDF"按钮下载简历</li>
        </ol>

        <h4>使用技巧</h4>
        <ul>
          <li>先解析JD再填写简历，可以获得更精准的优化建议</li>
          <li>使用AI生成的自我评价，更贴合岗位要求</li>
          <li>关注匹配度分析，补充缺失的技能关键词</li>
          <li>简历完整度达到100%时，导出效果最佳</li>
        </ul>

        <h4>API配置</h4>
        <p>如需使用AI功能，请在项目根目录创建.env文件，添加你的智谱AI API Key：</p>
        <pre>VITE_ZHIPU_API_KEY=your_api_key_here</pre>
      </div>
    </el-dialog>

    <!-- 简历预览全屏对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="简历预览"
      :width="isFullscreen ? '100%' : '950px'"
      :top="isFullscreen ? '0' : '3vh'"
      :fullscreen="isFullscreen"
      :close-on-click-modal="false"
      :append-to-body="true"
      class="preview-dialog"
      :class="{ 'fullscreen-dialog': isFullscreen }"
      @close="handleDialogClose"
    >
      <div class="preview-container">
        <!-- 模板选择和编辑工具栏 -->
        <div class="template-selector-dialog">
          <div class="template-selector">
            <span class="label">选择模板：</span>
            <el-radio-group v-model="selectedTemplate" :disabled="isEditMode">
              <el-radio-button label="creative">创意现代</el-radio-button>
              <el-radio-button label="modern">现代简约</el-radio-button>
              <el-radio-button label="minimal">简约清新</el-radio-button>
            </el-radio-group>
          </div>
          <div class="dialog-actions">
            <!-- 缩放控制 -->
            <div class="zoom-controls">
              <el-button size="small" circle @click="decreaseZoom">-</el-button>
              <span class="zoom-value">{{ Math.round(zoomLevel * 100) }}%</span>
              <el-button size="small" circle @click="increaseZoom">+</el-button>
              <el-button size="small" @click="resetZoom">重置</el-button>
            </div>
            <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏显示'" placement="top">
              <el-button 
                class="gray-btn-small"
                size="small" 
                @click="toggleFullscreen"
              >
                {{ isFullscreen ? '退出全屏' : '全屏' }}
              </el-button>
            </el-tooltip>
            <el-tooltip :content="isEditMode ? '点击完成保存修改' : '进入Word式编辑模式'" placement="top">
              <el-button 
                :class="isEditMode ? 'dark-btn-small' : 'gray-btn-small'" 
                size="small" 
                @click="toggleEditMode"
              >
                {{ isEditMode ? '完成编辑' : '编辑简历' }}
              </el-button>
            </el-tooltip>
            <el-button class="dark-btn-small" size="small" @click="exportPDF" :disabled="isEditMode">
              导出PDF
            </el-button>
          </div>
        </div>

        <!-- 编辑模式提示 -->
        <div v-if="isEditMode" class="edit-mode-banner">
          <el-alert
            title="Word式编辑模式已开启 - 点击任意文字即可编辑，支持增删条目、拖拽排序"
            type="warning"
            :closable="false"
            show-icon
          />
        </div>

        <!-- 简历内容 -->
        <div 
          class="resume-container-wrapper-dialog" 
          :class="{ 'edit-mode': isEditMode, 'fullscreen-wrapper': isFullscreen }"
          :style="resumeWrapperStyle"
        >
          <div class="resume-scale-wrapper" :style="resumeScaleStyle">
            <CreativeTemplate
              v-if="selectedTemplate === 'creative'"
              :key="templateKey"
              ref="templateRef"
              :resume-data="editableResumeData"
              :edit-mode="isEditMode"
              @update:data="handleDataUpdate"
            />
            <ModernTemplate
              v-if="selectedTemplate === 'modern'"
              :key="templateKey"
              ref="templateRef"
              :resume-data="editableResumeData"
              :edit-mode="isEditMode"
              @update:data="handleDataUpdate"
            />
            <MinimalTemplate
              v-if="selectedTemplate === 'minimal'"
              :key="templateKey"
              ref="templateRef"
              :resume-data="editableResumeData"
              :edit-mode="isEditMode"
              @update:data="handleDataUpdate"
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, QuestionFilled, View, Edit, FullScreen, Plus, Minus, Download } from '@element-plus/icons-vue'
import { useResumeStore } from '@/stores/resume'
import JDParser from '@/components/JDParser.vue'
import ResumeEditor from '@/components/ResumeEditor.vue'
import CreativeTemplate from '@/components/templates/CreativeTemplate.vue'
import ModernTemplate from '@/components/templates/ModernTemplate.vue'
import MinimalTemplate from '@/components/templates/MinimalTemplate.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import type { ResumeData } from '@/stores/resume'

const resumeStore = useResumeStore()
const helpDialogVisible = ref(false)

// 预览对话框相关
const previewDialogVisible = ref(false)
const selectedTemplate = ref('creative')
const templateRef = ref<InstanceType<typeof CreativeTemplate | typeof ModernTemplate | typeof MinimalTemplate>>()
const templateKey = ref(0)
const isEditMode = ref(false)
const isFullscreen = ref(false)
const zoomLevel = ref(1)

// 可编辑的简历数据副本
const editableResumeData = ref<ResumeData>(JSON.parse(JSON.stringify(resumeStore.resumeData)))

// 简历容器样式
const resumeWrapperStyle = computed(() => {
  if (isFullscreen.value) {
    return {
      height: isEditMode.value ? 'calc(100vh - 200px)' : 'calc(100vh - 160px)',
      overflow: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '20px',
      background: '#f5f5f5'
    }
  }
  return {
    maxHeight: isEditMode.value ? 'calc(90vh - 200px)' : 'calc(90vh - 160px)',
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '20px',
    background: '#f5f5f5'
  }
})

const resumeScaleStyle = computed(() => {
  return {
    transform: `scale(${zoomLevel.value})`,
    transformOrigin: 'top center',
    transition: 'transform 0.2s ease'
  }
})

// 监听简历数据变化
watch(() => resumeStore.resumeData, (newData) => {
  if (!isEditMode.value) {
    editableResumeData.value = JSON.parse(JSON.stringify(newData))
  }
}, { deep: true })

const showPreviewDialog = () => {
  previewDialogVisible.value = true
  // 重置编辑状态
  isEditMode.value = false
  editableResumeData.value = JSON.parse(JSON.stringify(resumeStore.resumeData))
}

const handleDialogClose = () => {
  isEditMode.value = false
  isFullscreen.value = false
  zoomLevel.value = 1
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
}

const toggleEditMode = () => {
  if (isEditMode.value) {
    // 保存编辑的数据
    resumeStore.updateResumeData(editableResumeData.value)
    ElMessage.success('修改已保存')
  }
  isEditMode.value = !isEditMode.value
  templateKey.value++ // 强制刷新模板
}

const handleDataUpdate = (newData: ResumeData) => {
  editableResumeData.value = newData
}

const increaseZoom = () => {
  if (zoomLevel.value < 1.5) {
    zoomLevel.value += 0.1
  }
}

const decreaseZoom = () => {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value -= 0.1
  }
}

const resetZoom = () => {
  zoomLevel.value = 1
}

const exportPDF = async () => {
  if (!templateRef.value) return
  
  try {
    ElMessage.info('正在生成PDF，请稍候...')
    
    const element = templateRef.value.$el
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    pdf.save(`${editableResumeData.value.basicInfo.name || '简历'}_${new Date().toLocaleDateString()}.pdf`)
    
    ElMessage.success('PDF导出成功')
  } catch (error) {
    console.error('PDF导出失败:', error)
    ElMessage.error('PDF导出失败，请重试')
  }
}

const showHelp = () => {
  helpDialogVisible.value = true
}

const clearAll = () => {
  ElMessageBox.confirm(
    '确定要清空所有数据吗？此操作不可恢复',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    resumeStore.clearData()
    // 清空照片
    localStorage.removeItem('resume_photo')
    // 触发页面刷新以清除照片显示
    window.location.reload()
    ElMessage.success('数据已清空')
  }).catch(() => {})
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 60px;
  line-height: 60px;
  flex-shrink: 0;
}

.header-content {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 黑灰色系按钮样式 */
.gray-btn {
  color: #4a4a4a;
  background-color: transparent;
}

.gray-btn:hover {
  color: #1a1a1a;
  background-color: #f0f0f0;
}

.dark-btn {
  background-color: #333333;
  border-color: #333333;
  color: #ffffff;
}

.dark-btn:hover {
  background-color: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

.gray-btn-small {
  background-color: #f5f5f5;
  border-color: #d0d0d0;
  color: #4a4a4a;
}

.gray-btn-small:hover {
  background-color: #e8e8e8;
  border-color: #b0b0b0;
  color: #1a1a1a;
}

.dark-btn-small {
  background-color: #333333;
  border-color: #333333;
  color: #ffffff;
}

.dark-btn-small:hover {
  background-color: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

.dark-btn-small:disabled {
  background-color: #999999;
  border-color: #999999;
  color: #ffffff;
}

.app-main {
  flex: 1;
  padding: 0;
  overflow: hidden;
}

.main-layout {
  display: flex;
  height: calc(100vh - 60px);
}

/* 左侧JD解析区域 */
.left-panel {
  width: 40%;
  min-width: 400px;
  max-width: 500px;
  background: white;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
  padding: 20px;
}

/* 右侧编辑区域 */
.right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.editor-title {
  font-size: 16px;
  font-weight: bold;
  color: #1a1a1a;
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: 5px;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 帮助内容样式 */
.help-content {
  line-height: 1.8;
}

.help-content h4 {
  color: #1a1a1a;
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: 600;
}

.help-content ol,
.help-content ul {
  padding-left: 20px;
}

.help-content li {
  margin-bottom: 8px;
}

.help-content pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

/* 预览对话框样式 */
.preview-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.preview-dialog.fullscreen-dialog :deep(.el-dialog) {
  margin: 0 !important;
  border-radius: 0;
}

.preview-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.template-selector-dialog {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  flex-shrink: 0;
}

.template-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.template-selector .label {
  font-weight: bold;
  color: #1a1a1a;
}

.dialog-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.zoom-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 10px;
  padding-right: 10px;
  border-right: 1px solid #e4e7ed;
}

.zoom-value {
  min-width: 50px;
  text-align: center;
  font-size: 14px;
  color: #1a1a1a;
}

.edit-mode-banner {
  flex-shrink: 0;
}

.resume-container-wrapper-dialog {
  flex: 1;
  overflow: auto;
}

.resume-scale-wrapper {
  width: 210mm;
  min-height: 297mm;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式适配 */
@media (max-width: 1024px) {
  .left-panel {
    width: 45%;
    min-width: 350px;
  }
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
    max-width: none;
    min-width: auto;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
    max-height: 50vh;
  }
  
  .right-panel {
    flex: 1;
  }
  
  .template-selector-dialog {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .dialog-actions {
    flex-wrap: wrap;
  }
}
</style>
