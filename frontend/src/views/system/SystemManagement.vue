<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">系统管理</h1>
    </div>

    <!-- 功能模块 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 用户管理 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">用户管理</h3>
        <div class="space-y-4">
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <UserGroupIcon class="w-6 h-6 text-blue-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">用户列表</p>
              <p class="text-xs text-gray-400">管理系统用户账号和权限</p>
            </div>
          </div>
          
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <ShieldCheckIcon class="w-6 h-6 text-green-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">角色权限</p>
              <p class="text-xs text-gray-400">配置用户角色和访问权限</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 系统配置 -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-white mb-4">系统配置</h3>
        <div class="space-y-4">
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <CogIcon class="w-6 h-6 text-purple-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">基础设置</p>
              <p class="text-xs text-gray-400">系统基本参数和配置</p>
            </div>
          </div>
          
          <div class="flex items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">
            <ServerIcon class="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <p class="text-sm font-medium text-white">存储配置</p>
              <p class="text-xs text-gray-400">配置S3和WebDAV存储</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 系统状态 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-green-500 bg-opacity-20">
            <CheckCircleIcon class="w-8 h-8 text-green-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">系统状态</p>
            <p class="text-lg font-semibold text-green-400">正常运行</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-blue-500 bg-opacity-20">
            <UserGroupIcon class="w-8 h-8 text-blue-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">在线用户</p>
            <p class="text-lg font-semibold text-white">5</p>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-purple-500 bg-opacity-20">
            <ServerIcon class="w-8 h-8 text-purple-400" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-400">存储使用</p>
            <p class="text-lg font-semibold text-white">15.6GB / 100GB</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户列表 -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">用户列表</h3>
        <button class="btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          添加用户
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="border-b border-gray-700">
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">用户名</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">姓名</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">角色</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">状态</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">最后登录</th>
              <th class="text-left py-3 px-4 text-sm font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-700 hover:bg-gray-700 transition-colors">
              <td class="py-3 px-4 text-sm text-white font-medium">admin</td>
              <td class="py-3 px-4 text-sm text-gray-300">系统管理员</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 bg-red-500 bg-opacity-20 text-red-400 text-xs rounded">
                  超级管理员
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded">
                  正常
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-300">2024-07-22 10:30</td>
              <td class="py-3 px-4">
                <div class="flex items-center space-x-2">
                  <button class="text-blue-400 hover:text-blue-300 text-sm">编辑</button>
                  <button class="text-yellow-400 hover:text-yellow-300 text-sm">重置密码</button>
                </div>
              </td>
            </tr>
            <tr class="border-b border-gray-700 hover:bg-gray-700 transition-colors">
              <td class="py-3 px-4 text-sm text-white font-medium">hr_manager</td>
              <td class="py-3 px-4 text-sm text-gray-300">人事经理</td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 bg-blue-500 bg-opacity-20 text-blue-400 text-xs rounded">
                  管理员
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-1 bg-green-500 bg-opacity-20 text-green-400 text-xs rounded">
                  正常
                </span>
              </td>
              <td class="py-3 px-4 text-sm text-gray-300">2024-07-22 09:15</td>
              <td class="py-3 px-4">
                <div class="flex items-center space-x-2">
                  <button class="text-blue-400 hover:text-blue-300 text-sm">编辑</button>
                  <button class="text-yellow-400 hover:text-yellow-300 text-sm">重置密码</button>
                  <button class="text-red-400 hover:text-red-300 text-sm">禁用</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 系统日志 -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-white mb-4">系统日志</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
          <div class="flex items-center">
            <div class="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
            <div>
              <p class="text-sm text-white">用户 hr_manager 登录系统</p>
              <p class="text-xs text-gray-400">2024-07-22 09:15:23</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
          <div class="flex items-center">
            <div class="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
            <div>
              <p class="text-sm text-white">上传文件: 合同文件_2024.pdf</p>
              <p class="text-xs text-gray-400">2024-07-22 08:45:12</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
          <div class="flex items-center">
            <div class="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
            <div>
              <p class="text-sm text-white">系统配置更新</p>
              <p class="text-xs text-gray-400">2024-07-21 16:30:45</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  PlusIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CogIcon,
  ServerIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline'
</script>