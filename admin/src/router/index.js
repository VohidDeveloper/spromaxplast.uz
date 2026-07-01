import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true, title: 'Kirish' }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true, title: 'Bosh sahifa' }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/ProductsView.vue'),
    meta: { requiresAuth: true, title: 'Mahsulotlar' }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/views/CategoriesView.vue'),
    meta: { requiresAuth: true, title: 'Kategoriyalar' }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/NewsView.vue'),
    meta: { requiresAuth: true, title: 'Yangiliklar' }
  },
  {
    path: '/certificates',
    name: 'Certificates',
    component: () => import('@/views/CertificatesView.vue'),
    meta: { requiresAuth: true, title: 'Sertifikatlar' }
  },
  {
    path: '/partners',
    name: 'Partners',
    component: () => import('@/views/PartnersView.vue'),
    meta: { requiresAuth: true, title: 'Hamkorlar' }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('@/views/MessagesView.vue'),
    meta: { requiresAuth: true, title: 'Xabarlar' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { requiresAuth: true, title: 'Sozlamalar' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, _from) => {
  const token = localStorage.getItem('admin_token')

  // Token yo'q va himoyalangan sahifaga ketayotgan bo'lsa
  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' }
  }

  // Token bor va /login ga ketayotgan bo'lsa
  if (to.meta.public && token) {
    return { name: 'Dashboard' }
  }
})

export default router
