import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import WatchlistView from '../views/WatchlistView.vue'
import ReviewsView from '@/views/ReviewsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/watchlist',
      name: 'watchlist',
      component: WatchlistView,
    },
    {
      path: '/reviews/:movieId',
      name: 'reviews',
      component: ReviewsView,
    }
  ],
})

export default router
