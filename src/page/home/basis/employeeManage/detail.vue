<template>
  <div>
    <transition>
      <div class="page-add">
        <my-direct/>
        <el-form v-if="type === 'add' || detail" :model="form" ref="form" label-width="120px" class="demo-form">
          <div class="tit">基本信息</div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="姓名" required>
                <span v-if="disabled">{{detail.userName}}</span>
                <el-input v-else v-model="form.userName" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="手机号码" required>
                <span v-if="disabled">{{detail.mobile}}</span>
                <el-input v-else v-model="form.mobile" :maxlength="11" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="身份证号码" required>
                <span v-if="disabled">{{detail.identity}}</span>
                <el-input v-else v-model="form.identity" :maxlength="18" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="性别">
                <div v-if="disabled">
                  <span v-if="detail.sex === 1">男</span>
                  <span v-if="detail.sex === 2">女</span>
                </div>
                <div v-else>
                  <span v-if="comSex === 1">男</span>
                  <span v-if="comSex === 2">女</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="出生年月">
                <span v-if="disabled">{{detail.birthday | time}}</span>
                <span v-else>{{comBirthday}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="tit">职业信息</div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="岗位" required>
                <span v-if="disabled">{{detail.positionName}}</span>
                <el-select
                  v-else
                  v-model="form.positionId"
                  filterable
                  size="small"
                  remote
                  reserve-keyword
                  placeholder="所有岗位"
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="入行时间">
                <span v-if="disabled">{{detail.entryTime | time}}</span>
                <el-date-picker
                  v-else
                  v-model="form.entryTime"
                  size="small"
                  type="date"
                  value-format="timestamp"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="工龄">
                <span v-if="disabled">{{detail.workYear }}</span>
                <span v-else>{{comWorkYear}}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="操作证编号">
                <span v-if="disabled">{{detail.optLicenseNumber}}</span>
                <el-input v-else v-model="form.optLicenseNumber" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="操作证">
                <div v-if="disabled" class="imgs">
                  <img v-for="item in viewAptitudes" :src="item" alt=""/>
                </div>
                <el-upload
                  v-else
                  action=""
                  list-type="picture-card"
                  :file-list="form.aptitudes"
                  :http-request="handleAvatarSuccess"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="专业特长">
                <el-button type="text" v-if="!disabled" @click="openDialog('addSkilledDialog')">添加</el-button>
                <div>
                  <div v-for="(item,index) in viewSkilled">
                    <span>{{item.brand}}</span>
                    <span>{{item.year}}年</span>
                    <el-button v-if="disabled" type="text" @click="removeSkilled(index)">移除</el-button>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="备注">
                <span v-if="disabled">{{detail.remark}}</span>
                <el-input v-else v-model="form.remark" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button v-if="disabled" type="primary" @click="type = 'edit'" size="small">编辑</el-button>
            <el-button v-else type="primary" @click="save" size="small">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>
    <el-dialog
      :visible.sync="addSkilledDialog"
      width="700px">
      <el-form :inline="true" :model="addSkilledForm" class="demo-form-inline">
        <el-form-item label="品牌" required>
          <el-select
            v-model="addSkilledForm.brand"
            filterable
            size="small"
            remote
            clearable
            reserve-keyword
            placeholder="请输入品牌名称"
            :remote-method="brandSearchAsync"
            :loading="selectLoading">
            <el-option
              v-for="item in brandOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="年限" required>
          <el-input v-model="addSkilledForm.year" size="small"></el-input>
        </el-form-item>
      </el-form>
      <el-button @click="addSkilled" size="small">保存</el-button>
    </el-dialog>
  </div>
</template>
<script>
  import {employeeHttpUrl as httpUrl} from '../httpUrl';
  import {filterParams} from '../process';
  import {send as upLoad, getUri as downLoad} from '@/utils/oss';
  import {Loading} from 'element-ui';
  import myDirect from '@/components/direct';
  export default {
    components:{myDirect},
    data(){
      return {
        detail: null,
        id: null,
        type: 'add',
        files: [],
        brandOption:[],
        viewAptitudes: [],
        viewSkilled:[],
        form: {
          userName: null,//姓名
          mobile: null,//手机号码
          sex: null,//性别
          birthday: null,//出生年月
          identity: null,//身份证
          positionId: null,//岗位
          entryTime: new Date().getTime(),//入行时间
          workYear:null,//工龄
          optLicenseNumber: null,//操作证编号
          aptitudes: [],//操作证
          skilled: [],//专业特长
          remark: null,//备注
        },
        positionOption: [],
        selectLoading: false,
        searchTimer: null,

        addSkilledDialog:false,
        addSkilledForm:{
          brand:null,
          year:null,
        }
      }
    },
    computed: {
      typeText(){
        return this.type === 'add' ? '新增' : '详情' ;
      },
      disabled(){
        return this.type === 'see'
      },
      comBirthday(){
        if (this.form.identity && this.form.identity.length === 18 && /^\d{17}([0-9]|x|X)$/.test(this.form.identity)) {
          let birthday = (this.form.identity + '').substring(6,14);
          return `${birthday.slice(0,4)}-${birthday.slice(4,6)}-${birthday.slice(6,8)}`
        }
        return ''
      },
      comSex(){
        if (this.form.identity && this.form.identity.length === 18 && /^\d{17}([0-9]|x|X)$/.test(this.form.identity)) {
          return this.form.identity.charAt(16) % 2  === 0 ? 2 : 1;
        }
        return ''
      },
      comWorkYear(){
        if (this.form.entryTime && this.form.entryTime < new Date().getTime() ) {
          return new Date().getFullYear() - new Date(this.form.entryTime).getFullYear()
        }
        return ''
      }
    },
    methods: {
      handleAvatarSuccess(file){
        this.files.push(file['file']);
      },
      handleRemove(file){
        if (file.status === 'success') {
          const _index = this.form.aptitudes.findIndex(val => val.uid === file.uid)
          _index && this.form.aptitudes.splice(_index, 1);
        }
      },
      positionSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchPosition, {
            houseName: queryString,
            page: 1,
            size: 10,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.map(val => this.positionOption.push({label: val.name, value: val.id,}));
            }
            this.selectLoading = false;
          })
        }, 500);
      },
      brandSearchAsync(queryString){
        clearTimeout(this.searchTimer);
        if (queryString.trim() === '') {
          return false;
        }
        this.selectLoading = true;
        this.searchTimer = setTimeout(() => {
          this.$xttp.post(httpUrl.searchBrand, {
            name: queryString,
            page: 1,
            size: 20,
          }).then(res => {
            if (!res['errorCode']) {
              res['data'].records.map(val => this.brandOption.push({label: val.brandName, value: val.brandName,}));
            }
            this.selectLoading = false;
          })
        }, 500);
      },
      removeSkilled(index){
        this.viewSkilled.splice(index,1);
      },
      get(){
        this.$xttp.get(`${httpUrl.detail}${this.id}/detail`)
          .then(res => {
            if (!res['errorCode']) {
              //处理操作证
              res['data'].aptitudes = res['data'].aptitudes.map(val => {
                let url = downLoad(val);
                this.viewAptitudes.push(url);
                return {name: '', url: url, key: val}
              });
              //处理专业特长
              res['data'].skilled = res['data'].skilled.split('_').map(val=>{
                return {
                  brand:val[0],
                  year:val[1]
                }
              });
              //处理岗位
              this.positionOption = [{label: res['data'].positionName, value: res['data'].positionId}];
              this.detail = res['data'];
              Object.keys(this.form).map(key => this.form[key] = this.detail[key])
            }
          });
      },
      save(){
        this.$Validate({
          obj: this.form,
          rules: {
            userName: {
              required: '请输入姓名'
            },//姓名
            mobile: {
              required: '请输入手机号码',
              isPhone: '请输入正确的手机号码'
            },//手机号码
            identity: {
              required: '请输入身份证号码',
              isIdCard: '非合法身份证号'
            },//身份证
            positionId: {
              required: '请选择岗位',
            },//岗位
          }
        }).then(() => {
          let _aptitudes = [];
          //入行日期
          if (this.form.entryTime && this.form.entryTime > new Date().getTime() ) {
            this.$message.warning('入行时间有误');
            return false;
          }
          //处理出生年月
          this.form.birthday = new Date(this.comBirthday).getTime();
          //处理性别
          this.form.sex = this.comSex;
          //处理专业特长
          this.form.skilled = this.viewSkilled.map(val=> {
            return `${val.brand}_${val.year}`
          });
          //处理工龄
          this.form.workYear = this.comWorkYear;
          //处理操作证
          this.form.aptitudes.forEach(val => _aptitudes.push(val.key));
          //合并数据并过滤
          const data = filterParams(Object.assign({}, this.form, {
            aptitudes: _aptitudes
          }));
          //上传操作证
          if (this.files.length > 0) {
            upLoad(this.files, keys => {
              _aptitudes.push(...keys);
              Object.assign(data, {aptitudes: _aptitudes});
              this[this.type](data, () => loadingInstance.close())
            });
            return false;
          }
          this[this.type](data, () => loadingInstance.close());
        });
      },
      add(data){
        let loadingInstance = Loading.service({fullscreen: true});
        this.$xttp.post(httpUrl.add, data).then(res => {
          if (!res['errorCode']) {
            this.$message.success('新增员工成功');
            this.$store.commit('POPDIRECT');
            loadingInstance.close();
            this.$router.push({
              name:'employeeManage',
              params:{refresh:true}
            });
          }
        }).catch(err => loadingInstance.close())
      },
      edit(data){
        let loadingInstance = Loading.service({fullscreen: true});
        this.$xttp.post(httpUrl.edit, Object.assign(data,{id:this.detail.id})).then(res => {
          if (!res['errorCode']) {
            this.$message.success('修改员工信息成功');
            this.$store.commit('POPDIRECT');
            this.$router.push({
              name:'employeeManage',
              params:{refresh:true}
            })
          }
          loadingInstance.close();
        }).catch(err => loadingInstance.close());
      },
      addSkilled(){
        if (!this.addSkilledForm.brand) {
          this.$message.warning('请选择品牌');
          return false;
        }
        if (!/^\d+$/.test(this.addSkilledForm.year) || this.addSkilledForm.year <= 0) {
          this.$message.warning('请输入年限');
          return false;
        }
        this.viewSkilled.push(JSON.parse(JSON.stringify(this.addSkilledForm)));
        this.addSkilledDialog = false;
        this.addSkilledForm = {
          brand:null,
          year:null,
        }
      },
      closeDialog(name){
        this[name] = false;
      },
      openDialog(name){
        this[name] = true;
      },
    },
    mounted(){
      const op = this.$route.query;
      console.log(op)
      this.type = op.type;
      this.id = op.id;
      //初始化数据
      this.positionOption = [];
      this.viewAptitudes = [];
      this.viewSkilled = [];
      this.$store.commit('PUSHDIRECT', this.typeText);
      this.form = {
        userName: null,//姓名
        mobile: null,//手机号码
        sex: null,//性别
        birthday: null,//出生年月
        identity: null,//身份证
        positionId: null,//岗位
        entryTime: new Date().getTime(),//入行时间
        workYear:null,//工龄
        optLicenseNumber: null,//操作证编号
        aptitudes: [],//操作证
        skilled: [],//专业特长
        remark: null,//备注
      }
      if (this.type === 'see') {//查看
        this.get();
      }
    },
  }
</script>
<style lang="scss" scoped>
  .page-add {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 500;
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
      &:hover {
        border-color: #409EFF;
      }
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
