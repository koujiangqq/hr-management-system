<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
          <BuildingOfficeIcon class="h-8 w-8 text-white" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-white">
          行政人事管理系统
        </h2>
        <p class="mt-2 text-center text-sm text-gray-400">
          请登录您的账户
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="sr-only">用户名</label>
            <div class="relative">
              <UserIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="username"
                v-model="loginForm.username"
                name="username"
                type="text"
                required
                class="input-field pl-10 w-full"
                placeholder="用户名"
              />
            </div>
          </div>
          
          <div>
            <label for="password" class="sr-only">密码</label>
            <div class="relative">
              <LockClosedIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="password"
                v-model="loginForm.password"
                name="password"
                type="password"
                required
                class="input-field pl-10 w-full"
                placeholder="密码"
              />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="loginForm.remember"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-700 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-300">
              记住我
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-400 hover:text-blue-300">
              忘记密码？
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <ArrowPathIcon class="h-5 w-5 text-blue-300 animate-spin" />
            </span>
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </div>

        <div v-if="error" class="text-red-400 text-sm text-center">
          {{ error }}
        </div>
      </form>
      
      <div class="text-center">
        <p class="text-xs text-gray-500">
          © 2024 行政人事管理系统. 保留所有权利.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  BuildingOfficeIcon,
  UserIcon,
  LockClosedIcon,
  ArrowPathIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const loading = ref(false)
const error = ref('')

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    error.value = '请输入用户名和密码'
    return
  }

  loading.value = true
  error.value = ''

  try {
    // 模拟登录API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 简单的登录验证（实际应该调用后端API）
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      // 保存登录状态
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('username', loginForm.username)
      
      // 跳转到仪表盘
      router.push('/dashboard')
    } else {
      error.value = '用户名或密码错误'
    }
  } catch (err) {
    error.value = '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>