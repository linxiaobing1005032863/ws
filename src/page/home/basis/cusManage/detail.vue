<template>
  <el-dialog
    :title="type === 'add' ? '新增' : type === 'edit' ? '编辑' : '详情'"
    width="1100px"
    :visible.sync="show"
    :before-close="closeDialog">
    <div class="page-cus-add con-wrap">
      <div class="step1-wrap" v-if="step === 1">
        <div>
          <el-form :model="step1Form" ref="step1Form" label-width="120px" class="demo-form">
            <el-form-item label="所在地区" required>
              <el-cascader
                size="small"
                :options="addressOption"
                v-model="addressSelect"
                :disabled="disabled"
                @change="addressChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item class="flex" label="客户名称" required>
              <el-input v-model="step1Form.name" size="small">
                <el-button slot="append" icon="el-icon-search" @click="search">搜索客户</el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="step1State">
          <p class="list-tit">为您找到以下客户</p>
          <div class="list-wrap">
            <div class="result-block" v-for="item in step1List">
              <div>{{item.name}}</div>
              <div>
                <span>地址：{{item.province}}{{item.city}}{{item.area}}{{item.address}}</span>
                <span>联系人：{{item.contactName}}</span>
                <span>联系电话：{{item.contactPhone}}</span>
              </div>
              <el-button v-if="item.bind === 0" @click="applyRelations(item)" size="small">申请绑定</el-button>
              <el-button v-else size="small">已申请绑定</el-button>
            </div>
          </div>
          <div class="noData">
            没有找到想要绑定的客户，您可以手动添加客户<el-button size="small" @click="nextStep">添加客户</el-button>
          </div>
        </div>
      </div>
      <div class="step2-wrap" v-if="step === 2">
        <div class="form-wrap">
          <el-form :model="step2form" ref="step2form" label-width="120px">
            <el-form-item label="客户名称" required>
              <span v-if="disabled">{{info.name}}</span>
              <el-input v-else v-model="step2form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="联系人" required>
              <span v-if="disabled">{{info.contactPersonName}}</span>
              <el-input v-else v-model="step2form.contactPersonName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" required>
              <span v-if="disabled">{{info.contactPersonPhone}}</span>
              <el-input v-else v-model="step2form.contactPersonPhone" size="small"></el-input>
            </el-form-item>
            <el-form-item label="所在地区" required>
              <span v-if="disabled">{{`${ info['province'] }/${ info['city'] }/${ info['area'] }`}}</span>
              <el-cascader
                v-else
                size="small"
                :options="addressOption"
                v-model="addressSelect"
                :disabled="disabled"
                @change="addressChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" required>
              <span v-if="disabled">{{info.address}}</span>
              <el-input v-else v-model="step2form.address" size="small" @change="updateMap"></el-input>
            </el-form-item>

            <!--<el-form-item label="备注">-->
              <!--<span v-if="disabled">{{info.remark ? info.remark : '-'}}</span>-->
              <!--<el-input v-else type="textarea" v-model="step2form.remark" size="small"></el-input>-->
            <!--</el-form-item>-->

            <el-form-item>
              <el-button v-if="type !== 'see'" type="primary" size="small" @click="save">保存</el-button>
              <el-button v-else type="primary" size="small" @click="handleEdit">编辑</el-button>
              <!--<el-button v-if="type === 'edit'" type="primary" @click="handleDelete">删除</el-button>-->
            </el-form-item>
          </el-form>
        </div>
        <div class="map-wrap">
          <my-map ref="myMap" width="350px" height="350px" :disabled="disabled" @click="mapClick" @complete="mapComplete"></my-map>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import address from '@/utils/citys';
  import map from '@/components/map';
  import {cusHttpUrl as httpUrl} from '../httpUrl';
  import {filterParams} from '../process';
  import {Loading} from 'element-ui';
  export default {
    components:{'my-map':map},
    data(){
      return {
        show:false,//显示状态
        type:null,//打开类型
        step:1,
        detail:null,//接口获取detail
        info:null,//外部传入detail
        addressSelect: ['广东省', '广州市', '天河区'],
        step2form: {
          province: null,//省
          city: null,//市
          area: null,//区
          address: null,//详细地址
          name: '',//客户名称
          contactPersonPhone:null,//联系人方式
          contactPersonName: null,//联系人
          remark: null,//备注
        },

        step1Form:{
          province: null,//省
          city: null,//市
          area: null,//区
          name: null,//客户名称
        },
        step1List:[
//          {
//            name:'广州雅居乐物业服务管理有限公司',
//            contactPerson:{
//              name:'郭打开',
//              mobile:'020-38232390',
//            },
//            province:'广东省',
//            city:'广州市',
//            area:'番禺区',
//            address:'南村镇',
//          },
//          {
//            name:'广州雅居乐物业服务管理有限公司',
//            contactPerson:{
//              name:'郭打开',
//              mobile:'020-38232390',
//            },
//            province:'广东省',
//            city:'广州市',
//            area:'番禺区',
//            address:'南村镇',
//          },
//          {
//            name:'广州雅居乐物业服务管理有限公司',
//            contactPerson:{
//              name:'郭打开',
//              mobile:'020-38232390',
//            },
//            province:'广东省',
//            city:'广州市',
//            area:'番禺区',
//            address:'南村镇',
//          },
//          {
//            name:'广州雅居乐物业服务管理有限公司',
//            contactPerson:{
//              name:'郭打开',
//              mobile:'020-38232390',
//            },
//            province:'广东省',
//            city:'广州市',
//            area:'番禺区',
//            address:'南村镇',
//          },
//          {
//            name:'广州雅居乐物业服务管理有限公司',
//            contactPerson:{
//              name:'郭打开',
//              mobile:'020-38232390',
//            },
//            province:'广东省',
//            city:'广州市',
//            area:'番禺区',
//            address:'南村镇',
//          },
        ],
        step1State:false,
        addressOption: address,
      }
    },
    computed: {
      disabled(){
        return this.type === 'see'
      }
    },
    methods: {
      /**
       * @description 搜索客户
       */
      search(){
        if(!this.step1Form.name || this.step1Form.name.replace(/(^\s*)|(\s*$)/g, "") === ''){
          this.$message.warning('请输入客户名称');
          return false;
        }
        this.step1Form.province = this.addressSelect[0];
        this.step1Form.city = this.addressSelect[1];
        this.step1Form.area = this.addressSelect[2];
        this.$xttp.post(httpUrl.searchProperty,Object.assign({
          page:1,
          size:20,
        },this.step1Form)).then(res => {
          if (!res['errorCode']){
            this.step1State = true;
            this.step1List = res.data['records'];
          }
        })
      },
      /**
       * @description 申请绑定
       * @param row 行数据
       */
      applyRelations(row){
        let data = JSON.parse(JSON.stringify(row));
        data.contactPersonName = data.contactName;
        data.contactPersonPhone = data.contactPhone;
        data.propertyId = data.id;
        delete data.id;
        this.$xttp.post(httpUrl.applyRelations,data).then(res=>{
          if(!res['errorCode']){
            this.search();
          }
        })
      },
      nextStep(){
        this.step = 2;
        this.initMap();
      },
      /**
       * @description 保存
       */
      save(){
        this.$Validate({
          obj:this.step2form,
          rules:{
            name: {
              required:'请输入客户名称'
            },//客户名称
            address: {
              required:'请输入详细地址'
            },//详细地址
            'contactPersonName': {
              required:'请输入联系人姓名',
            },
            'contactPersonPhone': {
              required:'请输入联系人电话',
              isPhone:'请输入正确的电话号码'
            },
          }
        }).then(()=>{
          this[this.type]()
        }).catch(()=>{console.warn('validate error')});
      },
      add(){
        let loadingInstance;
        this.$xttp.post(httpUrl.add,filterParams(this.step2form))
          .then(res=>{
            if(!res['errorCode']) {
              this.$message.success('新增客户成功');
              this.$emit('onload');
              this.show = false;
            }
            loadingInstance = Loading.service({fullscreen: true});
          }).catch(err => loadingInstance = Loading.service({fullscreen: true}))
      },
      edit(){
        let loadingInstance;
        this.$xttp.post(httpUrl.edit,Object.assign({},filterParams(this.step2form),{
          id:this.info.id
        })).then(res=>{
            if(!res['errorCode']) {
              this.$message.success('修改成功');
              this.$emit('onload');
              this.show = false;
            }
          loadingInstance = Loading.service({fullscreen: true})
        }).catch(err => loadingInstance = Loading.service({fullscreen: true}))
      },
      /**
       * @description 编辑
       */
      handleEdit(){
        this.type = 'edit';
      },
      /**
       * @description 删除
       */
      handleDelete(){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      closeDialog(){
        this.show = false;
      },
      addressChange(val){
        this.step2form.province = val[0];//省
        this.step2form.city = val[1];//市
        this.step2form.area = val[2];//区
        this.step1Form.province = val[0];//省
        this.step1Form.city = val[1];//市
        this.step1Form.area = val[2];//区
        if(this.$refs.myMap) {
          this.updateMap()
        }
      },
      mapClick(val){
        this.step2form.province = val.province;//省
        this.step2form.city = val.city;//市
        this.step2form.area = val.district;//区
        this.step2form.address = val.formattedAddress;//区
      },
      mapComplete(val){
        this.step2form.province = val.province;//省
        this.step2form.city = val.city;//市
        this.step2form.area = val.district;//区
        this.step2form.address = val.formattedAddress;//区
      },
      updateMap(){
        this.$refs.myMap.$emit('updateMap',`${this.addressSelect.join('')}${this.step2form.address}`);
      },
      get(){
        this.initMap();
      },
      initMap(){
        this.$nextTick(()=>{
          this.$refs.myMap.$emit('mapInit',{
            initAddress: this.type === 'add' ? null : `${this.addressSelect.join('')}${this.step2form.address}`
          })
        })
      },
    },
    mounted(){
      this.$on('show',op => {
        //初始化
        this.type = op.type;
        this.info = op.info;
        if (op.type === 'see') {//查看
          if (this.info.name) {
            this.addressSelect = [this.info.province,this.info.city,this.info.area];
          }
          for(let key in this.step2form){
            this.step2form[key] = this.info[key];
          }
          this.show = true;
          this.step = 2;
          this.initMap();
        } else {//新增
          this.step = 1;
          this.step1Form = {
            province: null,//省
            city: null,//市
            area: null,//区
            name: null,//客户名称
          }
          this.step1List = [];
          this.step1State = false;
          this.step2form = {
            address: null,//详细地址
            area: null,//区
            city: null,//市
            province: null,//省
            name: '',//客户名称
            contactPersonPhone:null,//联系人方式
            contactPersonName: null,//联系人
            remark: null,//备注
          }
          this.show = true;
        }
      });
      this.$on('hide',()=> {
        if (this.show) this.show = false;
      })
    },
  }
</script>
<style lang="scss" scoped>
  @import "../../../../style/mixins";
  .step1-wrap {
    .list-tit {
      line-height: 44px;
      padding-left: 66px;
    }
    .list-wrap {
      max-height: 300px;
      @include optimizationScroll;
      padding-bottom: 44px;
      .result-block {
        height: 66px;
        line-height: 28px;
        padding: 0 240px 0 66px;
        border-top: 1px solid #eee;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        div:nth-child(2) {
          display: flex;
          justify-content: space-between;
        }
        .el-button {
          position: absolute;
          top: 50%;
          right: 30px;
          transform: translateY(-50%);
        }
      }
    }
    .noData {
      display: flex;
      align-items: center;
      justify-content: center;
      .el-button {
        margin-left: 20px;
      }
    }
  }
  .step2-wrap {
    display: flex;
    justify-content: space-around;
    .form-wrap {
      width: 650px;
      padding: 0 20px;
      border-right: 1px dashed #eee;
    }
    .map-wrap {
      width: 350px;
      height: 350px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
<style lang="scss">
  .page-cus-add {
    .el-form-item {
      &.flex {
        .el-form-item__content {
          display: flex;
          align-items: center;
        }
      }
      .el-button--text {
        margin-left: 10px;
      }
    }
  }

</style>

