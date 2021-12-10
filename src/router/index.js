import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/users/user.vue'
import Right from '../components/power/Right.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/add.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: login },
    {
        path: '/home',
        component: home,
        redirect: '/welcome',
        children: [{
            path: '/welcome',
            component: welcome
        }, {
            path: '/users',
            component: users
        }, {
            path: '/rights',
            component: Right
        }, {
            path: '/roles',
            component: Roles
        }, {
            path: '/categories',
            component: Cate

        }, {
            path: '/params',
            component: Params
        }, {
            path: '/goods',
            component: List
        }, {
            path: '/goods/add',
            component: Add
        }]
    }


]

const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router