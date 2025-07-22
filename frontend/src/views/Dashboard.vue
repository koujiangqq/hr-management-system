<template>
  <div class="space-y-6">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 bg-opacity-20">
            <DocumentIcon class="w-8 h-8 text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">总文件数</p>
            <p class="text-2xl font-semibold text-white">{{ stats.totalFiles }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-500 bg-opacity-20">
            <CurrencyDollarIcon class="w-8 h-8 text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">本月费用</p>
            <p class="text-2xl font-semibold text-white">¥{{ stats.monthlyExpense }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-500 bg-opacity-20">
            <BoltIcon class="w-8 h-8 text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">电费支出</p>
            <p class="text-2xl font-semibold text-white">¥{{ stats.electricityBill }}</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-500 bg-opacity-20">
            <TruckIcon class="w-8 h-8 text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">车辆数量</p>
            <p class="text-2xl font-semibold text-white">{{ stats.vehicleCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-white mb-4">快捷操作</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <router-link
          to="/files/upload"
          class="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <DocumentArrowUpIcon class="w-8 h-8 text-blue-400 mb-2" />
          <span class="text-sm text-gray-300">上传文件</span>
        </router-link>

        <router-link
          to="/expense"
          class="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <CalculatorIcon class="w-8 h-8 text-green-400 mb-2" />
          <span class="text-sm text-gray-300">费用分摊</span>
        </router-link>

        <router-link
          to="/electricity"
          class="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <ChartBarIcon class="w-8 h-8 text-yellow-400 mb-2" />
          <span class="text-sm text-gray-300">电费核算</span>
        </router-link>

        <router-link
          to="/fleet"
          class="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <WrenchScrewdriverIcon class="w-8 h-8 text-purple-400 mb-2" />
          <span class="text-sm text-gray-300">车队管理</span>
        </router-link>
      </div>
    </div>

    <!-- 最近活动 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">最近上传的文件</h3>
        <div class="space-y-3">
          <div
            v-for="file in recentFiles"
            :key="file.id"
            class="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
          >
            <div class="flex items-center">
              <DocumentIcon class="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <p class="text-sm font-medium text-white">{{ file.name }}</p>
                <p class="text-xs text-gray-400">{{ file.uploadTime }}</p>
              </div>
            </div>
            <span class="text-xs text-gray-400">{{ file.size }}</span>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">待处理事项</h3>
        <div class="space-y-3">
          <div
            v-for="task in pendingTasks"
            :key="task.id"
            class="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
          >
            <div class="flex items-center">
              <ExclamationTriangleIcon class="w-5 h-5 text-yellow-400 mr-3" />
              <div>
                <p class="text-sm font-medium text-white">{{ task.title }}</p>
                <p class="text-xs text-gray-400">{{ task.dueDate }}</p>
              </div>
            </div>
            <span class="text-xs px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 rounded">
              {{ task.priority }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  DocumentIcon,
  CurrencyDollarIcon,
  BoltIcon,
  TruckIcon,
  DocumentArrowUpIcon,
  CalculatorIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

// 统计数据
const stats = ref({
  totalFiles: 0,
  monthlyExpense: 0,
  electricityBill: 0,
  vehicleCount: 0
})

// 最近文件
const recentFiles = ref([
  {
    id: 1,
    name: '合同文件_2024.pdf',
    uploadTime: '2小时前',
    size: '2.3MB'
  },
  {
    id: 2,
    name: '电费账单_7月.xlsx',
    uploadTime: '5小时前',
    size: '156KB'
  },
  {
    id: 3,
    name: '车辆保险单.pdf',
    uploadTime: '1天前',
    size: '1.8MB'
  }
])

// 待处理事项
const pendingTasks = ref([
  {
    id: 1,
    title: '合同即将到期提醒',
    dueDate: '3天后',
    priority: '高'
  },
  {
    id: 2,
    title: '车辆年检到期',
    dueDate: '1周后',
    priority: '中'
  },
  {
    id: 3,
    title: '电费账单核对',
    dueDate: '明天',
    priority: '高'
  }
])

// 加载统计数据
const loadStats = async () => {
  // 模拟数据，实际应该从API获取
  stats.value = {
    totalFiles: 1248,
    monthlyExpense: 45680,
    electricityBill: 12340,
    vehicleCount: 8
  }
}

onMounted(() => {
  loadStats()
})
</script>