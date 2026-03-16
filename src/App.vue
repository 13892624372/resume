<template>
  <div class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <h1 class="app-title">🎯 AI简历助手</h1>
        <div class="header-actions">
          <el-button type="info" text @click="showHelp">
            <el-icon><QuestionFilled /></el-icon>使用帮助
          </el-button>
          <el-button type="danger" text @click="clearAll">
            <el-icon><Delete /></el-icon>清空数据
          </el-button>
        </div>
      </div>
    </el-header>

    <el-main class="app-main">
      <el-row :gutter="20">
        <!-- 左侧：JD解析和编辑器 -->
        <el-col :span="12">
          <div class="left-panel">
            <JDParser />
            <ResumeEditor />
          </div>
        </el-col>

        <!-- 右侧：简历预览 -->
        <el-col :span="12">
          <div class="right-panel">
            <ResumePreview />
          </div>
        </el-col>
      </el-row>
    </el-main>

    <!-- 帮助对话框 -->
    <el-dialog v-model="helpDialogVisible" title="使用帮助" width="600px">
      <div class="help-content">
        <h4>🚀 快速开始</h4>
        <ol>
          <li><strong>解析岗位JD：</strong>在左侧上方粘贴招聘网站的岗位描述，点击"解析岗位需求"</li>
          <li><strong>填写简历信息：</strong>在编辑器中填写你的基本信息、教育经历、工作经历等</li>
          <li><strong>AI智能优化：</strong>点击工作经历和项目经历卡片上的"AI优化"按钮</li>
          <li><strong>查看匹配度：</strong>右侧会显示简历与岗位的匹配度分析</li>
          <li><strong>导出PDF：</strong>点击"导出PDF"按钮下载简历</li>
        </ol>

        <h4>💡 使用技巧</h4>
        <ul>
          <li>先解析JD再填写简历，可以获得更精准的优化建议</li>
          <li>使用AI生成的自我评价，更贴合岗位要求</li>
          <li>关注匹配度分析，补充缺失的技能关键词</li>
          <li>简历完整度达到100%时，导出效果最佳</li>
        </ul>

        <h4>🔑 API配置</h4>
        <p>如需使用AI功能，请在项目根目录创建.env文件，添加你的智谱AI API Key：</p>
        <pre>VITE_ZHIPU_API_KEY=your_api_key_here</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, QuestionFilled } from '@element-plus/icons-vue'
import { useResumeStore } from '@/stores/resume'
import JDParser from '@/components/JDParser.vue'
import ResumeEditor from '@/components/ResumeEditor.vue'
import ResumePreview from '@/components/ResumePreview.vue'

const resumeStore = useResumeStore()
const helpDialogVisible = ref(false)

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
}

.app-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
  height: 60px;
  line-height: 60px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  margin: 0;
  font-size: 20px;
  color: #2c5aa0;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.app-main {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.left-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.right-panel {
  position: sticky;
  top: 20px;
}

.help-content {
  line-height: 1.8;
}

.help-content h4 {
  color: #2c5aa0;
  margin-top: 20px;
  margin-bottom: 10px;
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
  font-family: monospace;
}
</style>
