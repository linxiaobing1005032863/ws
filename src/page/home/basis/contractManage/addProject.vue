<template>
  <el-dialog
    title="新增"
    width="1100px"
    :visible.sync="show"
    :before-close="closeDialog">
    <el-form :model="form" ref="form" label-width="120px" class="demo-form" >
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目名称" required>
            <el-input v-model="form.projectName" placeholder="请输入项目名称" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="楼盘名称" required>
            <el-select
              v-model="selectCommunity"
              filterable
              size="small"
              remote
              clearable
              default-first-option
              placeholder="请选择楼盘"
              :remote-method="communitySearchAsync"
              :loading="selectLoading" @change="communitySearchChange">
              <el-option
                v-for="item in communityOption"
                :key="item.id"
                :label="item.communityName"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目类型" required>
            <span v-if="form.communityType === 1">写字楼</span>
            <span v-if="form.communityType === 2">住宅楼</span>
            <span v-if="form.communityType === 3">医院</span>
            <span v-if="form.communityType === 4">学校</span>
            <span v-if="form.communityType === 5">商场</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="详细地址" required>
            <span>{{form.address}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <my-map ref="myMap" @click="mapClick" @complete="mapComplete"></my-map>
      <el-row>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" @click="save" size="small">保存</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
  import address from '@/utils/citys';
  import map from '@/components/map';
  import {contractHttpUrl as httpUrl} from '../httpUrl';
  import {filterParams} from '../process';
  import {Loading} from 'element-ui';
  export default {
    components:{'my-map':map},
    data(){
      return {
        show:false,
        form: {
          address: null,//详细地址
          projectName:null,//项目名称
          communityId: null,//楼栋id
          communityType:1,//项目类型（1：写字楼 2：住宅楼 3：医院 4：学校 5：商场 ）
        },
        projectTypeOption:[
          {
            label:'写字楼',
            value:1,
          },
          {
            label:'住宅楼',
            value:2,
          },
          {
            label:'医院',
            value:3,
          },
          {
            label:'学校',
            value:4,
          },
          {
            label:'商场',
            value:5,
          },
        ],
        selectCommunity:null,
        communityOption:[],
        selectLoading:false,
      }
    },
    methods: {
      communitySearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchCommunity,{
            communityName:queryString,
            page:1,
            size:20,
          }).then(res => {
            if (!res['errorCode']) {
              this.communityOption = res['data'].records
            }
            this.selectLoading = false;
          })
          this.selectLoading = false;
        }, 500);
      },
      communitySearchChange(val){
        this.form.address = val.address;//详细地址
        this.form.communityId =  val.id;//楼栋id
        this.form.communityType = val.communityType;//项目类型（1：写字楼 2：住宅楼 3：医院 4：学校 5：商场 ）
      },
      /**
       * @description 保存
       */
      save(){
        let loadingInstance;
        this.$Validate({
          obj:this.form,
          rules:{
            projectName:{
              required:'请输入项目名称'
            },//项目名称
            communityId:{
              required:'请选择楼盘名称'
            },//详细地址

          }
        }).then(()=>{
          loadingInstance = Loading.service({fullscreen: true});
          this.$xttp.post(httpUrl.addProject,filterParams(this.form))
            .then(res=>{
              if(!res['errorCode']) {
                this.$message.success('新增客户成功');
                this.show = false;
              }
              loadingInstance.close();
            }).catch(err => loadingInstance.close())
        });
      },
      closeDialog(){
        this.show = false;
      },
      addressChange(val){
        this.form.province = val[0];//省
        this.form.city = val[1];//市
        this.form.area = val[2];//区
      },
      mapClick(val){
        this.form.province = val.province;//省
        this.form.city = val.city;//市
        this.form.area = val.district;//区
        this.form.address = val.formattedAddress;//区
      },
      mapComplete(val){
        this.form.province = val.province;//省
        this.form.city = val.city;//市
        this.form.area = val.district;//区
        this.form.address = val.formattedAddress;//地址
      },
    },
    mounted(){
      this.$on('show',(op) => {
        if (!op.propId) {
          console.warn('请传入客户id');
          return false;
        }
        this.form = {
          address: null,//详细地址
          projectName:null,//项目名称
          communityId: null,//楼栋id
          communityType:1,//项目类型（1：写字楼 2：住宅楼 3：医院 4：学校 5：商场 ）
          propId:op.propId
        }
        //初始化
        this.$nextTick(()=>{
          this.$refs.myMap.$emit('mapInit')
        })
        this.show = true;
      });
      this.$on('hide',()=> {this.show = false})
    },
  }
</script>
<style lang="scss" scoped>
 #container {
    width: 80%;
   height: 250px;
   margin: 0 auto 20px;
 }
</style>
