<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">费用分摊管理</h1>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        新增分摊记录
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 bg-opacity-20">
            <CurrencyDollarIcon class="w-8 h-8 text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">本月总费用</p>
            <p class="text-2xl font-semibold text-white">¥45,680</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-500 bg-opacity-20">
            <HomeIcon class="w-8 h-8 text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">宿舍费用</p>
            <p class="text-2xl font-semibold text-white">¥12,340</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-500 bg-opacity-20">
            <BuildingOfficeIcon class="w-8 h-8 text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">办公费用</p>
            <p class="text-2xl font-semibold text-white">¥33,340</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能模块 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 宿舍费用管理 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">宿舍费用管理</h3>
        <div class="space-y-4">
          <router-link
            to="/expense/dormitory"
            class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <HomeIcon class="w-6 h-6 text-blue-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">宿舍信息管理</p>
              <p class="text-xs text-gray-400">管理宿舍基本信息和租金设置</p>
            </div>
          </router-link>
          
          <router-link
            to="/expense/meter-reading"
            class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ClipboardDocumentListIcon class="w-6 h-6 text-green-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">抄表录入</p>
              <p class="text-xs text-gray-400">录入宿舍水电表读数</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- 费用核算 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">费用核算分摊</h3>
        <div class="space-y-4">
          <router-link
            to="/expense/calculation"
            class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <CalculatorIcon class="w-6 h-6 text-purple-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">费用计算</p>
              <p class="text-xs text-gray-400">自动计算各项费用分摊</p>
            </div>
          </router-link>
          
          <router-link
            to="/expense/reports"
            class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <ChartBarIcon class="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">费用报表</p>
              <p class="text-xs text-gray-400">查看费用统计和分析报表</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 最近记录 -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-white mb-4">最近分摊记录</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">日期</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">类型</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">总金额</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">分摊方式</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">状态</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-700 hover:bg-gray-700 transition-colors">
              <td class="py-3 px-4 text-sm text-gray-300">2024-07-20</td>
              <td class="py-3 px-4 text-sm text-gray-300">水电费</td>
              <td class="py-3 px-4 text-sm text-gray-300">¥3,456</td>
              <td class="py-3 px-4 text-sm text-gray-300">按用量分摊</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded">
                  已完成
                </span>
              </td>
              <td class="py-3 px-4">
                <button class="text-blue-400 hover:text-blue-300 text-sm">查看详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  CurrencyDollarIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  CalculatorIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
</script>