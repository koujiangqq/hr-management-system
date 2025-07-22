<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">文件上传</h1>
      <router-link to="/files" class="btn-secondary">
        <ArrowLeftIcon class="w-5 h-5 mr-2" />
        返回文件列表
      </router-link>
    </div>

    <!-- 上传区域 -->
    <div class="card p-6">
      <div
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
        class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
        :class="{ 'border-blue-500 bg-blue-500 bg-opacity-10': isDragging }"
      >
        <CloudArrowUpIcon class="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-white mb-2">拖拽文件到此处或点击选择</h3>
        <p class="text-gray-400 mb-4">支持多文件上传，单个文件最大 100MB</p>
        
        <input
          ref="fileInput"
          type="file"
          multiple
          @change="handleFileSelect"
          class="hidden"
        />
        
        <button
          @click="$refs.fileInput?.click()"
          class="btn-primary"
        >
          选择文件
        </button>
      </div>
    </div>

    <!-- 文件列表 -->
    <div v-if="uploadFiles.length > 0" class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">待上传文件 ({{ uploadFiles.length }})</h3>
        <div class="flex items-center space-x-2">
          <button
            @click="clearAll"
            class="text-sm text-gray-400 hover:text-white"
          >
            清空全部
          </button>
          <button
            @click="uploadAll"
            :disabled="uploading"
            class="btn-primary"
          >
            <span v-if="uploading">上传中...</span>
            <span v-else>上传全部</span>
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <div
          v-for="(file, index) in uploadFiles"
          :key="index"
          class="bg-gray-700 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center flex-1 min-w-0">
              <component :is="getFileIcon(file.type)" class="w-8 h-8 text-blue-400 mr-3 flex-shrink-0" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ file.name }}</p>
                <p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            
            <button
              @click="removeFile(index)"
              class="p-1 text-gray-400 hover:text-red-400 ml-2"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- 文件信息表单 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">文件分类</label>
              <select v-model="file.category" class="input-field w-full">
                <option value="">请选择分类</option>
                <option value="ADMIN">行政公文</option>
                <option value="CONTRACT">合同文件</option>
                <option value="CERT">证照文件</option>
                <option value="INVOICE">电子发票</option>
                <option value="REPORT">检测报告</option>
                <option value="REGULATION">规章制度</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-1">到期日期</label>
              <input
                v-model="file.expirationDate"
                type="date"
                class="input-field w-full"
              />
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-300 mb-1">标签</label>
            <div class="flex items-center space-x-2">
              <input
                v-model="file.newTag"
                @keyup.enter="addTag(file)"
                type="text"
                placeholder="输入标签后按回车添加"
                class="input-field flex-1"
              />
              <button
                @click="addTag(file)"
                class="btn-secondary px-3 py-2"
              >
                添加
              </button>
            </div>
            
            <div v-if="file.tags && file.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
              <span
                v-for="(tag, tagIndex) in file.tags"
                :key="tagIndex"
                class="inline-flex items-center px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-sm rounded"
              >
                {{ tag }}
                <button
                  @click="removeTag(file, tagIndex)"
                  class="ml-1 text-blue-300 hover:text-blue-100"
                >
                  <XMarkIcon class="w-3 h-3" />
                </button>
              </span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-1">备注</label>
            <textarea
              v-model="file.description"
              rows="2"
              placeholder="文件描述或备注信息"
              class="input-field w-full resize-none"
            ></textarea>
          </div>

          <!-- 上传进度 -->
          <div v-if="file.uploading" class="mt-4">
            <div class="flex items-center justify-between text-sm text-gray-300 mb-1">
              <span>上传进度</span>
              <span>{{ file.progress }}%</span>
            </div>
            <div class="w-full bg-gray-600 rounded-full h-2">
              <div
                class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                :style="{ width: file.progress + '%' }"
              ></div>
            </div>
          </div>

          <!-- 上传状态 -->
          <div v-if="file.status" class="mt-4">
            <div
              class="flex items-center text-sm"
              :class="{
                'text-green-400': file.status === 'success',
                'text-red-400': file.status === 'error',
                'text-blue-400': file.status === 'uploading'
              }"
            >
              <CheckCircleIcon v-if="file.status === 'success'" class="w-5 h-5 mr-2" />
              <ExclamationCircleIcon v-if="file.status === 'error'" class="w-5 h-5 mr-2" />
              <ArrowPathIcon v-if="file.status === 'uploading'" class="w-5 h-5 mr-2 animate-spin" />
              
              <span v-if="file.status === 'success'">上传成功</span>
              <span v-if="file.status === 'error'">上传失败: {{ file.error }}</span>
              <span v-if="file.status === 'uploading'">正在上传...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI 分类建议 -->
    <div v-if="aiSuggestions.length > 0" class="card p-6">
      <h3 class="text-lg font-semibold text-white mb-4">AI 智能分类建议</h3>
      <div class="space-y-3">
        <div
          v-for="suggestion in aiSuggestions"
          :key="suggestion.fileIndex"
          class="bg-gray-700 rounded-lg p-4"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-white">{{ uploadFiles[suggestion.fileIndex]?.name }}</p>
              <p class="text-xs text-gray-400 mt-1">
                建议分类: <span class="text-blue-400">{{ getCategoryName(suggestion.category) }}</span>
              </p>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="tag in suggestion.tags"
                  :key="tag"
                  class="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            
            <button
              @click="applySuggestion(suggestion)"
              class="btn-primary text-sm"
            >
              应用建议
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  ArrowLeftIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  DocumentIcon,
  DocumentTextIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon
} from '@heroicons/vue/24/outline'

// 响应式数据
const isDragging = ref(false)
const uploading = ref(false)
const uploadFiles = ref<any[]>([])
const aiSuggestions = ref<any[]>([])

// 文件处理方法
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = Array.from(e.dataTransfer?.files || [])
  addFiles(files)
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = Array.from(target.files || [])
  addFiles(files)
  target.value = '' // 清空input，允许重复选择同一文件
}

const addFiles = (files: File[]) => {
  files.forEach(file => {
    const fileObj = reactive({
      file,
      name: file.name,
      size: file.size,
      type: file.name.split('.').pop()?.toLowerCase() || '',
      category: '',
      expirationDate: '',
      tags: [] as string[],
      newTag: '',
      description: '',
      uploading: false,
      progress: 0,
      status: '',
      error: ''
    })
    
    uploadFiles.value.push(fileObj)
  })
  
  // 触发AI分类建议
  generateAISuggestions()
}

const removeFile = (index: number) => {
  uploadFiles.value.splice(index, 1)
}

const clearAll = () => {
  uploadFiles.value = []
  aiSuggestions.value = []
}

const addTag = (file: any) => {
  if (file.newTag.trim() && !file.tags.includes(file.newTag.trim())) {
    file.tags.push(file.newTag.trim())
    file.newTag = ''
  }
}

const removeTag = (file: any, tagIndex: number) => {
  file.tags.splice(tagIndex, 1)
}

const getFileIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    'pdf': DocumentTextIcon,
    'doc': DocumentTextIcon,
    'docx': DocumentTextIcon,
    'xls': DocumentTextIcon,
    'xlsx': DocumentTextIcon,
    'jpg': PhotoIcon,
    'jpeg': PhotoIcon,
    'png': PhotoIcon,
    'gif': PhotoIcon,
    'mp4': FilmIcon,
    'avi': FilmIcon,
    'mp3': MusicalNoteIcon,
    'wav': MusicalNoteIcon
  }
  
  return iconMap[type.toLowerCase()] || DocumentIcon
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getCategoryName = (category: string) => {
  const categoryMap: Record<string, string> = {
    'ADMIN': '行政公文',
    'CONTRACT': '合同文件',
    'CERT': '证照文件',
    'INVOICE': '电子发票',
    'REPORT': '检测报告',
    'REGULATION': '规章制度'
  }
  
  return categoryMap[category] || '未分类'
}

// AI 分类建议
const generateAISuggestions = () => {
  // 模拟AI分类建议
  setTimeout(() => {
    const suggestions = uploadFiles.value.map((file, index) => {
      // 基于文件名简单判断分类
      let category = ''
      let tags: string[] = []
      
      const fileName = file.name.toLowerCase()
      
      if (fileName.includes('合同') || fileName.includes('contract')) {
        category = 'CONTRACT'
        tags = ['合同', '法务']
      } else if (fileName.includes('发票') || fileName.includes('invoice')) {
        category = 'INVOICE'
        tags = ['发票', '财务']
      } else if (fileName.includes('证') || fileName.includes('cert')) {
        category = 'CERT'
        tags = ['证照', '资质']
      } else if (fileName.includes('报告') || fileName.includes('report')) {
        category = 'REPORT'
        tags = ['报告', '检测']
      } else if (fileName.includes('制度') || fileName.includes('规定')) {
        category = 'REGULATION'
        tags = ['制度', '规范']
      } else {
        category = 'ADMIN'
        tags = ['行政', '公文']
      }
      
      return {
        fileIndex: index,
        category,
        tags,
        confidence: Math.random() * 0.3 + 0.7 // 70-100% 置信度
      }
    }).filter(s => s.confidence > 0.8) // 只显示高置信度的建议
    
    aiSuggestions.value = suggestions
  }, 1000)
}

const applySuggestion = (suggestion: any) => {
  const file = uploadFiles.value[suggestion.fileIndex]
  if (file) {
    file.category = suggestion.category
    file.tags = [...new Set([...file.tags, ...suggestion.tags])]
  }
  
  // 移除已应用的建议
  aiSuggestions.value = aiSuggestions.value.filter(s => s.fileIndex !== suggestion.fileIndex)
}

// 上传文件
const uploadFile = async (file: any) => {
  file.uploading = true
  file.status = 'uploading'
  file.progress = 0
  
  try {
    // 模拟上传进度
    const interval = setInterval(() => {
      file.progress += Math.random() * 20
      if (file.progress >= 100) {
        file.progress = 100
        clearInterval(interval)
        file.status = 'success'
        file.uploading = false
      }
    }, 200)
    
    // 实际上传逻辑应该在这里
    // const formData = new FormData()
    // formData.append('file', file.file)
    // formData.append('category', file.category)
    // formData.append('tags', JSON.stringify(file.tags))
    // formData.append('description', file.description)
    // formData.append('expirationDate', file.expirationDate)
    
    // const response = await api.post('/files/upload', formData)
    
  } catch (error) {
    file.status = 'error'
    file.error = '上传失败，请重试'
    file.uploading = false
  }
}

const uploadAll = async () => {
  uploading.value = true
  
  const uploadPromises = uploadFiles.value
    .filter(file => !file.status || file.status === 'error')
    .map(file => uploadFile(file))
  
  await Promise.all(uploadPromises)
  
  uploading.value = false
}
</script>