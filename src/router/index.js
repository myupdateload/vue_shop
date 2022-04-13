import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/components/login'
import home from '@/components/home'
import Welcome from '@/components/Welcome'
import users from '@/components/user/users'
import rights from '@/components/power/rights'
import roles from '@/components/power/roles'
import cate from '@/components/good/cate'
import list from '@/components/good/list'
import add from '@/components/good/add'
import order from '@/components/order/order'
import report from '@/components/report/report'
import params from '@/components/good/params'
import categories from '@/components/good/categories'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect:'/login'
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      component: home,
      redirect:'/Welcome',
      children:[{path: '/Welcome',component: Welcome},
                {path: '/users',component: users},
                {path: '/rights',component: rights},
                {path: '/roles',component: roles},
                {path: '/goods',component: list},
                {path: '/good/add',component: add},
                {path: '/orders',component: order},
                {path: '/reports',component: report},
                {path: '/params',component: params},
                {path: '/categories',component: categories}]
    }
  ]
})

//路由导航实现网站的未登录强制下线
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next()
  const tokenstr=window.sessionStorage.getItem('token')
  if(!tokenstr) return next('/login')
  next()
})

export default router