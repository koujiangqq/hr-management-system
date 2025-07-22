<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">车队管理</h1>
      <button class="btn-primary">
        <PlusIcon class="w-5 h-5 mr-2" />
        添加车辆
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 bg-opacity-20">
            <TruckIcon class="w-8 h-8 text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">车辆总数</p>
            <p class="text-2xl font-semibold text-white">8</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-500 bg-opacity-20">
            <CheckCircleIcon class="w-8 h-8 text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">正常运行</p>
            <p class="text-2xl font-semibold text-white">6</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-yellow-500 bg-opacity-20">
            <ExclamationTriangleIcon class="w-8 h-8 text-yellow-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">维修中</p>
            <p class="text-2xl font-semibold text-white">1</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-red-500 bg-opacity-20">
            <XCircleIcon class="w-8 h-8 text-red-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">停用</p>
            <p class="text-2xl font-semibold text-white">1</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 功能模块 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 车辆管理 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">车辆管理</h3>
        <div class="space-y-4">
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <TruckIcon class="w-6 h-6 text-blue-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">车辆档案</p>
              <p class="text-xs text-gray-400">管理车辆基本信息和档案</p>
            </div>
          </div>
          
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <WrenchScrewdriverIcon class="w-6 h-6 text-green-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">维修保养</p>
              <p class="text-xs text-gray-400">记录车辆维修保养情况</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 司机管理 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">司机管理</h3>
        <div class="space-y-4">
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <UserIcon class="w-6 h-6 text-purple-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">司机档案</p>
              <p class="text-xs text-gray-400">管理司机基本信息和资质</p>
            </div>
          </div>
          
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <ClipboardDocumentListIcon class="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">出车记录</p>
              <p class="text-xs text-gray-400">记录和管理出车情况</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 车辆列表 -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-white mb-4">车辆列表</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">车牌号</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">车型</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">司机</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">状态</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">年检到期</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">保险到期</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-700 hover:bg-gray-700 transition-colors">
              <td class="py-3 px-4 text-sm text-white font-medium">渝A12345</td>
              <td class="py-3 px-4 text-sm text-gray-300">东风货车</td>
              <td class="py-3 px-4 text-sm text-gray-300">张师傅</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded">
                  正常
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-300">2024-12-15</td>
              <td class="py-3 px-4 text-sm text-gray-300">2024-10-20</td>
              <td class="py-3 px-4">
                <div class="flex items-center space-x-2">
                  <button class="text-blue-400 hover:text-blue-300 text-sm">编辑</button>
                  <button class="text-green-400 hover:text-green-300 text-sm">维修</button>
                  <button class="text-red-400 hover:text-red-300 text-sm">删除</button>
                </div>
              </td>
            </tr>
            <tr class="border-b border-gray-700 hover:bg-gray-700 transition-colors">
              <td class="py-3 px-4 text-sm text-white font-medium">渝A67890</td>
              <td class="py-3 px-4 text-sm text-gray-300">解放卡车</td>
              <td class="py-3 px-4 text-sm text-gray-300">李师傅</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 bg-yellow-500 bg-opacity-20 text-yellow-400 text-xs rounded">
                  维修中
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-300">2025-03-10</td>
              <td class="py-3 px-4 text-sm text-gray-300">2024-11-05</td>
              <td class="py-3 px-4">
                <div class="flex items-center space-x-2">
                  <button class="text-blue-400 hover:text-blue-300 text-sm">编辑</button>
                  <button class="text-green-400 hover:text-green-300 text-sm">维修</button>
                  <button class="text-red-400 hover:text-red-300 text-sm">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 即将到期提醒 -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-white mb-4">即将到期提醒</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-20 rounded-lg">
          <div class="flex items-center">
            <ExclamationTriangleIcon class="w-5 h-5 text-yellow-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">渝A12345 保险即将到期</p>
              <p class="text-xs text-gray-400">到期时间: 2024-10-20 (还有 3 个月)</p>
            </div>
          </div>
          <button class="text-yellow-400 hover:text-yellow-300 text-sm">处理</button>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 rounded-lg">
          <div class="flex items-center">
            <ExclamationTriangleIcon class="w-5 h-5 text-red-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">渝A67890 年检即将到期</p>
              <p class="text-xs text-gray-400">到期时间: 2025-03-10 (还有 8 个月)</p>
            </div>
          </div>
          <button class="text-red-400 hover:text-red-300 text-sm">处理</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  TruckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  ClipboardDocumentListIcon
} from '@heroicons/vue/24/outline'
</script>