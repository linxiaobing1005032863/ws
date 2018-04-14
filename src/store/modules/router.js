export default {
  state:{
    beforeRouterPath:'/'
  },
  mutations:{
    UPDATE_BEFORE_ROUTERPATH(state, newValue){
      state.beforeRouterPath = newValue
    }
  },
}
