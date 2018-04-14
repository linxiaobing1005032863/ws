<template>
  <el-main>
    <my-direct></my-direct>
    <div class="page-list">
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item>
            <el-select
              v-model="form.projectName"
              filterable
              remote
              clearable
              size="small"
              default-first-option
              placeholder="全部项目"
              :remote-method="projectSearchAsync"
              :loading="selectLoading">
              <el-option
                v-for="item in projectOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
          <el-select
            v-model="form.buildName"
            filterable
            remote
            clearable
            size="small"
            default-first-option
            placeholder="楼栋"
            :remote-method="buildSearchAsync"
            :loading="selectLoading">
            <el-option
              v-for="item in buildOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.status" size="small" placeholder="全部状态"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.faultDescription" size="small" placeholder="全部召修原因"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.id" size="small" placeholder="维修单号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="time"
              size="small"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="find">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="c-process">
          <el-button type="primary" size="small">导出</el-button>
        </div>
      </div>
      <el-table :data="list" style="width: 100%" v-loading="loading":row-class-name="tableRowClassName">
        <el-table-column label="召修单号" :show-overflow-tooltip="true" width="230" align="center">
          <template slot-scope="scope">
            <span @click="openComponent('detail',scope.row)">{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{scope.row.houseName}}</template>
        </el-table-column>

        <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.buildName }}</template>
        </el-table-column>

        <el-table-column label="电梯名称" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.elevatorName }}</template>
        </el-table-column>

        <el-table-column label="召修原因" :show-overflow-tooltip="true" align="center" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.faultType === 0">困人</span>
            <span v-if="scope.row.faultType === 1">单梯停梯</span>
            <span v-if="scope.row.faultType === 2">不能启动</span>
            <span v-if="scope.row.faultType === 3">普通维修</span>
          </template>
        </el-table-column>

        <el-table-column label="召修时间" :show-overflow-tooltip="true" align="center" width="160">
          <template slot-scope="scope">{{ scope.row.createTime | time('yyyy-MM-dd HH:mm:ss') }}</template>
        </el-table-column>

        <el-table-column label="状态" :show-overflow-tooltip="true" align="center" width="140">
          <template slot-scope="scope">
            {{scope.row.status}}
          </template>
        </el-table-column>

        <el-table-column label="维保工" :show-overflow-tooltip="true" align="center" width="170">
          <template slot-scope="scope">{{scope.row.dealWithUserName }}</template>
        </el-table-column>

        <el-table-column label="物业签字" :show-overflow-tooltip="true" align="center" width="80">
          <template slot-scope="scope">{{scope.row.customerSign}}</template>
        </el-table-column>

        <el-table-column label="已耗时(分)" :show-overflow-tooltip="true" align="center" width="120">
          <template slot-scope="scope">{{scope.row.consumeTime}}</template>
        </el-table-column>

        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="openComponent('dispatch',scope.row)">派工</el-button>
            <!--<el-button type="primary" size="small">停梯报告</el-button>-->
            <!--<el-button type="primary" size="small">维修报告</el-button>-->
            <el-button type="primary" size="small" @click="openWorkTrack('workTrackDialog')">工作轨迹</el-button>
            <!--<el-button type="primary" size="small">配件确认单</el-button>-->
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
    <detail ref="detail"></detail>
    <dispatch ref="dispatch" @onload="find"></dispatch>
    <el-dialog
      title="工作轨迹"
      width="700px"
      :visible.sync="workTrackDialog">
      <my-map ref="map" :disabled="true"></my-map>
    </el-dialog>
  </el-main>
</template>
<script>
  import {repairHttpUrl as httpUrl} from '../jobMangerUrl';
  import myDirect from '@/components/direct';
  import detail from './detail';
  import dispatch from './dispatch';
  import map from '@/components/map';
  export default {
    name: 'repairManage',
    components: {myDirect,detail,dispatch,'my-map':map},
    data(){
      return {
        list: [],
        time:null,
        form: {
          faultDescription : null,//召修原因
          projectName:null,//项目名称
          buildName:null,//楼栋名称
          id:null,//维修单号
          status:null,//状态
          startTime:null,
          endTime:null,
        },
        currentPage: 1,//当前页码
        total: 1,//总数
        size: 10,//总页数
        loading: false,//列表加载loading

        searchTimer:null,
        projectOption:[],
        buildOption:[],
        selectLoading:false,
        consumeTimer:null,

        workTrackDialog:false,
      }
    },
    methods: {
      projectSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchProject,{
            houseName:queryString,
            page:1,
            size:10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.forEach(val => {
                this.projectOption.push({label:val.projectName,value:val.id,})
              });
            }
            this.selectLoading = false;
          });
          this.selectLoading = false;
          this.searchTimer = null;
        }, 500);
      },
      buildSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchBuild,{
            buildName:queryString,
            page:1,
            size:10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.forEach(val => {
                this.buildOption.push({label:val.name,value:val.id,})
              });
            }
            this.selectLoading = false;
          });
          this.selectLoading = false;
          this.searchTimer = null;
        }, 500);
      },
      find(){
        if (this.time) {
          this.form.startTime = this.time[0];
          this.form.endTime = this.time[1];
        } else {
          this.form.startTime = null;
          this.form.endTime = null;
        }
        this.get();
      },
      get(){
        clearInterval(this.consumeTimer);
        this.consumeTimer = null;
        this.loading = true;
        this.$xttp.post(httpUrl.list,Object.assign({
          page:1,
          size:10,
        },this.form)).then(res=>{
          if(!res['errorCode']) {
            this.list = res.data['records'];
            this.list.map(val => this.$set(val,'consumeTime',parseInt( (new Date().getTime() - val.createTime) / 60000 )))
            this.total = res.data['total'];
            this.consumeTime();
          }
          this.loading = false;
        }).catch(err => this.loading = false);
      },
      listPageChange(currentPage){
        this.currentPage = currentPage;
        this.get()
      },
      consumeTime(){
        this.consumeTimer = setInterval(()=>{
          this.list.map(val => val.consumeTime = parseInt( (new Date().getTime() - val.createTime)/ 60000))
        },60000);
      },
      openComponent(name,row){
        this.$refs[name].$emit('show',{info:row})
      },
      tableRowClassName({row, rowIndex}){
        if (row.status === 0) {
          return 'warning-row';
        }
        return '';
      },
      openWorkTrack(name,row){
        //那row 接单人的userId
        //获取userId的用户位置
        this[name] = true;
        this.$nextTick(()=>{
          this.$refs.map.$emit('mapInit',{
            type:'track',
//              initAddress:[['113.314179','23.119847'],['113.316014','23.119891'],['113.318487','23.120656'],['113.320493','23.120966'],['113.32118','23.12185']]
            initAddress:[['113.314179','23.119847'],['113.316014','23.119891'],['113.318487','23.120656'],['113.320493','23.120966'],['113.32118','23.12185']]
          })
        })
      },
      getUserLocation(row){
        this.$xttp.post(httpUrl.getUserLocation,{
          userName:null,
          queryStartTime:null,
          queryEndTime:null,
        }).then(res=>{

        })
      }
    },
    mounted(){
      this.get();
    },
    destroyed(){
      clearInterval(this.consumeTimer);
      this.consumeTimer = null;
    },
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
