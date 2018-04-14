<template>
  <!--保养计划-->
    <transition>
      <div class="page-maintain-plan">
        <myDirect/>
        <div class="maintainPlan-con-wrap">
          <div class="employee-info" v-if="detail">
            <p>维保公：{{detail.userName}}</p>
            <p>联系电话：{{detail.mobile}}</p>
            <p>所属班组：{{detail.workGroupName}}</p>
            <p>性别：{{detail.sex === 1 ? '男' : '女'}}</p>
            <p>当前位置: {{address}}</p>
          </div>
          <div class="maintainPlan-list-wrap">
            <div class="c-search">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                  <el-date-picker
                    v-model="startDate"
                    type="date"
                    size="small"
                    @change="dateChange"
                    value-format="timestamp"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-form>
            </div>
            <el-table :data="list" style="width: 100%" v-loading="loading">
              <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center">
                <template slot-scope="scope">{{ scope.row.projectName }}</template>
              </el-table-column>
              <el-table-column label="梯号" :show-overflow-tooltip="true" align="center">
                <template slot-scope="scope">{{scope.row.elevatorNum}}</template>
              </el-table-column>

              <el-table-column label="注册代码" :show-overflow-tooltip="true" align="center" width="100">
                <template slot-scope="scope">{{scope.row.registerCode}}</template>
              </el-table-column>

              <el-table-column label="位置" :show-overflow-tooltip="true" align="center" width="100">
                <template slot-scope="scope">？</template>
              </el-table-column>

              <el-table-column label="保养类型" :show-overflow-tooltip="true" align="center" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.maintenanceType === 1">普通保养</span>
                  <span v-if="scope.row.maintenanceType === 2">年检</span>
                </template>
              </el-table-column>

              <el-table-column label="状态" :show-overflow-tooltip="true" align="center" width="100">
                <template slot-scope="scope">？</template>
              </el-table-column>

            </el-table>
          </div>
        </div>
      </div>
    </transition>
</template>
<script>
  import {employeeHttpUrl as httpUrl} from '../httpUrl';
  import myDirect from '@/components/direct';
  import {filterParams} from '../process';
  export default {
    components:{myDirect},
    data(){
      return {
        id:null,//员工id
        startDate:null,
        list:[],
        loading:false,
        geocoder:null,
        detail:null,//员工信息
        address:null,//员工当前位置地址
      }
    },
    computed:{
      endDate(){
        return this.startDate ? this.startDate + 86400000 : null
      }
    },
    methods:{
      /**
       * @description 获取负责保养项目列表
       */
      getList(){
        this.loading = true;
        this.$xttp.post(httpUrl.maintainPlanList,filterParams({
          startDate:this.startDate,
          endDate:this.endDate,
          page:1,
          size:10,
          id:this.id
        })).then(res => {
          if(!res['errorCode']){
            this.list = res.data['records'];
          }
          this.loading = false;
        }).catch(err=>this.loading = false)
      },
      /**
       * @description 获取员工信息
       */
      getUserInfo(){
        this.$xttp.get(`${httpUrl.detail}${this.id}/detail`)
          .then(res => {
            if(!res['errorCode']){
              this.detail = res['data'];
              this.getUserLocation();
            }
          });
      },
      /**
       * @description 获取员工当前location
       */
      getUserLocation(){
        this.$xttp.get(`${httpUrl.getEmployeeLocation}${this.detail.userId}/location`)
          .then(res => {
            if(!res['errorCode']){
               this.getAddress(res['data']).then(res => this.address = res.formattedAddress)
            }
          });
      },
      /**
       * @description 经纬度 -> 地址
       * @param lnglatXY
       * @returns {*}
       */
      getAddress(lnglatXY){
        if (!this.geocoder) {
          console.warn('please init map geocoder');
          return false;
        }
        return new Promise ((resolve,reject)=>{
          this.geocoder.getAddress(lnglatXY, (status, result) =>{
            if (status === 'complete' && result.info === 'OK') {
              resolve({
                province:result.regeocode.addressComponent.province,
                city:result.regeocode.addressComponent.city,
                district:result.regeocode.addressComponent.district,
                formattedAddress:result.regeocode.formattedAddress,
              })
            }else{
              //获取地址失败
              console.warn('map.vue -> getAddress -> 获取地址失败');
              reject();
            }
          });
        })
      },
      dateChange(){
        this.getList();
      }
    },
    mounted(){
      const query = this.$route.query,_this = this;
      this.id = query.id;
      this.getUserInfo();
      this.getList();
      //初始化数据
      this.$store.commit('PUSHDIRECT', '保养计划');
      AMap.service('AMap.Geocoder',() => {//回调函数
          //实例化Geocoder
          _this.geocoder = new AMap.Geocoder();
          //TODO: 使用geocoder 对象完成相关功能
        });
    }
  }
</script>
<style lang="scss" scoped>
  .page-maintain-plan {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 500;
    background-color: #fff;
    .maintainPlan-con-wrap {
      position: relative;
      .employee-info {
        position: absolute;
        left: 0;
        top: 0;
        width: 300px;
        margin-right: 20px;
        border: 1px solid #eee;
        border-radius: 8px;
        padding: 6px;
        p {
          line-height: 24px;
          padding: 3px 0;
        }
      }
      .maintainPlan-list-wrap {
        padding-left: 320px;
      }
    }
  }
</style>
