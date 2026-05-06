<template>
  <div class="jd-parser">
    <!-- 上半段：JD输入 -->
    <div class="jd-input-section">
      <div class="section-header">
        <span class="title">岗位JD输入</span>
        <el-tag v-if="jdAnalysis" type="success" effect="dark">已解析</el-tag>
      </div>

      <el-input
        v-model="jdText"
        type="textarea"
        :rows="10"
        placeholder="请粘贴招聘网站的岗位描述（JD）内容，AI将自动提取关键要求..."
        class="jd-input"
        resize="none"
      />

      <div class="input-actions">
        <el-button
          class="dark-btn"
          :loading="parsing"
          :disabled="!jdText.trim()"
          @click="parseJD"
          size="large"
        >
          解析岗位需求
        </el-button>
        <el-button class="gray-btn" @click="clearJD" :disabled="!jdText && !jdAnalysis">
          清空
        </el-button>
      </div>
    </div>

    <!-- 分割线 -->
    <el-divider class="section-divider">
      解析结果
    </el-divider>

    <!-- 下半段：解析结果 -->
    <div class="jd-result-section">
      <div v-if="!jdAnalysis" class="empty-result">
        <el-empty description="请先输入岗位JD并点击解析" />
      </div>

      <div v-else class="analysis-result">
        <div class="result-card">
          <div class="result-item">
            <div class="item-label">
              岗位名称
            </div>
            <div class="item-content highlight">{{ jdAnalysis.position || '未识别' }}</div>
          </div>

          <div class="result-item">
            <div class="item-label">
              硬性技能要求
            </div>
            <div class="item-content">
              <el-tag
                v-for="(skill, index) in jdAnalysis.hardSkills"
                :key="index"
                class="skill-tag dark-tag"
              >
                {{ skill }}
              </el-tag>
              <span v-if="jdAnalysis.hardSkills.length === 0" class="empty-text">未识别到硬性技能</span>
            </div>
          </div>

          <div class="result-item">
            <div class="item-label">
              软技能要求
            </div>
            <div class="item-content">
              <el-tag
                v-for="(skill, index) in jdAnalysis.softSkills"
                :key="index"
                type="warning"
                effect="light"
                class="skill-tag"
              >
                {{ skill }}
              </el-tag>
              <span v-if="jdAnalysis.softSkills.length === 0" class="empty-text">未识别到软技能</span>
            </div>
          </div>

          <div class="result-item">
            <div class="item-label">
              经验要求
            </div>
            <div class="item-content">{{ jdAnalysis.experienceRequired || '未明确' }}</div>
          </div>

          <div class="result-item">
            <div class="item-label">
              核心关键词
            </div>
            <div class="item-content">
              <el-tag
                v-for="(keyword, index) in jdAnalysis.keywords"
                :key="index"
                type="info"
                effect="plain"
                class="skill-tag"
              >
                {{ keyword }}
              </el-tag>
              <span v-if="!jdAnalysis.keywords || jdAnalysis.keywords.length === 0" class="empty-text">未识别到关键词</span>
            </div>
          </div>

          <div class="result-item tips-item">
            <div class="item-label">
              匹配建议
            </div>
            <div class="item-content tips">{{ jdAnalysis.matchTips || '暂无建议' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { aiService } from '@/services/aiService'
import { useResumeStore } from '@/stores/resume'
import type { JDAnalysisResult } from '@/services/aiService'

const resumeStore = useResumeStore()

const jdText = ref('')
const parsing = ref(false)
const jdAnalysis = ref<JDAnalysisResult | null>(null)

onMounted(() => {
  // 恢复已保存的JD分析结果
  if (resumeStore.jdAnalysis) {
    jdAnalysis.value = resumeStore.jdAnalysis
  }
})

const parseJD = async () => {
  if (!jdText.value.trim()) {
    ElMessage.warning('请先输入岗位JD内容')
    return
  }

  parsing.value = true
  try {
    const result = await aiService.parseJD(jdText.value)
    jdAnalysis.value = result
    resumeStore.setJDAnalysis(result)
    ElMessage.success('JD解析成功')
  } catch (error: any) {
    ElMessage.error(error.message || '解析失败，请检查API Key配置')
  } finally {
    parsing.value = false
  }
}

const clearJD = () => {
  jdText.value = ''
  jdAnalysis.value = null
  resumeStore.jdAnalysis = null
  ElMessage.info('已清空')
}
</script>

<style scoped>
.jd-parser {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 上半段：JD输入 */
.jd-input-section {
  flex-shrink: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #1a1a1a;
}

.jd-input {
  margin-bottom: 15px;
}

.jd-input :deep(.el-textarea__inner) {
  font-size: 14px;
  line-height: 1.6;
}

.input-actions {
  display: flex;
  gap: 10px;
}

/* 分割线 */
.section-divider {
  margin: 20px 0;
  color: #909399;
}

.section-divider :deep(.el-divider__text) {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f5f7fa;
  padding: 0 15px;
}

/* 下半段：解析结果 */
.jd-result-section {
  flex: 1;
  overflow-y: auto;
  min-height: 200px;
}

.empty-result {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 200px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.analysis-result {
  padding-bottom: 20px;
}

.result-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.result-item {
  margin-bottom: 15px;
}

.result-item:last-child {
  margin-bottom: 0;
}

.item-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-size: 13px;
}

.item-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding-left: 0;
  color: #1a1a1a;
  font-size: 14px;
  line-height: 1.5;
}

.item-content.highlight {
  color: #1a1a1a;
  font-weight: bold;
  font-size: 15px;
}

.skill-tag {
  margin-right: 0;
}

.empty-text {
  color: #666666;
  font-size: 13px;
  font-style: italic;
}

.tips-item {
  background: #f0f0f0;
  border-radius: 6px;
  padding: 12px;
  margin-top: 10px;
}

.tips-item .item-label {
  color: #1a1a1a;
}

.tips {
  color: #333333;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 黑灰色系按钮样式 */
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

.dark-btn:disabled {
  background-color: #999999;
  border-color: #999999;
  color: #ffffff;
}

.gray-btn {
  background-color: #f5f5f5;
  border-color: #d0d0d0;
  color: #4a4a4a;
}

.gray-btn:hover {
  background-color: #e8e8e8;
  border-color: #b0b0b0;
  color: #1a1a1a;
}

.gray-btn:disabled {
  background-color: #f0f0f0;
  border-color: #e0e0e0;
  color: #999999;
}

/* 深色系标签样式 */
.dark-tag {
  background-color: #333333;
  border-color: #333333;
  color: #ffffff;
}

.dark-tag:hover {
  background-color: #1a1a1a;
  border-color: #1a1a1a;
  color: #ffffff;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .jd-input-section {
    flex-shrink: 0;
  }
  
  .jd-result-section {
    flex: 1;
  }
  
  .input-actions {
    flex-wrap: wrap;
  }
  
  .input-actions .el-button {
    flex: 1;
  }
}
</style>
