import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'DashboardHome',
        component: () => import('@/views/Dashboard.vue')
      },
      // 文件管理模块
      {
        path: '/files',
        name: 'FileManagement',
        component: () => import('@/views/files/FileManagement.vue')
      },
      {
        path: '/files/upload',
        name: 'FileUpload',
        component: () => import('@/views/files/FileUpload.vue')
      },
      // 费用分摊模块
      {
        path: '/expense',
        name: 'ExpenseAllocation',
        component: () => import('@/views/expense/ExpenseAllocation.vue')
      },
      // 电费核算模块
      {
        path: '/electricity',
        name: 'ElectricityBilling',
        component: () => import('@/views/electricity/ElectricityBilling.vue')
      },
      // 车队管理模块
      {
        path: '/fleet',
        name: 'FleetManagement',
        component: () => import('@/views/fleet/FleetManagement.vue')
      },
      // 系统管理模块
      {
        path: '/system',
        name: 'SystemManagement',
        component: () => import('@/views/system/SystemManagement.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router