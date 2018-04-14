<template>
  <!--职工管理-->
  <el-main>
    <div class="con-wrap">
      <div class="list-wrap">
        <my-direct></my-direct>
        <div class="c-search">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item>
              <el-select
                v-model="form.workGroupId"
                filterable
                size="small"
                remote
                clearable
                reserve-keyword
                placeholder="班组"
                :remote-method="workGroupSearchAsync"
                :loading="selectLoading">
                <el-option
                  v-for="item in workGroupOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="form.houseName"
                filterable
                size="small"
                remote
                clearable
                reserve-keyword
                placeholder="服务项目"
                :remote-method="houseSearchAsync"
                :loading="selectLoading">
                <el-option
                  v-for="item in houseOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select
                v-model="form.positionId"
                filterable
                remote
                size="small"
                reserve-keyword
                placeholder="岗位"
                clearable
                :remote-method="positionSearchAsync"
                :loading="selectLoading">
                <el-option
                  v-for="item in positionOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchKeyword" size="small" clearable placeholder="姓名/手机号码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="small" @click="find">搜索</el-button>
            </el-form-item>
          </el-form>
          <div class="c-process">
            <el-button type="primary" size="small">导出</el-button>
            <el-button type="primary" size="small" @click="openPage({name:'employeeManageDetail',type:'add'})">新增</el-button>
          </div>
        </div>
        <el-table :data="list" style="width: 100%" v-loading="loading">
          <el-table-column label="姓名" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span @click="openPage({name:'employeeManageDetail',row:scope.row,type:'see'})">{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="手机号码" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{ scope.row.mobile }}</template>
          </el-table-column>

          <el-table-column label="性别" :show-overflow-tooltip="true" align="center" width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.sex === 1">男</span>
              <span v-if="scope.row.sex === 2">女</span>
            </template>
          </el-table-column>

          <el-table-column label="岗位" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{ scope.row.positionName }}</template>
          </el-table-column>

          <el-table-column label="所属班组" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">{{ scope.row.workGroupName }}</template>
          </el-table-column>

          <el-table-column label="当前服务项目" :show-overflow-tooltip="true" align="center" width="170">
            <template slot-scope="scope">{{ scope.row.houseName ? scope.row.houseName :'无' }}</template>
          </el-table-column>

          <el-table-column label="资质证件" :show-overflow-tooltip="true" align="center" width="130">
            <template slot-scope="scope"><span @click="openDialog('aptitudesDialog',scope.row)">{{ scope.row.aptitudes.length > 0 ? '已上传' : '未上传'  }}</span></template>
          </el-table-column>

          <el-table-column label="操作" width="200" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="openPage({name:'maintainPlan',row:scope.row})">保养路线</el-button>
              <el-button type="primary" size="small" @click="openDialog('addressDialog',scope.row)">查看位置</el-button>
              <!--<el-button type="primary" size="small">更多</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="size"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <router-view/>
    </div>
    <!--查看位置-->
    <el-dialog
      title="查看位置"
      width="700px"
      :visible.sync="addressDialog">
      <div class="addressDialog">
        <div>
          <span class="name">{{addressInfo.userName}}</span>
          <span>{{addressInfo.mobile}}</span>
        </div>
        <span v-if="addressInfo.address">地址：{{addressInfo.address}}附近</span>
        <my-map v-show="mapShow" ref="myMap" :disabled="true"  @update="mapUpdate"></my-map>
      </div>
    </el-dialog>
    <!--操作证-->
    <el-dialog
      title="操作证"
      width="700px"
      :visible.sync="aptitudesDialog">
      <el-carousel>
        <el-carousel-item v-for="item in aptitudes" :key="item">
          <img class="aptitude-img" :src="item" alt="">
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </el-main>
</template>
<script>
  import {employeeHttpUrl as httpUrl} from '../httpUrl';
  import {filterParams} from '../process';
  import {getUri as downLoad} from '@/utils/oss';
  import myDirect from '@/components/direct';
  import map from '@/components/map';
  import refresh from '@/mixins/refresh';
  export default {
    mixins:[refresh],
    name: 'employeeManage',
    components: {myDirect,'my-map':map},
    data(){
      return {
        detail:{},
        detailType:null,//add
        list: [],
        searchKeyword:null,
        form: {
          workGroupId:null,//班组
          houseName:null,//项目
          positionId:null,//岗位
          userName:null,//姓名
          mobile:null,//手机号码
        },
        workGroupOption:[],
        houseOption:[],
        positionOption:[],

        currentPage: 1,//当前页码
        total: 1,//总数
        size: 10,//总页数
        loading: false,//列表加载loading

        searchTimer:null,
        selectLoading:false,

        addressDialog:false,
        addressList:[],
        addressInfo:{},
        mapShow:false,

        aptitudesDialog:false,
        aptitudes:[]
      }
    },
    methods: {
      openPage({name = 'employeeManageDetail',row = null,type = null}){
        this.$router.push({
          name:name,
          query:Object.assign({},type ? {'type' : type} :{},row ? {'id' : row.id}:{})
        });
      },
      /**
       * @description 查找
       */
      find(){
        if(new RegExp(/^\d+$/).test(this.searchKeyword)) {
          if(!new RegExp(/^1[3-9]{1}[0-9]{9}$/).test(this.searchKeyword)){
            this.$message.warning('请输入正确的手机号码');
            return false;
          }
          this.form.mobile = this.searchKeyword;
          this.form.userName = null;
        } else {
          this.form.userName = this.searchKeyword;
          this.form.mobile = null;
        }
        this.currentPage = 1;
        this.get();
      },
      /**
       * @description 换页
       * @param currentPage
       */
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.get();
      },
      handleClose(){
        this.examineDialog = false;
      },
      workGroupSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchWorkGroup,{
            groupName:queryString,
            page:1,
            size:10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.map(val => this.workGroupOption.push({label:val.groupName,value:val.id,}));
            }
            this.selectLoading = false;
          })
        }, 500);
      },
      houseSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchHouse,{
            houseName:queryString,
            page:1,
            size:10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.map(val => this.houseOption.push({label:val.projectName,value:val.id,}));
            }
            this.selectLoading = false;
          })
        }, 500);
      },
      positionSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchPosition,{
            houseName:queryString,
            page:1,
            size:10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.map(val => this.positionOption.push({label:val.name,value:val.id,}));
            }
            this.selectLoading = false;
          })
        }, 500);
      },
      get(){
        this.loading = true;
        this.$xttp.post(httpUrl.list,Object.assign({
          page:this.currentPage,
          size:this.size,
        },filterParams(this.form))).then(res=>{
          if (!res['errorCode']) {
            this.list = res['data'].records;
            this.total = res['data'].total;
          }
          this.loading = false;
        }).catch(err => this.loading = false);
      },
      openDialog(name,row){
        if (name === 'addressDialog') {
          this.mapShow = false;
          this.addressInfo = JSON.parse(JSON.stringify(row));
          this.$xttp.post(httpUrl.getUserLocation,{
              userId:row.userId
            }).then(res => {
              if(!res.errorCode) {
                this.addressList = res.data['records'];
                if (res.data['records'].length > 0) {
                  this.mapShow = true;
                  this.$nextTick(()=>{
                    this.$refs.myMap.$emit('mapInit',{
                      initAddress:  this.addressList[this.addressList.length - 1].location
                    });
                  })
                }
              }
            })
        } else if (name === 'aptitudesDialog') {
          //获取图片的url
          row.aptitudes.map(val => {
            this.aptitudes.push(downLoad(val));
          })
        }
        this[name] = true;
      },
      closeDialog(name){
        this[name] = false;
      },
      handleDirectClick(){
        this.$refs.detail.$emit('hide');
        this.$refs.workGroup.$emit('hide');
      },
      mapUpdate(val){
        this.$set(this.addressInfo,'address',`${val.province}${val.city}${val.district}${val.formattedAddress}`)
      },
      handleRefresh(){
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
  .addressDialog {
    line-height: 34px;
    .name {
      font-size: 18px;
      font-weight: bold;
    }
  }
  .aptitude-img {
    width: 700px;
    height: 300px;
  }
  #container {
    width: 80%;
    height: 250px;
    margin: 20px auto;
  }
</style>
