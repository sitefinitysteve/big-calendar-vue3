import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/month-view' },
    {
      path: '/',
      component: () => import('@/layouts/CalendarLayout.vue'),
      children: [
        { path: 'month-view', name: 'month', component: () => import('@/pages/MonthView.vue') },
        { path: 'week-view', name: 'week', component: () => import('@/pages/WeekView.vue') },
        { path: 'day-view', name: 'day', component: () => import('@/pages/DayView.vue') },
        { path: 'year-view', name: 'year', component: () => import('@/pages/YearView.vue') },
        { path: 'agenda-view', name: 'agenda', component: () => import('@/pages/AgendaView.vue') },
      ],
    },
  ],
})

export default router
