import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store';
import basis from './modules/basis';
import jobmangement from './modules/jobmangement'
import unioncenter from './modules/unioncenter'
import warehousemangement from './modules/mountingsmanger'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    //主页
    {
      path: '/home',
      name: 'home',
      component: (resolve) => require(["@/page/home/_res"], resolve),
      children:[
        ...basis,...jobmangement,...unioncenter,...warehousemangement
      ]
    },
    { path: '/auth/login', name: 'login', component: (resolve) => require(["@/page/auth/login"], resolve) },
    { path: '/auth/logout', component: (resolve) => require(["@/page/auth/logout"], resolve) },
    ]
})
router.beforeEach((to, from, next) => {
  //判断是否登录且非跳转登录模块
  if (!store.getters.token && to.name !== 'login' && from.name !== 'login') {
    store.commit('UPDATE_BEFORE_ROUTERPATH',to.path);
    console.log(to.path);
    console.log('进入登录模块');
    next({name:'login'});
    return false;
  }
  //检查菜单权限接口是否返回 否则记录模块路径 不进行跳转
  //检查模块权限 无权限则跳转主页
  store.dispatch('updateDirect',to.path);
  next();
})
export default router;

