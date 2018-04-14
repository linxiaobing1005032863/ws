<template>
    <el-aside class="c-aside" style="background-color: rgb(238, 241, 246)" width="auto">

        <div class="c-settingMenu" @click="change()">三</div>

        <el-menu width="200px" v-if="asideData.length" :collapse="isCollapse" background-color="#4a5064" text-color="#fff" :default-active="$route.path" active-text-color="#409EFF">
            <el-submenu  v-for="(itemNemu,index) in asideData" :index="itemNemu.id" v-bind:key="index">
            <template slot="title"><i class="iconfont " :class="itemNemu.icon">&nbsp;</i><span slot="title" class="c-aside-title">{{ itemNemu.name }}</span></template>
            <el-menu-item class="test" v-for="(itemGroup) in itemNemu.group" v-bind:key="itemGroup.key" v-if="itemGroup.show == '1'" :index="itemGroup.link" @click="alink(itemGroup)">{{ itemGroup.name  }}</el-menu-item>
            </el-submenu>
        </el-menu>
    </el-aside>
</template>
<script>
import { mapGetters } from "vuex";

export default {
    name:'myAside',
    data: () => {
        return {
            isCollapse: false
        }
    },
    computed: mapGetters(['asideData']),
    methods:{
        alink(item) {
            this.$router.push({ path: item.link });
        },
        change() {
            this.isCollapse = !this.isCollapse;
        }
    }
}
</script>

<style scoped lang="scss">
  @import "../../style/mixins";
    .el-aside {
      height: 100%;
      color: #333;
      @include optimizationScroll;
      .el-menu {
        min-height: calc(100% - 41px);
      }
    }
    .c-settingMenu {
        height: 41px;
        background-color: #4a5064;
        color: #aeb9c2;
        line-height: 35px;
        text-align: center;
        cursor: pointer;
        margin-right: 1px;
        border-bottom: 0.2px solid #312525;
    }
    .c-aside-title {
      color: #909399;
    }
</style>
