<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">电费核算管理</h1>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        录入抄表数据
      </button>
    </div>

    <!-- 统计概览 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-500 bg-opacity-20">
            <BoltIcon class="w-8 h-8 text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">本月用电量</p>
            <p class="text-2xl font-semibold text-white">12,456 kWh</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-500 bg-opacity-20">
            <CurrencyDollarIcon class="w-8 h-8 text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">星达电费</p>
            <p class="text-2xl font-semibold text-white">¥8,234</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 bg-opacity-20">
            <CurrencyDollarIcon class="w-8 h-8 text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">持睿电费</p>
            <p class="text-2xl font-semibold text-white">¥4,567</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-500 bg-opacity-20">
            <HomeIcon class="w-8 h-8 text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">宿舍电费</p>
            <p class="text-2xl font-semibold text-white">¥2,890</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能模块 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 抄表管理 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">抄表管理</h3>
        <div class="space-y-4">
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <ClipboardDocumentListIcon class="w-6 h-6 text-blue-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">租户抄表管理</p>
              <p class="text-xs text-gray-400">录入持睿汽车的水电表抄表数据</p>
            </div>
          </div>
          
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <HomeIcon class="w-6 h-6 text-green-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">宿舍费用管理</p>
              <p class="text-xs text-gray-400">宿舍水电费抄表和计算</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 费用核算 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">费用核算分摊</h3>
        <div class="space-y-4">
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <CalculatorIcon class="w-6 h-6 text-purple-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">星达分时电费统计</p>
              <p class="text-xs text-gray-400">星达铜业分时电费计算和统计</p>
            </div>
          </div>
          
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <ChartBarIcon class="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">持睿分时电费统计</p>
              <p class="text-xs text-gray-400">持睿汽车分时电费计算和统计</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 电费明细 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 星达电费明细 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">星达电费明细</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">峰时电费</span>
            <span class="text-sm text-white">¥3,456</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">平时电费</span>
            <span class="text-sm text-white">¥2,890</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">谷时电费</span>
            <span class="text-sm text-white">¥1,888</span>
          </div>
          <div class="border-t border-gray-700 pt-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-white">总计</span>
              <span class="text-sm font-semibold text-white">¥8,234</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 持睿电费明细 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">持睿电费明细</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">工业电费</span>
            <span class="text-sm text-white">¥2,677</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-400">居民电费</span>
            <span class="text-sm text-white">¥1,890</span>
          </div>
          <div class="border-t border-gray-700 pt-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-white">总计</span>
              <span class="text-sm font-semibold text-white">¥4,567</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据分析 -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-white mb-4">用电量趋势分析</h3>
      <div class="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
        <p class="text-gray-400">图表组件将在这里显示用电量趋势</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  BoltIcon,
  CurrencyDollarIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  CalculatorIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
</script>