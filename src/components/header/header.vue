<template>
  <div class="c-header">
    <div>
      <a href="" class="c-logo">电梯物联网平台</a>
      <ul class="c-navgator">
        <li>
          <span class="c-account">
            用户 |
            <span class="el-dropdown-link">
              <i class="iconfont icon-user c-sidebar-conl">&nbsp;</i>
              管理员
            </span>
          </span>
          </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
  export default {
    name: 'Header',
    data() {
      return {
        activeIndex: '0',
      }
    },
    mounted() {},
    created() {

    },
    methods: {
      logout() {
        this.$router.push('/auth/logout');
      },
      handleCommand(command) {

      }
    }
  }
</script>

<style scoped lang="scss">
  $headerBg:#23262b;
  $fontColor:#fff;
  $headerH: 40px;
  .c-header {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
    width: 100%;
    height: $headerH;
    border-bottom: 1px solid hsla(0, 0%, 100%, .15);
    background: $headerBg;
    .c-logo {
      float: left;
      width:168px;
      margin-top: 10px;
      margin-left: 20px;
      color:$fontColor;
    }
    .c-account {
      color: #fff;
    }
    .c-navgator {
      position: absolute;
      right: 0px;
      z-index: 100;
      font-size: 14px;
      li {
        float: left;
        height: $headerH;
        line-height:$headerH;
        color: $fontColor;
        margin-right:7px;
      }
    }
    .c-sidebar-conl {
      color:white;
    }
  }
</style>
