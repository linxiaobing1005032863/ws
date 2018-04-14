<template>
  <el-main>
    <my-direct></my-direct>
    <div class="page-list">
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="form.name" placeholder="客户名称" size="small"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="find">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="c-process">
          <el-button type="primary" size="small" @click="find">导出</el-button>
          <el-button type="primary" size="small" @click="openAdd('add')">新增</el-button>
        </div>
      </div>
      <el-table :data="list" style="width: 100%" v-loading="loading">
        <el-table-column label="客户名称" :show-overflow-tooltip="true" width="130" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="联系人" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.contactPersonName  }}</template>
        </el-table-column>

        <el-table-column label="联系方式" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.contactPersonPhone }}</template>
        </el-table-column>

        <el-table-column label="办公地址" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>

        <el-table-column label="认证状态" :show-overflow-tooltip="true" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.authState ? '已认证' : '未认证' }}</template>
        </el-table-column>

        <el-table-column label="相互关联" :show-overflow-tooltip="true" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.bindState === 0 ? '未绑定' : '已绑定'}}</template>
        </el-table-column>

        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="scope">
            <el-button @click="openAdd('see',scope.row)" type="primary" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="listPageChange"
        :current-page="currentPage"
        :page-size="size"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <detail ref="detail" @onload="find"></detail>
    <!--<el-dialog-->
      <!--title="查看项目"-->
      <!--width="80%"-->
      <!--:visible.sync="projectDialog"-->
      <!--:before-close="closeDialog('projectDialog')">-->
      <!--<el-table :data="projectList" style="width: 100%" v-loading="projectLoading">-->
        <!--<el-table-column label="项目名称" :show-overflow-tooltip="true" width="130" align="center">-->
          <!--<template slot-scope="scope">{{ scope.row.houseName  }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="电梯数" :show-overflow-tooltip="true" align="center">-->
          <!--<template slot-scope="scope">{{ scope.row.elevatorNumber  }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="项目类型" :show-overflow-tooltip="true" align="center" width="100">-->
          <!--<template slot-scope="scope">{{ scope.row.typeName }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="项目区域" :show-overflow-tooltip="true" align="center">-->
          <!--<template slot-scope="scope">{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="详细地址" :show-overflow-tooltip="true" align="center">-->
          <!--<template slot-scope="scope">{{ scope.row.address }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="维保负责人" :show-overflow-tooltip="true" width="130" align="center">-->
          <!--<template slot-scope="scope">{{ scope.row.principal.name }}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="开始日期" :show-overflow-tooltip="true" align="center">-->
          <!--<template slot-scope="scope">{{ scope.row.startDate | time}}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="结束日期" :show-overflow-tooltip="true" align="center">-->
          <!--<template slot-scope="scope">{{ scope.row.endDate }}</template>-->
        <!--</el-table-column>-->
      <!--</el-table>-->
      <!--<el-pagination-->
        <!--@current-change="projectListPageChange"-->
        <!--:current-page="projectCurrentPage"-->
        <!--:page-size="projectSize"-->
        <!--layout="total, prev, pager, next, jumper"-->
        <!--:total="projectTotal">-->
      <!--</el-pagination>-->
    <!--</el-dialog>-->
  </el-main>
</template>
<script>
  import {cusHttpUrl} from '../httpUrl';
  import {filterParams} from '../process';
  import myDirect from '@/components/direct';
  import detail from './detail';
  export default {
    name: 'cusManage',
    components: {myDirect,detail},
    data(){
      return {
        list: [],
        form: {
          name: ''
        },
        detail:{},
        currentPage: 1,//当前页码
        total: 1,//总数
        size: 10,//总页数
        loading: false,//列表加载loading

//        projectId:null,
//        projectList:[],
//        projectDialog:false,//查看关联项目
//        projectCurrentPage:1,
//        projectTotal:1,
//        projectSize:10,
//        projectLoading:false,

      }
    },
    methods: {
      /**
       * @description 打开 编辑/新增/查看
       */
      openAdd(type,row){
        this.$refs.detail.$emit('show',{
          type:type,
          info:row,
        })
      },
//      openDialog(name,row){
//        if (name === 'projectDialog') {
//          this.projectId = row.id;
//          this.getProjectList();
//        }
//        this[name] = true;
//      },
//      getProjectList(){
//        this.projectLoading = true;
//        this.$xttp.post(httpUrl.getProjectList,{
//          propId:this.projectId,
//          page:this.projectCurrentPage,
//          size:this.projectSize,
//        }).then(res=>{
//          if(!res['errorCode']) {
//            this.projectList = res['data'].records;
//            this.projectTotal = res['data'].total;
//          }
//          this.projectLoading = false;
//        })
//      },
      /**
       * @description 查找
       */
      find(){
        this.currentPage = 1;
        this.get();
      },
      /**
       * @description 换页
       * @param currentPage
       */
      listPageChange(currentPage){
        this.currentPage = currentPage;
        this.get();
      },
      projectListPageChange(currentPage){
        this.projectCurrentPage = currentPage;
        this.getProjectList();
      },
      /**
       * @description 关闭dialog
       */
//      closeDialog(name){
//        this[name] = false;
//      },
      /**
       * @description  获取列表数据
       * @param op http data
       */
      get(){
        this.loading = true;
        this.$xttp.post(cusHttpUrl.list,Object.assign({
          page:this.currentPage,
          size:this.size,
        },filterParams(this.form))).then(res=>{
          if (!res['errorCode']) {
            this.list = res['data'].records;
            this.total = res['data'].total;
          }
          this.loading = false;
        }).catch(err => this.loading = false)
      },
    },
    mounted(){
      this.get();
    }
  }
</script>
<style lang="scss" scoped>
  .c-search {
    position: relative;
    width: 100%;
    .c-process {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .page-list {
    width: 100%;
    height: 100%;
  }
</style>
