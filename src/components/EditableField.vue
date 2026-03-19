<template>
  <component
    :is="tag"
    ref="editableRef"
    :contenteditable="editMode"
    class="editable-field"
    :class="{ 'editing': isEditing, 'empty': isEmpty && !isEditing, 'multiline': multiline }"
    @blur="handleBlur"
    @focus="handleFocus"
    @keydown="handleKeydown"
    @input="handleInput"
    v-html="displayHtml"
  />
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps<{
  modelValue: string
  editMode?: boolean
  tag?: string
  placeholder?: string
  multiline?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': [value: string]
  'focus': []
}>()

const editableRef = ref<HTMLElement>()
const isEditing = ref(false)
const internalValue = ref(props.modelValue)

const tag = computed(() => props.tag || 'span')

const isEmpty = computed(() => !internalValue.value || internalValue.value.trim() === '')

const displayValue = computed(() => {
  // 编辑模式下，如果正在编辑，显示内部值（不显示placeholder）
  if (isEditing.value) {
    return internalValue.value
  }
  // 非编辑状态，如果为空且有placeholder，显示placeholder
  if (props.editMode && isEmpty.value && props.placeholder) {
    return props.placeholder
  }
  return internalValue.value
})

// 将换行符转换为 <br> 标签用于显示
const displayHtml = computed(() => {
  const text = displayValue.value
  if (!text) return ''
  // 将换行符转换为 <br> 标签
  return text.replace(/\n/g, '<br>')
})

// 只在非编辑状态下同步外部值
watch(() => props.modelValue, (newVal) => {
  if (!isEditing.value && newVal !== internalValue.value) {
    internalValue.value = newVal
  }
})

const handleFocus = () => {
  isEditing.value = true
  // 聚焦时，如果显示的是placeholder，清空内容
  if (props.editMode && isEmpty.value && props.placeholder) {
    nextTick(() => {
      if (editableRef.value) {
        editableRef.value.innerText = ''
      }
    })
  }
  emit('focus')
}

const handleBlur = () => {
  isEditing.value = false
  const value = editableRef.value?.innerText || ''
  internalValue.value = value
  emit('update:modelValue', value)
  emit('blur', value)
}

const handleInput = () => {
  const value = editableRef.value?.innerText || ''
  internalValue.value = value
  // 使用防抖，避免频繁更新父组件导致重新渲染
  emit('update:modelValue', value)
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!props.multiline && e.key === 'Enter') {
    e.preventDefault()
    editableRef.value?.blur()
  }
}

// 聚焦方法
const focus = () => {
  nextTick(() => {
    editableRef.value?.focus()
  })
}

defineExpose({
  focus,
  editableRef
})
</script>

<style scoped>
.editable-field {
  display: inline-block;
  min-width: 20px;
  outline: none;
  transition: all 0.2s ease;
  border-radius: 2px;
  white-space: pre-wrap;
  word-break: break-word;
}

.editable-field[contenteditable="true"] {
  cursor: text;
  background: rgba(64, 158, 255, 0.1);
  padding: 2px 4px;
  border: 1px dashed #409eff;
}

.editable-field[contenteditable="true"]:hover {
  background: rgba(64, 158, 255, 0.15);
}

.editable-field[contenteditable="true"]:focus {
  background: rgba(64, 158, 255, 0.2);
  border-style: solid;
}

/* 空值且非编辑状态下显示placeholder样式 */
.editable-field.empty[contenteditable="true"]:not(:focus) {
  color: #999;
  font-style: italic;
}
</style>
