<template>
  <div class="space-y-6">
    <!-- 操作栏 -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <div class="flex items-center space-x-4">
        <router-link to="/files/upload" class="btn-primary">
          <DocumentArrowUpIcon class="w-5 h-5 mr-2" />
          上传文件
        </router-link>
        <button @click="toggleView" class="btn-secondary">
          <component :is="viewMode === 'grid' ? ListBulletIcon : Squares2X2Icon" class="w-5 h-5 mr-2" />
          {{ viewMode === 'grid' ? '列表视图' : '网格视图' }}
        </button>
      </div>

      <!-- 搜索和筛选 -->
      <div class="flex items-center space-x-4">
        <div class="relative">
          <MagnifyingGlassIcon class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文件..."
            class="input-field pl-10 w-64"
            @input="handleSearch"
          />
        </div>
        
        <select v-model="selectedCategory" @change="handleFilter" class="input-field">
          <option value="">所有分类</option>
          <option value="ADMIN">行政公文</option>
          <option value="CONTRACT">合同文件</option>
          <option value="CERT">证照文件</option>
          <option value="INVOICE">电子发票</option>
          <option value="REPORT">检测报告</option>
          <option value="REGULATION">规章制度</option>
        </select>
      </div>
    </div>

    <!-- 文件统计 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card p-4">
        <div class="flex items-center">
          <DocumentIcon class="w-8 h-8 text-blue-400 mr-3" />
          <div>
            <p class="text-sm text-gray-400">总文件数</p>
            <p class="text-xl font-semibold text-white">{{ fileStats.total }}</p>
          </div>
        </div>
      </div>
      
      <div class="card p-4">
        <div class="flex items-center">
          <CloudArrowUpIcon class="w-8 h-8 text-green-400 mr-3" />
          <div>
            <p class="text-sm text-gray-400">本月上传</p>
            <p class="text-xl font-semibold text-white">{{ fileStats.thisMonth }}</p>
          </div>
        </div>
      </div>
      
      <div class="card p-4">
        <div class="flex items-center">
          <ExclamationTriangleIcon class="w-8 h-8 text-yellow-400 mr-3" />
          <div>
            <p class="text-sm text-gray-400">即将到期</p>
            <p class="text-xl font-semibold text-white">{{ fileStats.expiring }}</p>
          </div>
        </div>
      </div>
      
      <div class="card p-4">
        <div class="flex items-center">
          <ServerIcon class="w-8 h-8 text-purple-400 mr-3" />
          <div>
            <p class="text-sm text-gray-400">存储空间</p>
            <p class="text-xl font-semibold text-white">{{ fileStats.storage }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件列表 -->
    <div class="card">
      <div class="p-6 border-b border-gray-700">
        <h3 class="text-lg font-semibold text-white">文件列表</h3>
      </div>
      
      <div class="p-6">
        <!-- 网格视图 -->
        <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="file in filteredFiles"
            :key="file.id"
            class="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
            @click="openFile(file)"
          >
            <div class="flex items-center mb-3">
              <component :is="getFileIcon(file.type)" class="w-8 h-8 text-blue-400 mr-3" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white truncate">{{ file.name }}</p>
                <p class="text-xs text-gray-400">{{ file.size }}</p>
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs text-gray-400">
                <span>{{ getCategoryName(file.category) }}</span>
                <span>{{ formatDate(file.uploadTime) }}</span>
              </div>
              
              <div v-if="file.tags && file.tags.length > 0" class="flex flex-wrap gap-1">
                <span
                  v-for="tag in file.tags.slice(0, 3)"
                  :key="tag"
                  class="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded"
                >
                  {{ tag }}
                </span>
                <span v-if="file.tags.length > 3" class="text-xs text-gray-400">
                  +{{ file.tags.length - 3 }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 列表视图 -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-700">
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">文件名</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">分类</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">大小</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">上传时间</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">标签</th>
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="file in filteredFiles"
                :key="file.id"
                class="border-b border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <td class="py-3 px-4">
                  <div class="flex items-center">
                    <component :is="getFileIcon(file.type)" class="w-5 h-5 text-blue-400 mr-3" />
                    <span class="text-sm text-white">{{ file.name }}</span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="text-sm text-gray-300">{{ getCategoryName(file.category) }}</span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-sm text-gray-300">{{ file.size }}</span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-sm text-gray-300">{{ formatDate(file.uploadTime) }}</span>
                </td>
                <td class="py-3 px-4">
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="tag in file.tags?.slice(0, 2)"
                      :key="tag"
                      class="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded"
                    >
                      {{ tag }}
                    </span>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="downloadFile(file)"
                      class="p-1 text-gray-400 hover:text-white"
                      title="下载"
                    >
                      <ArrowDownTrayIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="shareFile(file)"
                      class="p-1 text-gray-400 hover:text-white"
                      title="分享"
                    >
                      <ShareIcon class="w-4 h-4" />
                    </button>
                    <button
                      @click="deleteFile(file)"
                      class="p-1 text-gray-400 hover:text-red-400"
                      title="删除"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="flex items-center justify-between mt-6">
          <div class="text-sm text-gray-400">
            显示 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalFiles) }} 
            共 {{ totalFiles }} 个文件
          </div>
          
          <div class="flex items-center space-x-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 bg-gray-700 text-gray-300 rounded disabled:opacity-50"
            >
              上一页
            </button>
            
            <span class="px-3 py-1 bg-blue-600 text-white rounded">{{ currentPage }}</span>
            
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-3 py-1 bg-gray-700 text-gray-300 rounded disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  DocumentIcon,
  DocumentArrowUpIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  ServerIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  TrashIcon,
  DocumentTextIcon,
  PhotoIcon,
  FilmIcon,
  MusicalNoteIcon
} from '@heroicons/vue/24/outline'

// 响应式数据
const viewMode = ref<'grid' | 'list'>('grid')
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(20)

// 文件统计
const fileStats = ref({
  total: 0,
  thisMonth: 0,
  expiring: 0,
  storage: '0GB'
})

// 文件列表
const files = ref<any[]>([])
const totalFiles = ref(0)

// 计算属性
const totalPages = computed(() => Math.ceil(totalFiles.value / pageSize.value))

const filteredFiles = computed(() => {
  let result = files.value

  if (searchQuery.value) {
    result = result.filter(file => 
      file.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (selectedCategory.value) {
    result = result.filter(file => file.category === selectedCategory.value)
  }

  return result
})

// 方法
const toggleView = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
}

const handleSearch = () => {
  currentPage.value = 1
  // 实际应该调用API搜索
}

const handleFilter = () => {
  currentPage.value = 1
  // 实际应该调用API筛选
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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const openFile = (file: any) => {
  // 打开文件预览
  console.log('打开文件:', file)
}

const downloadFile = (file: any) => {
  // 下载文件
  console.log('下载文件:', file)
}

const shareFile = (file: any) => {
  // 分享文件
  console.log('分享文件:', file)
}

const deleteFile = (file: any) => {
  // 删除文件
  if (confirm('确定要删除这个文件吗？')) {
    console.log('删除文件:', file)
  }
}

const loadFiles = async () => {
  // 模拟数据，实际应该从API获取
  files.value = [
    {
      id: 1,
      name: '合同文件_2024.pdf',
      type: 'pdf',
      size: '2.3MB',
      category: 'CONTRACT',
      uploadTime: '2024-07-20T10:30:00Z',
      tags: ['合同', '2024年', '重要']
    },
    {
      id: 2,
      name: '电费账单_7月.xlsx',
      type: 'xlsx',
      size: '156KB',
      category: 'INVOICE',
      uploadTime: '2024-07-19T15:20:00Z',
      tags: ['电费', '7月', '账单']
    },
    {
      id: 3,
      name: '车辆保险单.pdf',
      type: 'pdf',
      size: '1.8MB',
      category: 'CERT',
      uploadTime: '2024-07-18T09:15:00Z',
      tags: ['保险', '车辆', '证照']
    }
  ]
  
  totalFiles.value = files.value.length
  
  fileStats.value = {
    total: 1248,
    thisMonth: 156,
    expiring: 23,
    storage: '15.6GB'
  }
}

onMounted(() => {
  loadFiles()
})
</script>