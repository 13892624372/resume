<template>
  <div class="jd-parser">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="title">📋 岗位JD解析</span>
          <el-tag v-if="jdAnalysis" type="success">已解析</el-tag>
        </div>
      </template>

      <el-input
        v-model="jdText"
        type="textarea"
        :rows="6"
        placeholder="请粘贴招聘网站的岗位描述（JD）内容，AI将自动提取关键要求..."
        class="jd-input"
      />

      <div class="actions">
        <el-button
          type="primary"
          :loading="parsing"
          :disabled="!jdText.trim()"
          @click="parseJD"
        >
          <el-icon><Search /></el-icon>
          解析岗位需求
        </el-button>
        <el-button @click="clearJD">清空</el-button>
      </div>

      <!-- 解析结果 -->
      <div v-if="jdAnalysis" class="analysis-result">
        <el-divider />
        <h3>解析结果</h3>

        <div class="result-section">
          <div class="section-label">岗位名称：</div>
          <div class="section-content">{{ jdAnalysis.position || '未识别' }}</div>
        </div>

        <div class="result-section">
          <div class="section-label">硬性技能要求：</div>
          <div class="section-content">
            <el-tag
              v-for="(skill, index) in jdAnalysis.hardSkills"
              :key="index"
              type="primary"
              class="skill-tag"
            >
              {{ skill }}
            </el-tag>
            <span v-if="jdAnalysis.hardSkills.length === 0" class="empty-text">未识别到硬性技能</span>
          </div>
        </div>

        <div class="result-section">
          <div class="section-label">软技能要求：</div>
          <div class="section-content">
            <el-tag
              v-for="(skill, index) in jdAnalysis.softSkills"
              :key="index"
              type="warning"
              class="skill-tag"
            >
              {{ skill }}
            </el-tag>
            <span v-if="jdAnalysis.softSkills.length === 0" class="empty-text">未识别到软技能</span>
          </div>
        </div>

        <div class="result-section">
          <div class="section-label">经验要求：</div>
          <div class="section-content">{{ jdAnalysis.experienceRequired || '未明确' }}</div>
        </div>

        <div class="result-section">
          <div class="section-label">核心关键词：</div>
          <div class="section-content">
            <el-tag
              v-for="(keyword, index) in jdAnalysis.keywords"
              :key="index"
              type="info"
              class="skill-tag"
            >
              {{ keyword }}
            </el-tag>
          </div>
        </div>

        <div class="result-section">
          <div class="section-label">匹配建议：</div>
          <div class="section-content tips">{{ jdAnalysis.matchTips }}</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { aiService } from '@/services/aiService'
import { useResumeStore } from '@/stores/resume'
import type { JDAnalysisResult } from '@/services/aiService'

const resumeStore = useResumeStore()

const jdText = ref('')
const parsing = ref(false)
const jdAnalysis = ref<JDAnalysisResult | null>(null)

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
}
</script>

<style scoped>
.jd-parser {
  margin-bottom: 20px;
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

.jd-input {
  margin-bottom: 15px;
}

.actions {
  display: flex;
  gap: 10px;
}

.analysis-result {
  margin-top: 20px;
}

.analysis-result h3 {
  margin-bottom: 15px;
  color: #2c5aa0;
}

.result-section {
  margin-bottom: 15px;
}

.section-label {
  font-weight: bold;
  color: #666;
  margin-bottom: 5px;
}

.section-content {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.skill-tag {
  margin-right: 5px;
}

.empty-text {
  color: #999;
  font-size: 14px;
}

.tips {
  background: #f0f9ff;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #2c5aa0;
  color: #555;
  line-height: 1.6;
}
</style>
