import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: 'S PROMAX PLAST — Bosh sahifa' }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/ProductsView.vue'),
    meta: { title: 'Mahsulotlar — S PROMAX PLAST' }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: { title: 'Mahsulot — S PROMAX PLAST' }
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/views/NewsView.vue'),
    meta: { title: 'Yangiliklar — S PROMAX PLAST' }
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/views/NewsDetailView.vue'),
    meta: { title: 'Yangilik — S PROMAX PLAST' }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'Biz haqimizda — S PROMAX PLAST' }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Kontakt — S PROMAX PLAST' }
  },
  {
    // Noto'g'ri URL — bosh sahifaga qaytarish
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Sahifa o'zgarganda yuqoriga qaytish
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  }
})

// Har bir sahifa o'zgarganda title yangilansin
router.afterEach((to) => {
  document.title = to.meta.title || 'S PROMAX PLAST'
})

export default router
