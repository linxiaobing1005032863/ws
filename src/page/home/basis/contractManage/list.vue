<template>
  <el-main>
    <div class="con-wrap">
      <my-direct></my-direct>
      <div class="list-wrap">
        <div class="c-search">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item>
              <el-select
                v-model="form.propertyCompanyName"
                size="small"
                filterable
                remote
                clearable
                reserve-keyword
                default-first-option
                placeholder="客户"
                :remote-method="userSearchAsync"
                :loading="selectLoading">
                <el-option
                  v-for="item in userOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="form.projectName"
                size="small"
                filterable
                remote
                clearable
                default-first-option
                placeholder="项目"
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
              <el-select v-model="form.paymentType" placeholder="付款方式" size="small">
                <el-option
                  v-for="item in payOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.contractType" placeholder="保养类型" size="small">
                <el-option
                  v-for="item in typeOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="form.expire" placeholder="到期类型" size="small">
                <el-option
                  v-for="item in expireOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.contractNum" size="small" placeholder="合同编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="find">查询</el-button>
            </el-form-item>
          </el-form>
          <div class="c-process">
            <el-button type="primary" size="small" @click="openAdd('add')">新增</el-button>
          </div>
        </div>
        <el-table :data="list" style="width: 100%" v-loading="loading">
          <el-table-column label="合同编号" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span @click="openAdd('see',scope.row)">{{scope.row.contractNum}}</span></template>
          </el-table-column>
          <el-table-column label="客户名称" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{scope.row.contractName}}</template>
          </el-table-column>

          <el-table-column label="保养类型" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.maintenanceMode === 1">半包</span>
              <span v-if="scope.row.maintenanceMode === 2">大包</span>
              <span v-if="scope.row.maintenanceMode === 3">清包</span>
            </template>
          </el-table-column>

          <el-table-column label="关联项目" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.projectNumber" @click="openDialog('projectDialog',scope.row)">{{scope.row.projectNumber}}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column label="付款方式" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.payType === 1">月付</span>
              <span v-if="scope.row.payType === 2">季度付</span>
              <span v-if="scope.row.payType === 3">半年付</span>
              <span v-if="scope.row.payType === 4">年付</span>
            </template>
          </el-table-column>

          <el-table-column label="维保负责人" :show-overflow-tooltip="true" align="center" width="170">
            <template slot-scope="scope">{{ scope.row.maintenanceUserName}}</template>
          </el-table-column>

          <el-table-column label="服务开始时间" :show-overflow-tooltip="true" align="center" width="170">
            <template slot-scope="scope">
              <span v-if="scope.row.startDate">{{scope.row.startDate | time}}</span>
            </template>
          </el-table-column>

          <el-table-column label="服务结束时间" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.endDate">{{scope.row.endDate | time}}</span>
            </template>
          </el-table-column>

          <el-table-column label="是否到期" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.endDate">{{scope.row.expire}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button @click="openAdd('see',scope.row)" type="primary" size="small">查看详情</el-button>
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
      <router-view/>
    </div>
    <el-dialog
      title="查看项目"
      width="80%"
      :visible.sync="projectDialog"
      :before-close="closeDialog('projectDialog')">
      <el-table :data="projectList" style="width: 100%" v-loading="projectLoading">
        <el-table-column label="项目名称" :show-overflow-tooltip="true" width="130" align="center">
          <template slot-scope="scope">{{ scope.row.houseName  }}</template>
        </el-table-column>
        <el-table-column label="电梯数" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.elevatorNumber  }}</template>
        </el-table-column>
        <el-table-column label="项目类型" :show-overflow-tooltip="true" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.typeName }}</template>
        </el-table-column>
        <el-table-column label="项目区域" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.province }}{{ scope.row.city }}{{ scope.row.area }}</template>
        </el-table-column>
        <el-table-column label="详细地址" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.address }}</template>
        </el-table-column>
        <el-table-column label="维保负责人" :show-overflow-tooltip="true" width="130" align="center">
          <template slot-scope="scope">{{ scope.row.principal.name }}</template>
        </el-table-column>
        <el-table-column label="开始日期" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.startDate | time}}</template>
        </el-table-column>
        <el-table-column label="结束日期" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.endDate }}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="projectListPageChange"
        :current-page="projectCurrentPage"
        :page-size="projectSize"
        layout="total, prev, pager, next, jumper"
        :total="projectTotal">
      </el-pagination>
    </el-dialog>
  </el-main>
</template>
<script>
  import {contractHttpUrl as httpUrl} from '../httpUrl';
  import {filterParams} from '../process';
  import myDirect from '@/components/direct';
  import refresh from '@/mixins/refresh';
  export default {
    name: 'contractManage',
    mixins:[refresh],
    components: {myDirect},
    data(){
      return {
        userOption:[],
        projectOption:[],
        typeOption:[
          {
            label:'全部保养类型',
            value:''
          },
          {
            label:'半包',
            value:1
          },
          {
            label:'大包',
            value:2
          },
          {
            label:'清包',
            value:3
          },
        ],//保养类型下拉数据
        payOption:[
          {
            label:'全部付款方式',
            value:''
          },
          {
            label:'月付',
            value:1,
          },
          {
            label:'季度付',
            value:2,
          },
          {
            label:'半年付',
            value:3,
          },
          {
            label:'年付',
            value:4,
          },
        ],//付款方式下拉数据
        expireOption:[
          {
            label:'全部到期类型',
            value:''
          },
          {
            label:'即将到期',
            value:1
          },
          {
            label:'未到期',
            value:2
          },
          {
            label:'到期',
            value:3
          },
        ],//到期类型下拉数据

        searchTimer:null,//检索下拉获取 定时器
        selectLoading:false,//select 下拉搜索loading

        list: [],
        form: {
          propertyCompanyId:null,//客户名称
          projectId:null,//项目名称
          paymentType:null,//付款方式
          contractType:null,//保养类型
          expire:null,//到期类型
          contractNum:null,//合同编号
        },
        currentPage: 1,//当前页码
        total: 1,//总数
        size: 10,//总页数
        loading: false,//列表加载loading

        projectId:null,
        projectList:[],
        projectDialog:false,//查看关联项目
        projectCurrentPage:1,
        projectTotal:1,
        projectSize:10,
        projectLoading:false,

      }
    },
    methods: {
      /**
       * @description 新增
       * @param type add/edit/see
       * @param row 行数据
       */
      openAdd(type,row){
        this.$router.push({
          name:'contractManageDetail',
          query:Object.assign({'type' : type},row ? {'id' : row.id}:{})
        })
      },
      openDialog(name,row){
        if (name === 'projectDialog') {
          this.projectId = row.id;
          this.getProjectList();
        }
        this[name] = true;
      },
      getProjectList(){
        this.projectLoading = true;
        this.$xttp.post(httpUrl.getProjectList,{
          contractId:this.projectId,
          page:this.projectCurrentPage,
          size:this.projectSize,
        }).then(res=>{
          if(!res['errorCode']) {
            this.projectList = res['data'].records;
            this.projectTotal = res['data'].total;
          }
          this.projectLoading = false;
        })
      },
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
      closeDialog(){
        this[name] = false;
      },
      /**
       * @description 获取列表数据
       */
      get(){
        this.loading = true;
        this.$xttp.post(httpUrl.list,Object.assign({
          page:this.currentPage,
          size:this.size,
        },filterParams(this.form))).then(res=>{
          if (!res['errorCode']) {
            let now = new Date().getTime();
            res['data'].records.map(val=>{
              val.expire = val.endDate < now ? '到期' : val.endDate - now  < 5270400000 ? '即将到期' : '未到期';
            })
            this.list = res['data'].records;
            this.total = res['data'].total;
          }
          this.loading = false
        }).catch(err=>this.loading = false)
      },
      /**
       * @description 检索 全部客户
       */
      userSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchCus,{
            name:queryString,
            page:1,
            size:10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.forEach(val => {
                this.userOption.push({label:val.name,value:val.id,})
              });
            }
            this.selectLoading = false;
          })
        }, 500);
      },
      /**
       * @description 检索项目名称
       * @param queryString
       * @returns {boolean}
       */
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
          })
          this.selectLoading = false;
        }, 500);
      },
      handleRefresh(){
        console.log('handleRefresh')
        this.get();
      }
    },
    mounted(){
      this.handleRefresh();
    }
  }
</script>
<style lang="scss" scoped>
  .c-search {
    position: relative;
    width: 100%;
    .c-process {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }
  .con-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .list-wrap {
      width: 100%;
      height: 100%;
    }
  }
</style>
