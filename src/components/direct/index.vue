<template>
  <div style="margin: 0 -20px 10px -20px;border-bottom: 1px solid gray;padding: 0 0 6px 20px;">
    <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
    <!--<el-breadcrumb-item v-for="(item,index) in direct" :key="index"> {{ item }}</el-breadcrumb-item>-->
    <!--</el-breadcrumb>-->
    <div class="c-breadcrumb">
      <div class="c-breadcrumb-item">首页&nbsp;>&nbsp;</div>
      <div class="c-breadcrumb-item" v-for="(item,index) in direct" :key="index">
        <span @click="jump(index)">{{ item }}</span>
        <span v-if="index < direct.length -1">&nbsp;>&nbsp;</span>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
//  import direct from '@/components/aside/menuList';
  export default {
    name: 'myDirect',
    data(){
      return {
//        direct: direct
      }
    },
    computed:mapGetters(['direct']),
    methods: {
      jump(index){
        if (index >= 1) {
          this.$router.go(  - index)
        }
      }
    },
  }
</script>
<style lang="scss">
  .c-breadcrumb {
    display: flex;
    font-size: 14px;
    .c-breadcrumb-item {
      &:not(:last-child) {
        font-weight: bold;
        span:first-child {
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }

</style>
