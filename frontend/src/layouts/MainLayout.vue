<template>
  <div class="flex h-screen bg-gray-900">
    <!-- 侧边栏 -->
    <div class="w-64 bg-gray-800 shadow-lg">
      <div class="p-6">
        <h1 class="text-xl font-bold text-white">行政人事管理系统</h1>
      </div>
      
      <nav class="mt-6">
        <div class="px-4 space-y-2">
          <router-link
            to="/dashboard"
            class="sidebar-item"
            :class="{ active: $route.path === '/dashboard' }"
          >
            <HomeIcon class="w-5 h-5 mr-3" />
            仪表盘
          </router-link>
          
          <router-link
            to="/files"
            class="sidebar-item"
            :class="{ active: $route.path.startsWith('/files') }"
          >
            <DocumentIcon class="w-5 h-5 mr-3" />
            文件管理
          </router-link>
          
          <router-link
            to="/expense"
            class="sidebar-item"
            :class="{ active: $route.path.startsWith('/expense') }"
          >
            <CurrencyDollarIcon class="w-5 h-5 mr-3" />
            费用分摊
          </router-link>
          
          <router-link
            to="/electricity"
            class="sidebar-item"
            :class="{ active: $route.path.startsWith('/electricity') }"
          >
            <BoltIcon class="w-5 h-5 mr-3" />
            电费核算
          </router-link>
          
          <router-link
            to="/fleet"
            class="sidebar-item"
            :class="{ active: $route.path.startsWith('/fleet') }"
          >
            <TruckIcon class="w-5 h-5 mr-3" />
            车队管理
          </router-link>
          
          <router-link
            to="/system"
            class="sidebar-item"
            :class="{ active: $route.path.startsWith('/system') }"
          >
            <CogIcon class="w-5 h-5 mr-3" />
            系统管理
          </router-link>
        </div>
      </nav>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部导航栏 -->
      <header class="bg-gray-800 shadow-sm border-b border-gray-700">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center space-x-4">
            <h2 class="text-lg font-semibold text-white">{{ pageTitle }}</h2>
          </div>
          
          <div class="flex items-center space-x-4">
            <button class="p-2 text-gray-400 hover:text-white">
              <BellIcon class="w-5 h-5" />
            </button>
            
            <div class="relative">
              <button class="flex items-center space-x-2 text-gray-300 hover:text-white">
                <UserIcon class="w-5 h-5" />
                <span>管理员</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="flex-1 overflow-y-auto bg-gray-900 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  HomeIcon,
  DocumentIcon,
  CurrencyDollarIcon,
  BoltIcon,
  TruckIcon,
  CogIcon,
  BellIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()

const pageTitle = computed(() => {
  const titleMap: Record<string, string> = {
    '/dashboard': '仪表盘',
    '/files': '文件管理',
    '/expense': '费用分摊',
    '/electricity': '电费核算',
    '/fleet': '车队管理',
    '/system': '系统管理'
  }
  
  for (const [path, title] of Object.entries(titleMap)) {
    if (route.path.startsWith(path)) {
      return title
    }
  }
  
  return '行政人事管理系统'
})
</script>