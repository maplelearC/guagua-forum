import { createRouter, createWebHashHistory } from 'vue-router'


const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes: [
        {
            // 访问根路径重定向到/home
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/Login.vue')
        },
        {
            path: '/home',
            name: 'home',
            component: () => import('../views/Home.vue')
        },
        {
            path: '/science',
            name: 'science',
            component: () => import('../views/Science.vue')
        },
        {
            path: '/live',
            name: 'live',
            component: () => import('../views/Live.vue')
        },
        {
            path: '/help',
            name: 'help',
            component: () => import('../views/Help.vue')
        },
        {
            path: '/activation',
            name: 'activation',
            component: () => import('../views/Activation.vue')
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/Profile.vue')
        },
        {
            path: '/follow',
            name: 'follow',
            component: () => import('../views/Follow.vue')
        },
        {
            path: '/message',
            name: 'message',
            component: () => import('../views/Message.vue'),
        },
        {
            path: '/discuss-detail',
            name: 'discuss-detail',
            component: () => import('../views/Discuss-detail.vue')
        }, 
        {
          path: '/setting',
          name: 'setting',
          component: () => import('../views/Setting.vue')
      },
      {
        path: '/letter-detail',
        name: 'letter-detail',
        component: () => import('../views/Letter-detail.vue')
       },
       {
        path: '/notice-detail',
        name: 'notice-detail',
        component: () => import('../views/Notice-detail.vue')
       }
    ]
})

export default router
