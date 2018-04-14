import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
import data from './modules/data'
import router from './modules/router'

Vue.use(Vuex);
const getters = {
  token: state => state.permission.userInfo ? state.permission.userInfo.token : null,
  uid: state => state.permission.userInfo ? state.permission.userInfo.id : null,
  userInfo: state => state.permission.userInfo ? state.permission.userInfo.id : null,
  asideData: state => state.data.asideData ,//侧边栏数据
  direct: state => state.data.direct, //显示导航数据
  beforeRouterPath: state => state.router.beforeRouterPath,//上一模块路由路径
}
export default new Vuex.Store({
  modules: {
    permission,
    data,
    router,
  },
  getters,
})
