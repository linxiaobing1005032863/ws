<template>
  <div class="c-page">
    <Header></Header>
    <el-container class="c-container">
      <my-aside></my-aside>
      <router-view/>
    </el-container>
  </div>
</template>
<script>
  import Header from '@/components/header/header';
  import myAside from '@/components/aside/Aside';
  export default {
    components:{Header,myAside},
    data(){
      return {
        msg: 'hello'
      }
    },
    beforeCreate(){
      //获取菜单权限
      console.log('_res beforeCreate')
      //若store beforeRouterPath 不为空
      //有模块权限则跳转 无则跳转主页home/提示url错误/提示404
    },
  }
</script>
<style lang="scss">
  @import "../../style/mixins";
  .c-page {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    min-width: 1000px;
    height: 100%;
    @include optimizationScroll;
  }
  .c-container{
    height: calc(100% - 40px);
    margin-top: 40px;
  }
</style>
