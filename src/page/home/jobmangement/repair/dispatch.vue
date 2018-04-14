<template>
  <el-dialog
    title="详情"
    class="page-repair-dispatch"
    :width="width"
    :visible.sync="show">
    <div class="con-wrap">
      <div class="left-wrap">
        <div>
          <el-row>
            <el-col :span="6">项目名称：</el-col>
            <el-col :span="12">{{info.projectName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">楼栋：</el-col>
            <el-col :span="12">{{info.buildName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">电梯：</el-col>
            <el-col :span="12">{{info.elevatorName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">召修原因：</el-col>
            <el-col :span="12">{{info.faultDescription}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">故障代码：</el-col>
            <el-col :span="12">{{info.faultCode}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">召修时间：</el-col>
            <el-col :span="12">{{info.createTime | time('yyyy-MM-dd HH:mm:ss')}}</el-col>
          </el-row>
        </div>
        <div class="workGroup-block" v-if="nearbyWorkList.length > 0">
          <div class="tit">附近的班组</div>
          <div v-for="item in nearbyWorkList">
            {{item.teamName}}<el-radio v-model="nearWorkTeamId" :label="item.workTeamId" @change="nearWorkGroupChange">选择</el-radio>
          </div>
        </div>
        <el-button class="search-btn" size="small" @click="openSearch">搜索班组</el-button>
      </div>
      <div class="right-wrap" v-if="searchShow">
        <el-form label-width="100px">
          <el-form-item class="flex" label="搜索班组">
            <el-input size="small" v-model="keyword" @change="workGroupSearchAsync">
              <el-button slot="append" icon="el-icon-search" @click="workGroupSearchAsync"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <div class="workGroup-block">
          <i class="el-icon-loading" v-if="searchLoading"></i>
          <p v-if="searchNoData" class="noData">无此班组</p>
          <div v-for="item in workList">
            {{item.teamName}}<el-radio v-model="workTeamId" :label="item.teamId" @change="workGroupChange">选择</el-radio>
          </div>
        </div>
      </div>
    </div>
    <el-button type="primary" size="small" @click="save">确认</el-button>
  </el-dialog>
</template>
<script>
  import {repairHttpUrl as httpUrl} from '../jobMangerUrl'
  export default {
    data(){
      return {
        show: false,
        info:{
          projectName:null,//项目名称
          buildName:null,//楼栋名称
          elevatorName:null,//电梯名称
          faultDescription:null,//召修原因
          faultCode:null,//故障代码
          createTime:null,//召修时间
        },

        nearWorkTeamId:null,
        workTeamId:null,

        searchShow:false,//搜索框显示状态
        searchLoading:false,//搜索列表loading
        searchNoData:false,//是否无数据
        form:{
          id:null,//申报ID
          workTeamId:null,//工班班组id
        },
        keyword:null,//搜索关键字
        workList:[],//班组列表

        nearbyWorkList:[],//附近班组列表
      }
    },
    computed:{
      width(){
        return this.searchShow ? '900px' : '500px'
      }
    },
    methods:{
      openSearch(){
        this.searchShow = !this.searchShow;
        if (!this.searchShow) {
          this.keyword = null;
          this.workList = [];
        }
      },
      workGroupSearchAsync(){
        this.searchNoData = false;
        this.workList = [];
        if (!this.keyword || this.keyword.trim() === '') {
          return false;
        }
        this.searchLoading = true;
        this.$xttp.post(httpUrl.searchWorkGroup,{
          groupName:this.keyword,
          page:1,
          size:10,
        }).then(res => {
          if (!res['errorCode']) {
            if (res['data'].records.length === 0) this.searchNoData = true;
            this.workList = res['data'].records;
          }
          this.searchLoading = false;
        }).catch(err => this.searchLoading = false)
      },
      save(){
        if (!this.form.workTeamId) {
          this.$message.warning('请选择班组');
          return false;
        }
        this.$xttp.post(httpUrl.dispatch,this.form)
          .then(res=>{
          if(!res['errorCode']){
            this.$message.success('派工成功');
            this.show = false;
            this.$emit('onload');
          }
        })

      },
      getNearbyWorkGroup(){
        this.$xttp.post(httpUrl.nearWorkGroup,{
          location:this.info.location
        }).then(res => {
            if (!res['errorCode']) {
              this.nearbyWorkList = res['data'];
            }
          })
      },
      nearWorkGroupChange(val){
        this.workTeamId = null;
        this.form.workTeamId = val;
      },
      workGroupChange(val){
        this.nearWorkTeamId = null;
        this.form.workTeamId = val;
      }
    },
    mounted(){
      this.$on('show',op => {
        //初始化
        this.info = op.info;
        this.searchShow = false;
        this.searchNoData = false;
        this.searchLoading = false;
        this.keyword = null;
        this.workList = [];
        this.form = {
          id:op.info.id,
          workTeamId:null,
        }
        this.getNearbyWorkGroup();
        this.show = true;
      });
      this.$on('hide',()=> {
        if (this.show) this.show = false;
      })
    },
  }
</script>
<style lang="scss" scope>
  .page-repair-dispatch {
    .con-wrap {
      padding-bottom: 20px;
      display: flex;
      .left-wrap {
        min-width: 400px;
      }
      .right-wrap {
        min-width: 400px;
      }
      .workGroup-block {
        margin: 20px 0;
        position: relative;
        i {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%);
        }
        .noData {
          text-align: center;
        }
        .tit {
          font-weight: bold;
          line-height: 36px;
          border-bottom: 1px solid #eee;
        }
        & > div {
          padding: 0 20px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #eee;
        }
      }
      .search-btn {
        float: right;
      }
    }
  }
</style>
<style lang="scss">
  .page-repair-dispatch {
    .el-dialog {
      transition: all .25s cubic-bezier(.4, 0, .2, 1);
    }
    .el-form-item {
      &.flex {
        .el-form-item__content {
          display: flex;
        }
      }
      .el-button--text {
        margin-left: 10px;
      }
    }
  }
</style>
