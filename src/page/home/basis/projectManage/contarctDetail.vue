<template>
  <div>
    <transition>
      <div v-if="show" class="page-add">
        <el-form v-if="type === 'see'" :model="form" ref="form" label-width="140px" class="demo-form">
          <div class="tit">基本信息</div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合同编号" required>
                <span v-if="disabled">{{detail.contractNum?detail.contractNum:'无'}}</span>
                <el-input v-else v-model="form.contractNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="签约日期" required>
                <span v-if="disabled">{{detail.signDate | time}}</span>
                <el-date-picker
                  v-else
                  v-model="form.signDate"
                  type="date"
                  :disabled="disabled"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="客户名称" required>
            <span v-if="disabled">{{detail.propCompanyName}}</span>
            <el-select
              v-else
              v-model="form.propCompanyId"
              filterable
              clearable
              remote
              default-first-option
              placeholder="选择客户"
              :remote-method="userSearchAsync"
              :loading="selectLoading">
              <el-option
                v-for="item in userOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="text" v-if="!disabled" @click="handleAdd('addCus')">添加</el-button>
          </el-form-item>
          <el-form-item label="项目名称" required>
            <div v-if="type === 'see'" class="project-wrap">
              <span v-for="item in projectOption">{{item.label}}</span>
            </div>
            <el-select
              v-else
              v-model="form.projectSet"
              multiple
              filterable
              remote
              default-first-option
              reserve-keyword
              placeholder="请选择项目"
              :remote-method="projectSearchAsync"
              :loading="selectLoading">
              <el-option
                v-for="item in projectOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button v-if="!disabled" type="text" @click="handleAdd('addProject')">添加</el-button>
          </el-form-item>
          <el-form-item label="合同原件">
            <div v-if="disabled" class="imgs">
              <img v-for="item in viewContractPath" :src="item" alt=""/>
            </div>
            <el-upload
              v-else
              action=""
              list-type="picture-card"
              :file-list="form.contractPath"
              :http-request="handleAvatarSuccess"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>

          <div class="tit">维保信息</div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="服务开始日期" required>
                <span v-if="disabled">{{detail.startDate | time}}</span>
                <el-date-picker
                  v-else
                  v-model="form.startDate"
                  type="date"
                  value-format="timestamp"
                  @change="startTimeChange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="服务结束日期" required>
                <span v-if="disabled">{{detail.endDate | time}}</span>
                <el-date-picker
                  v-else
                  v-model="form.endDate"
                  type="date"
                  value-format="timestamp"
                  @change="endTimeChange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="保养类型" required>
                <div v-if="disabled">
                  <span v-if="detail.maintenanceMode === 1">半包</span>
                  <span v-if="detail.maintenanceMode === 2">全包</span>
                  <span v-if="detail.maintenanceMode === 3">清包</span>
                </div>
                <el-select
                  v-else
                  v-model="form.maintenanceMode"
                  :disabled="disabled"
                  placeholder="请选择">
                  <el-option
                    v-for="item in typeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="flex" label="保养周期" required>
                <span v-if="disabled">{{detail.intervalTime}}天</span>
                <el-input v-else v-model="form.intervalTime" :disabled="disabled">
                  <template slot="append">天</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合同年限">
                <span>{{serviceAllTime}} 月</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="电梯台数" required>
                <span v-if="disabled">{{detail.elevatorsNum}}</span>
                <el-input v-else v-model="form.elevatorsNum"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="维保负责人" required>
                <span v-if="disabled">{{detail.maintenanceUserName}}</span>
                <el-select
                  v-else
                  v-model="form.mainUserId"
                  clearable
                  filterable
                  remote
                  default-first-option
                  reserve-keyword
                  placeholder="请选择职工"
                  :disabled="disabled"
                  :remote-method="employeeSearchAsync"
                  :loading="selectLoading">
                  <el-option
                    v-for="item in employeeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <el-button type="text" v-if="type !== 'see'" @click="handleAdd('addEmployee')">添加</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="首次服务日期">
                <span v-if="disabled">{{detail.startMaintenanceDate | time}}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="tit">财务信息</div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合同金额（元）" required>
                <span v-if="disabled">{{form.amount}}</span>
                <el-input v-else v-model="form.amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="disabled" :span="8">
              <el-form-item label="下次收款日期">
                <span>{{detail.nextPaymentDate | time}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="付款形式" required>
                <div v-if="disabled">
                  <span v-if="detail.payType === 1">月付</span>
                  <span v-if="detail.payType === 2">季度付</span>
                  <span v-if="detail.payType === 3">半年付</span>
                  <span v-if="detail.payType === 4">年付</span>
                </div>
                <el-radio-group v-else v-model="form.payType">
                  <el-radio :label="1">月付</el-radio>
                  <el-radio :label="2">季度付</el-radio>
                  <el-radio :label="3">半年付</el-radio>
                  <el-radio :label="4">年付</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col v-if="disabled" :span="8">
              <el-form-item label="下次应收金额">
                <span>{{detail.nextPayment}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款节点" required>
                <div v-if="disabled">
                  <span v-if="detail.paymentNodeType === 0">上付</span>
                  <span v-if="detail.paymentNodeType === 1">下付</span>
                </div>
                <el-radio-group v-else v-model="form.paymentNodeType">
                  <el-radio :label="0">上付</el-radio>
                  <el-radio :label="1">下付</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="月保养金额">
                {{perMonthAmount}} 元
            </el-form-item>
            </el-col>
          </el-row>

          <div class="tit">备注信息</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="备注">
                <span v-if="disabled">{{detail.remark?form.remark:'-'}}</span>
                <el-input
                  v-else
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button v-if="disabled" type="primary"  @click='goBack'>返回</el-button>
            
          </el-form-item>
        </el-form>
      </div>
    </transition>
    <addCus ref="addCus"></addCus>
    <addProject ref="addProject"></addProject>
    <addEmployee ref="addEmployee"></addEmployee>
  </div>
</template>
<script>
  import addCus from '@/page/home/basis/cusManage/detail';
  import addProject from '@/page/home/basis/contractManage/addProject';
  import addEmployee from '@/page/home/basis/contractManage/addEmployee';
  import {contractHttpUrl as httpUrl} from '../httpUrl';
  import {filterParams} from '../process';
  import {send as upLoad, getUri as downLoad} from '@/utils/oss';
   import {projectHttpUrl} from '../httpUrl';
  import {Loading} from 'element-ui';
  export default {
    components:{addCus,addProject,addEmployee},
    data(){
      return {
        show: false,
        type: null,
        info: {},
        detail: {},
        selectLoading: false,
        userOption: [],//客户名称 下拉数据
        projectOption: [],//项目名称 下拉数据
        employeeOption: [],//维保人员 下拉数据
        typeOption: [
          {label: '全包', value: 2},
          {label: '半包', value: 1},
          {label: '清包', value: 3},
        ],//保养类型 下拉数据
        serviceTime: null,
        viewContractPath:[],//
        files: [],
        form: {
          contractNum: null,//合同编号
          signDate: new Date().getTime(),//签约日期
          propCompanyId: null,//客户名称
          projectSet: [],//array 项目名称
          contractPath: [],//合同文件地址//合同原件
          startDate: new Date().getTime(),//服务开始日期
          endDate: new Date(new Date().getTime() + 31536000000).getTime(),//服务结束时间
          maintenanceMode: 1,//保养类型 1：半包 2：全包 3：清包 ,
          intervalTime: 15,//保养间隔时间
          elevatorsNum: 1,//电梯台数
          mainUserId: null,//维保负责人
          amount: 0,//合同金额
          payType: 2,//付款形式 1：月付 2：季度付 3：半年付 4：年付
          paymentNodeType: 0,//付款节点 0上付 1下付
          remark: null,//备注
        },
        searchTimer: null,
      }
    },
    props:{

    },
    computed: {
      typeText(){
        return this.type === 'add' ? '新增合同' : this.type === 'edit' ? '编辑合同' : '合同详情';
      },
      disabled(){
        return this.type === 'see'
      },
      //合同年限
      serviceAllTime(){
        let start,end;
        if (this.disabled) {
          start = new Date(this.detail.startDate);
          end = new Date(this.detail.endDate);
        } else {
          if (this.form.startDate && this.form.endDate && this.form.endDate > this.form.startDate) {
            start = new Date(this.form.startDate);
            end = new Date(this.form.endDate);
          } else {
            re
          }
        }
        return (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth();
      },
      //月保养金额
      perMonthAmount(){
        if (this.disabled) {
          return parseFloat(this.detail.amount / this.serviceAllTime).toFixed(2)
        }
        return parseFloat(this.form.amount / this.serviceAllTime).toFixed(2)
      },
    },
    methods: {

      goBack(){
         this.type="";
         this.show=false;
         this.$emit("projectShow")
      },
      /**
       * @description 上传合同成功
       * @param file
       */
      handleAvatarSuccess(file){
        this.files.push(file['file']);
      },
      /**
       * @description 删除合同
       */
      handleRemove(file, fileList){
        if (file.status === 'success') {
          const _index = this.form.contractPath.findIndex(val => val.uid === file.uid)
          _index && this.form.contractPath.splice(_index, 1);
        }
      },
      /**
       * @description 检索客户
       * @param queryString
       */
      userSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchCus, {
            name: queryString,
            page: 1,
            size: 10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.forEach(val => {
                this.userOption.push({label: val.name, value: val.id,})
              });
            }
            this.selectLoading = false;
          })
        }, 500);
      },
      /**
       * @description 检索项目名称
       * @param queryString
       */
      projectSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchProject, {
            houseName: queryString,
            page: 1,
            size: 10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.forEach(val => {
                this.projectOption.push({label: val.houseName, value: val.id,})
              });
            }
            this.selectLoading = false;
          })
          this.selectLoading = false;
        }, 500);
      },
      /**
       * @description 检索 维保人员
       * @param queryString
       */
      employeeSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchEmployee, {
            userName: queryString,
            page: 1,
            size: 10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.forEach(val => {
                this.employeeOption.push({label: val.userName, value: val.userId,})
              });
            }
            this.selectLoading = false;
          })
          this.selectLoading = false;
        }, 500);
      },
      /**
       * @description 服务开始时间 event change
       * @param val
       */
      startTimeChange(val){
        if (val && val < this.form.startDate) {
          this.$message.warning('开始时间必须早于结束时间');
        }
      },
      /**
       * @description 服务结束时间 event change
       * @param val
       */
      endTimeChange(val){
        if (val && val < this.form.startDate) {
          this.$message.warning('结束时间必须晚于开始时间');
        }
      },
      /**
       * @description 获取详情数据
       */
      get(){
        this.$xttp.get(projectHttpUrl.contractDetail+this.info.contractId+'/detail')
          .then(res => {
            if (!res['errorCode']) {
              //客户名称
              this.userOption = [{label: res['data'].propertyCompanyName, value: res['data'].propertyCompanyId}];
              //项目名称
              res['data'].projectSet = res['data'].projectSet.map(val => {
                this.projectOption.push({label:val.projectName,value:val.projectId})
                 return val = val.projectId
              });
              //维保人员名称
              this.employeeOption = [{label: res['data'].maintenanceUserName, value: res['data'].mainUserId}]
              //处理合同金额
              res['data'].amount /= 10000;
              //获取合同url downLoad() 赋值到 viewContractPath
              res['data'].contractPath = res['data'].contractPath.map(val => {
                let url = downLoad(val);
                this.viewContractPath.push(url);
                return { name:'', url:url,key:val}
              });

              this.detail = res['data'];

              Object.keys(this.form).map( key => this.form[key] = this.detail[key])
              console.log(this.form)
               console.log(this.detail)
            }
          });
      },
      /**
       * @description 保存
       */
      save(){
        //loading
        let loadingInstance = Loading.service({fullscreen: true});
        //校验
        this.$Validate({
          obj: this.form,
          rules: {
            contractNum: {
              required: '请输入合同编号',
              specialChat: '合同编号不支持特殊字符'
            },
            signDate: {
              required: '请选择签约日期',
            },
            propCompanyId: {
              isEmptyArray: '请选择客户名称',
            },
            projectSet: {
              isEmptyArray: '请选择项目名称',
            },
            startDate: {
              required: '请选择服务开始日期',
            },
            endDate: {
              required: '请选择服务结束日期',
            },
            intervalTime: {
              required: '请输入保养间隔时间',
            },
            elevatorsNum: {
              required: '请输入电梯台数',
              isPosInte: '电梯台数必须整数且大于0'
            },
            mainUserId: {
              required: '请选择维保负责人',
            },
            amount: {
              required: '请输入合同金额',
              isNumAndFloatLimit2: '合同金额须大于0且最多保留两位小数',
            }
          },
        }).then(() => {
          let _contractPath = [], _amount, _projectSet = [];
          //判断服务开始时间和结束时间
          if (this.form.startDate > this.form.startDate) {
            this.$message.warning('开始时间必须早于结束时间');
            return;
          }
          if (this.form.intervalTime > 15) {
            this.$message.warning('每月保养间隔时间必须小于16');
            return;
          }
          //项目名称格式 projectSet
          this.form.projectSet.forEach(val => _projectSet.push({'projectId': val}));
          //处理合同金额
          _amount = this.form.amount * 10000;
          //处理合同原件格式
          this.form.contractPath.forEach(val => _contractPath.push(val.key));
          //合并数据并过滤
          const data = filterParams(Object.assign({}, this.form, {
            amount: _amount,
            projectSet: _projectSet,
            contractPath: _contractPath
          }));
          //上传
          if (this.files.length > 0) {
            upLoad(this.files, keys => {
              _contractPath.push(...keys);
              Object.assign(data,{ contractPath:_contractPath });
              this[this.type](data,() => loadingInstance.close())
            });
            return false;
          }
          this[this.type](data,()=>loadingInstance.close());
        }).catch(err => loadingInstance.close())

      },
      /**
       * @description 添加 xttp
       * @param data
       * @param cb
       */
      add(data,cb){
        this.$xttp.post(httpUrl.add, data).then(res => {
          if (!res['errorCode']) {
            this.$message.success('新增合同成功');
            this.$store.commit('POPDIRECT');
            this.$emit('onload');
            this.show = false;
          }
          cb && cb();
        }).catch(err => cb && cb(err));
      },
      /**
       * @description 编辑 xttp
       * @param data
       * @param cb
       */
      edit(data,cb){
        this.$xttp.post(httpUrl.edit, Object.assign(data,{id:this.detail.id})).then(res => {
          if (!res['errorCode']) {
            this.$message.success('修改合同成功');
            this.$store.commit('POPDIRECT');
            this.$emit('onload');
            this.show = false;
          }
          cb && cb();
        }).catch(err => cb && cb(err));
      },
      handleAdd(name){
        if (name === 'addProject' && !this.form.propCompanyId) {//必须选择客户后
          this.$message.warning('必须选择客户后才可以添加项目');
          return false;
        }
        this.$refs[name].$emit('show',filterParams({type:'add',propId:this.form.propCompanyId}));
      }
    },
    mounted(){
     
      this.$on('show', op => {
        this.type = op.type;
        this.info = op.info;
        this.$store.commit('PUSHDIRECT', this.typeText);
        //初始化
        this.userOption = [];
        this.projectOption = [];
        this.employeeOption = [];
        this.viewContractPath = [];
        if (op.type === 'see' && op.info && op.info.id) {
          this.get();
        } else {

          this.form = {
            contractNum: null,//合同编号
            signDate: new Date().getTime(),//签约日期
            propCompanyId: null,//客户名称
            projectSet: [],//array 项目名称
            contractPath: [],//合同文件地址//合同原件
            startDate: new Date().getTime(),//服务开始日期
            endDate: new Date(new Date().getTime() + 31536000000).getTime(),//服务结束时间
            maintenanceMode: 1,//保养类型 1：半包 2：全包 3：清包 ,
            intervalTime: 15,//保养间隔时间
            elevatorsNum: 1,//电梯台数
            mainUserId: null,//维保负责人
            amount: 0,//合同金额
            payType: 2,//付款形式 1：月付 2：季度付 3：半年付 4：年付
            paymentNodeType: 0,//付款节点 0上付 1下付
            remark: null,//备注
          }
        }
        this.show = true;
      });
      this.$on('hide', () => {
        this.$store.commit('POPDIRECT');
        this.show = false;
      })
    },
  }
</script>
<style lang="scss" scoped>
  .page-add {
    width: 100%;
    height: 100%;
    // position: absolute;
    // top: 0;
    // left: 0;
    // z-index: 1000;
    background-color: #fff;
    .tit {
      height: 56px;
      display: flex;
      align-items: center;
    }
    .imgs {
      width: 100%;
      display: flex;
      img {
        width: 148px;
        height: 148px;
        border: 1px solid;
        overflow: hidden;
        background-color: #fff;
        border: 1px solid #c0ccda;
        border-radius: 6px;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        margin: 0 8px 8px 0;
        display: inline-block;
      }
    }
    .project-wrap {
      span {
        margin: 0 10px;
        position: relative;
        &:not(:last-child):after{
          content: '、';
          position: absolute;
          top: 50%;
          right: -15px;
          transform: translateY(-50%);
        }
      }
    }
  }
</style>
<style lang="scss">
  .page-add {
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
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }

</style>
