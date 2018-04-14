<template>
  <el-dialog
    title="新增"
    width="1100px"
    :visible.sync="show">
    <el-form :model="form" ref="form" label-width="120px" class="demo-form">
      <div class="tit">基本信息</div>
      <el-row>
        <el-col :span="8">
          <el-form-item label="姓名" required>
            <el-input v-model="form.userName" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="手机号码" required>
            <el-input v-model="form.mobile" :maxlength="11" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="身份证号码" required>
            <el-input v-model="form.identity" :maxlength="18" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="性别">
              <span v-if="comSex === 1">男</span>
              <span v-if="comSex === 2">女</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="出生年月">
            <span>{{comBirthday}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="tit">职业信息</div>
      <el-row>
        <el-col :span="8">
          <el-form-item label="岗位" required>
            <el-select
              v-model="form.positionId"
              size="small"
              filterable
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
            <el-date-picker
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
            <span>{{comWorkYear}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="操作证编号">
            <el-input v-model="form.optLicenseNumber" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="操作证">
            <el-upload
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
            <el-button type="text" @click="openDialog('addSkilledDialog')" size="small">添加</el-button>
            <div>
              <div v-for="(item,index) in viewSkilled">
                <span>{{item.brand}}</span>
                <span>{{item.year}}年</span>
                <el-button type="text" @click="removeSkilled(index)" size="small">移除</el-button>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="备注">
            <el-input v-model="form.remark" size="small"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" size="small" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
  import {contractHttpUrl as httpUrl} from '../httpUrl';
  export default {
    data(){
      return {
        show: false,
        files: [],
        brandSelect:[
          '戈尔',
          '鑫诺',
          '日立',
        ],
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
      removeSkilled(index){
        this.viewSkilled.splice(index,1);
      },
      save(){
        let loadingInstance = Loading.service({fullscreen: true});
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
          this.$xttp.post(httpUrl.addEmployee, data).then(res => {
            if (!res['errorCode']) {
              this.$message.success('新增员工成功');
              this.$store.commit('POPDIRECT');
              this.$emit('onload');
              this.show = false;
            }
            loadingInstance.close()
          }).catch(err => loadingInstance.close());
        }).catch(err => loadingInstance.close());
      },
      addSkilled(){
        if (!this.addSkilledForm.brand) {
          this.$message.warning('请选择品牌');
          return false;
        }
        if (!/^\d+$/.test(this.addSkilledForm.year) && this.addSkilledForm.year < 0) {
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
      this.$on('show', () => {
        //初始化数据
        this.positionOption = [];
        this.viewAptitudes = [];
        this.viewSkilled = [];
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
        //初始化
        this.show = true;
      });
      this.$on('hide', () => this.show = false )
    },
  }
</script>
<style lang="scss" scoped>

</style>
