<template>
  <div class="editable-section" :class="{ 'edit-mode': editMode }">
    <!-- 区块头部 -->
    <div class="section-header">
      <h3 class="section-title">
        <EditableField
          v-model="sectionData.title"
          :edit-mode="editMode"
          tag="span"
          :placeholder="'标题'"
          @update:model-value="updateField('title', $event)"
        />
      </h3>
      <div v-if="editMode" class="section-actions">
        <el-button type="danger" size="small" circle @click="deleteSection">
          <el-icon><Delete /></el-icon>
        </el-button>
        <el-button type="primary" size="small" circle @click="moveUp" :disabled="isFirst">
          <el-icon><ArrowUp /></el-icon>
        </el-button>
        <el-button type="primary" size="small" circle @click="moveDown" :disabled="isLast">
          <el-icon><ArrowDown /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 条目列表 -->
    <div class="items-list">
      <div
        v-for="(item, index) in sectionData.items"
        :key="item.id"
        class="item-card"
        :class="{ 'dragging': draggingIndex === index }"
        draggable="true"
        @dragstart="handleDragStart(index, $event)"
        @dragover="handleDragOver(index, $event)"
        @drop="handleDrop(index, $event)"
        @dragend="handleDragEnd"
      >
        <!-- 拖拽手柄 -->
        <div v-if="editMode" class="drag-handle">
          <el-icon><Rank /></el-icon>
        </div>

        <!-- 条目内容 -->
        <div class="item-content">
          <div class="item-header">
            <div class="item-title-row">
              <EditableField
                v-model="item.name"
                :edit-mode="editMode"
                tag="span"
                class="item-name"
                :placeholder="itemNamePlaceholder"
                @update:model-value="updateItemField(index, 'name', $event)"
              />
              <EditableField
                v-model="item.date"
                :edit-mode="editMode"
                tag="span"
                class="item-date"
                :placeholder="'时间'"
                @update:model-value="updateItemField(index, 'date', $event)"
              />
            </div>
            <EditableField
              v-if="item.subtitle !== undefined"
              v-model="item.subtitle"
              :edit-mode="editMode"
              tag="div"
              class="item-subtitle"
              :placeholder="itemSubtitlePlaceholder"
              @update:model-value="updateItemField(index, 'subtitle', $event)"
            />
          </div>

          <div class="item-body">
            <EditableField
              v-model="item.description"
              :edit-mode="editMode"
              tag="div"
              class="item-description"
              :placeholder="'描述内容'"
              multiline
              @update:model-value="updateItemField(index, 'description', $event)"
            />
          </div>
        </div>

        <!-- 条目操作 -->
        <div v-if="editMode" class="item-actions">
          <el-button type="danger" size="small" text @click="deleteItem(index)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 添加条目按钮 -->
    <div v-if="editMode" class="add-item-row">
      <el-button type="primary" plain @click="addItem">
        <el-icon><Plus /></el-icon>
        添加{{ itemNamePlaceholder }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Delete, ArrowUp, ArrowDown, Rank, Plus } from '@element-plus/icons-vue'
import EditableField from './EditableField.vue'

interface SectionItem {
  id: string
  name: string
  subtitle?: string
  date: string
  description: string
}

interface SectionData {
  title: string
  items: SectionItem[]
}

const props = defineProps<{
  modelValue: SectionData
  editMode?: boolean
  itemNamePlaceholder?: string
  itemSubtitlePlaceholder?: string
  isFirst?: boolean
  isLast?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: SectionData]
  'delete': []
  'move-up': []
  'move-down': []
}>()

const sectionData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const draggingIndex = ref<number | null>(null)

// 生成唯一ID
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

// 更新字段
const updateField = (field: string, value: string) => {
  emit('update:modelValue', {
    ...sectionData.value,
    [field]: value
  })
}

// 更新条目字段
const updateItemField = (index: number, field: string, value: string) => {
  const newItems = [...sectionData.value.items]
  const item = newItems[index]
  if (item) {
    newItems[index] = { ...item, [field]: value }
    emit('update:modelValue', {
      ...sectionData.value,
      items: newItems
    })
  }
}

// 添加条目
const addItem = () => {
  const newItem: SectionItem = {
    id: generateId(),
    name: '',
    subtitle: props.itemSubtitlePlaceholder ? '' : undefined,
    date: '',
    description: ''
  }
  emit('update:modelValue', {
    ...sectionData.value,
    items: [...sectionData.value.items, newItem]
  })
}

// 删除条目
const deleteItem = (index: number) => {
  const newItems = sectionData.value.items.filter((_, i) => i !== index)
  emit('update:modelValue', {
    ...sectionData.value,
    items: newItems
  })
}

// 删除区块
const deleteSection = () => {
  emit('delete')
}

// 上移
const moveUp = () => {
  emit('move-up')
}

// 下移
const moveDown = () => {
  emit('move-down')
}

// 拖拽功能
const handleDragStart = (index: number, e: DragEvent) => {
  draggingIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
  }
}

const handleDragOver = (index: number, e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move'
  }
}

const handleDrop = (index: number, e: DragEvent) => {
  e.preventDefault()
  const fromIndex = parseInt(e.dataTransfer?.getData('text/plain') || '-1')
  if (fromIndex !== -1 && fromIndex !== index) {
    const items = [...sectionData.value.items]
    const movedItem = items[fromIndex]
    if (movedItem) {
      items.splice(fromIndex, 1)
      items.splice(index, 0, movedItem)
      emit('update:modelValue', {
        ...sectionData.value,
        items
      })
    }
  }
  draggingIndex.value = null
}

const handleDragEnd = () => {
  draggingIndex.value = null
}
</script>

<style scoped>
.editable-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #333;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-card {
  position: relative;
  padding: 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.edit-mode .item-card {
  background: #f5f7fa;
  border: 1px dashed #dcdfe6;
}

.edit-mode .item-card:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.item-card.dragging {
  opacity: 0.5;
}

.drag-handle {
  position: absolute;
  left: -28px;
  top: 50%;
  transform: translateY(-50%);
  cursor: move;
  padding: 4px;
  color: #909399;
}

.drag-handle:hover {
  color: #409eff;
}

.item-content {
  flex: 1;
}

.item-header {
  margin-bottom: 8px;
}

.item-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.item-name {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.item-date {
  font-size: 14px;
  color: #666;
}

.item-subtitle {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.item-description {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  white-space: pre-wrap;
}

.item-actions {
  position: absolute;
  right: 8px;
  top: 8px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.item-card:hover .item-actions {
  opacity: 1;
}

.add-item-row {
  margin-top: 16px;
  text-align: center;
}
</style>
