<template>
  <transition>
    <div v-if="show" class="page-add" style="position:relative;">
      <div style="float:right;position:absolute;right:0;top:0;" v-if="disableds">
           <googMap ref="myMap" > </googMap>
      </div>
      <el-form :model="form" ref="form" label-width="120px" class="demo-form">
        <div class="tit">基本信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="电梯编号" required>
              <el-input v-model="form.elevatorTypeId" size="medium" :disabled="disableds"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电梯类型" required>
               <el-select v-model="form.type" placeholder="维保班组" :disabled="disableds">
                <el-option
                  v-for="item in elevatorType"
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
            <el-form-item class="flex" label="电梯别名" required>
              <el-input v-model="form.name" size="medium" :disabled="disableds"></el-input>
              
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电梯用途：" required>
                 <el-select v-model="form.useType" placeholder="乘客电梯" :disabled="disableds">
                      <el-option
                             v-for="item in userTypeSelect"
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
            <el-form-item class="flex" label="注册代码" required>

              <el-input v-model="form.registerCode" size="medium" :disabled="disableds"></el-input>
              
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开门方式" required>
              <el-select v-model="form.openType " placeholder="开门方式" :disabled="disableds">
                      <el-option v-for="item in openTypeSelect"
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
            <el-form-item class="flex" label="品牌" required>
              <el-select
                 v-model="brandId"
                 multiple
                  filterable
                 remote

                 reserve-keyword
                 placeholder="请输入电梯品牌"
                 :remote-method="brandSearch"
                 :loading="loading" @change="brandChange">
                 <el-option
                   v-for="item in brandList"
                   :key="item.brandNumber "
                   :label="item.brandName"
                   :value="item.brandNumber">
                 </el-option>
               </el-select>
               <!--  <el-select v-model="form.brandId " placeholder="选择品牌"  class="flex" :disabled="disableds" >
                       <el-option v-for="item in brandIdSelect"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                </el-option>  -->
                </el-select>
              <el-button type="text" v-if="!disableds">新增</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电梯安装日期" required>
              <el-date-picker
                :disabled="disableds"
                v-model="form.installLocalTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

       <el-row>
          <el-col :span="8">
            <el-form-item class="flex" label="梯种" required>
                <el-select v-model="form.elevatorTypeName " placeholder="选择梯种"  class="flex" :disabled="disableds">
                        <el-option v-for="item in leftTypeName"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                 </el-option> 
                </el-select>
              <el-button type="text" v-if="!disableds">新增</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="梯龄" required>
             <span>{{form.liftAge}}</span>
            </el-form-item>
          </el-col>
        </el-row> 

       
        <div class="tit">维保信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item class="flex" label="所属项目" required>
              <el-select v-model="form.houseName " placeholder="选择梯种"  class="flex" :disabled="disableds">
                      <el-option v-for="item in houseNameSelect"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                    </el-option> 
                </el-select>
               <el-button type="text" v-if="!disabled">新增</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下次年检日期" required>
              <el-date-picker
                :disabled="disableds"
                v-model="form.nextMaintenanceDate "
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="楼栋" required>
              <el-select v-model="form.buildId " placeholder="选择楼栋"  class="flex" :disabled="disableds">
                      <el-option v-for="item in buildIdSelect"
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
            <el-form-item label="楼层总数" >
              <el-input v-model="form.sumFloor" size="medium" :disabled="disableds"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row>
          <div class="inputFloorMessage">
             <el-form-item label="电梯层/站/门:" required>
                   <input type="" name="" v-model="form.floor" :disabled="disableds"><span>层</span>
                   <input type="" name="" v-model="form.station" :disabled="disableds"><span>站</span>
                   <input type="" name="" v-model="form.door" :disabled="disableds"><span>门</span>
               </el-form-item>
          </div>
        </el-row>

        <div class="tit">物联信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="终端编号:" required>
              <el-input v-model="form.deviceNum" size="medium" :disabled="disableds"></el-input>
            </el-form-item>
          </el-col>
       
          <el-col :span="8">
            <el-form-item label="蓝牙读头品牌:" required>
              <el-select v-model="form.macType " placeholder="选择蓝牙头品牌"  class="flex" :disabled="disableds">
                      <el-option v-for="item in macTypeSelect"
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
            <el-form-item label="端口号:" required>
              <el-input v-model="form.devicePort" size="medium" :disabled="disableds"></el-input>
            </el-form-item>
          </el-col>
       
          <el-col :span="8">
            <el-form-item label="蓝牙地址：" required>
              <el-input v-model="form.macAddress" size="medium" :disabled="disableds"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="otherData">其他参数</div>
        <el-row>
          <el-col :span="8">
            <el-form-item class="flex" label="额定载量：" required>
              <el-input v-model="form.ratedLoad" size="medium" :disabled="disableds"></el-input>
            
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="提升高度(m)：" required>
               <el-input v-model="form.liftHeight" size="medium" :disabled="disableds"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

       
        <el-row>
          <el-col :span="8">
            <el-form-item class="flex" label="额定速度(m/s):" required>
              <el-input v-model="form.ratedSpeed" size="medium" :disabled="disableds"></el-input>
            
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="倾斜角度(度)：" required v-if="form.type==2">
               <el-input v-model="form.lope" size="medium" :disabled="disableds"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

       
        <!-- 添加 -->
        <el-form-item v-if="!disableds">
          <el-button type="primary" @click="addSave">保存</el-button>
        </el-form-item>
        <!--  -->
        <el-form-item v-else>
          <el-button :type="butText=='编辑'?'danger':'primary'" @click="edit">{{butText}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </transition>
</template>
<script>
import {certificateHttpUrl} from '../httpUrl';
import googMap from '@/components/map';
  export default {
    components:{
      googMap,
    },
    props: {
      show: {
        required: true,
        default: false
      },
      type: {
        type: String,
        default: 'add',//add edit see
      },
      liftId:{
         default:"", 
      }
    },
    data(){
      return {
        brandList:[],//电梯品牌列表
        loading:false,
        addressSelect:['广东省', '广州市', '天河区'],
        saveForm:{},
        disableds:false,
        butText:"编辑",
        elevatorType:[
            {
              value:1,
              label:'直梯'
            },
            {
              value:2,
              label:'扶梯'
            },
            {
              value:3,
              label:'自动人行道'
            }
        ],
        userTypeSelect:[//电梯用途
            {
              value:1,
              label:"别墅梯"
            }
            ,{
              value:2,
              label:"客梯",
            }
            ,{
              value:3,
              label:"货梯",
            }
            ,{
              value:4,
              label:"车库梯",
            }
            ,{
               value:5,
              label:"医用梯",
          }],
         openTypeSelect:[{//开门方式
            value:1,
            label:"左开"
          },{
            value:2,
            label:"中开",
          },{
            value:3,
            label:"右开",
          },{
            value:4,
            label:"双开",
          }
          ],
          brandIdSelect:[//选择品牌
            {
               value:1,
              label:"品牌1",
            }
            ,{
               value:2,
              label:"品牌2",
            }
            ,{
               value:3,
              label:"品牌3",
            }
            ,{
               value:4,
              label:"品牌4",
            }
          ],
          leftTypeName:[//梯种
            {
               value:1,
              label:"梯种1",
            }
            ,{
              value:2,
              label:"梯种2",
            }
            ,{
              value:3,
              label:"梯种4",
            }
          ],
          houseNameSelect:[
            {value:1,label:"项目1"}
            ,{value:2,label:"项目2"}
            ,{value:3,label:"项目3"}
          ],
          buildIdSelect:[
            {
              value:1,
              label:"楼栋A",
            }
            ,{
              value:2,
              label:"楼栋B", 
            }
            ,{
               value:3,
              label:"楼栋C",
            }
          ],
          macTypeSelect:[
            {
              value:1,
              label:'金博',

            }
            ,{
              value:2,
              label:'康途',
            }
          ],
          liftAge:null,//梯年龄
          brandId:null,
        form: {
          type:null,//电梯类型（1：直梯 2：扶梯 3：自动人行道） ,
          elevatorTypeId:null,//电梯编号
          name: null,//电梯别名
          useType:null,//电梯用途（1：别墅梯 2：客梯 3：货梯 4：车库梯 5：医用梯 ） ,
          registerCode:null,//注册代码
          openType:null,//开门方式 开门方式（1：左开 2：中开 3：右开 4：双开） ,
          elevatorTypeName:null,//梯种名称 ,
           brandId:null,//品牌
           installLocalTime:null,//安装时间
           elevatorTypeName:null,//梯种
           liftAge:null,//梯年龄
           houseName:null,//项目名称 
           nextMaintenanceDate:null,//最近保养时间 ,
           buildId:null,//楼栋
           Sumfloor:null,//总层
           floor:null,//层
           station:null,//站
           macType:null,//1 金博 2 康途 蓝牙类别
           devicePort:null,//终端端口号【设备端口号】
           eviceNum:null,// (string, optional): 终端编号【设备编号】
           macAddress:null, // (string, optional): 蓝牙 macAddress 用于蓝牙招梯
           ratedLoad:null,// (integer, optional): 额定载重（KG）
           liftHeight:null, //(integer, optional): 提升高度：传值整形 ，统一*1000 前端自行除3位
           ratedSpeed:null, //(integer, optional): 额度速度 （m/mi）
           lope:null,// (integer, optional): 倾斜角度(度)：传值整形 ，统一*1000 前端自行除3位
          // elevatorId:null,//电梯编号
          // //useType:null,//使用类型（1：别墅梯 2：客梯 3：货梯 4：车库梯 5：医用梯 ）
         
          // type:null,//电梯类型（1：直梯 2：扶梯 3：自动人行道）
          // elevatorTypeId:null,//梯种
          // openType:null,//开门方式（1：左开 2：中开 3：右开 4：双开）
          // ratedLoad:null,//额定载量
          // ratedSpeed:null,//额定速度
          // //所属项目？
          // startTime:null,//首次保养时间？
          // endTime:null,//下次年检时间？

          // elevatorNum:null,//梯号
          // //单元号？
          // //楼层总数？
          // //层站总数？
          // deviceNum:null,//终端编号
          // devicePort :null,//端口号
        },
        time: null,
      }
    },
    computed:{
      typeText(){
        return this.type === 'add' ? '新增电梯' : '电梯详情';
      },
      disabled(){
        return this.type === 'see'
      }
    },
    methods: {
      //电梯品牌Id获取
      brandSearch(query){
        if (query !== '') {
          this.loading = true;
          this.$xttp.post(certificateHttpUrl.addBrand,{page:1,size:10,name:query}).then(res=>{
            if(res.errorCode==0){
              this.brandList=res.data.records

            }else{
              this.$message(res.errorMsg)
            }
            this.loading = false;
          })
        }
      },
      //电梯品牌改变
      brandChange(){
        console.log(this.form.brandId,this.brandId)
        this.form.brandId=this.brandId[0]
      },


      addSave(){
        this.form.elevatorTypeId="5a17e75f0cf29ea40f583999"
        try{
            this.form.installLocalTime=this.form.installLocalTime.valueOf()
            this.form.nextMaintenanceDate=this.form.nextMaintenanceDate.valueOf()
         } catch(res){}
        this.$xttp.post(certificateHttpUrl.add,this.form).then(res=>{
            if(res.errorCode==0){
              this.$message("增加保存成功！")
              this.$emit("addHied")
            }else{
              this.$message(res.errorMsg+"增加失败，请稍后再试！")
            }
        })
      },
      edit(){
        if(this.butText=="编辑"){

            this.butText="保存"
            this.disableds=false;
        }else{
          this.$xttp.post(certificateHttpUrl.edit,this.form).then(res=>{
            if(res.errorCode==0){
                this.$message("增加保存成功！")
                this.butText="编辑"
                 this.$emit("addHied")
                
            }else{
                 this.$message(res.errorMsg+"保存失败，请稍后再试！")
            }
          })
          
        }
      },
      handleAvatarSuccess(res, file){

      },
      handleRemove(){

      },
      //获取数据
      getData(){
        console.log(8888)
        this.$xttp.get(certificateHttpUrl.detail+this.liftId+"/detail").then(res=>{
          if(res.errorCode==0){
              Object.assign(this.form,res.data)
              //地图初始化
              this.$nextTick(() => {
                this.$refs.myMap.$emit('mapInit', {
                  
                  initAddress:this.form.address//`${this.addressSelect.join('')}${this.detailAddress}`
                })
              })
              //
          }
        })
      },
    },
    mounted(){

      Object.assign(this.saveForm,this.form)
      console.log(this.saveForm)
    },

    watch:{
      show(newVal){
        // const saveForms={}
        // Object.assign(saveForms,this.form)
        if(newVal) {
          console.log(newVal)
          this.$store.commit('PUSHDIRECT',this.typeText)
          if(newVal=="see"){

            this.getData()
            this.butText="编辑";
            this.disableds=true;

          }else if(newVal=="add"){
           
               this.disableds=false;
          }
          
           

        } else {
          this.$store.commit('POPDIRECT');
           Object.assign(this.form,this.saveForm)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .page-add {
    .tit {
      height: 56px;
      display: flex;
      align-items: center;
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

  .inputFloorMessage{
    .el-form-item__content{
      display:flex;
    }
    display:flex;
    input{

      display:block;
      border:1px solid #dcdfe6;
      border-radius:4px 4px;
      -o-border-radius:4px 4px;
      -ms-border-radius:4px 4px;
      -moz-border-radius:4px 4px;
      -webkit-border-radius:4px 4px;
      width:60px;
    }
    span{
      display:block;
      width:20px;text-align:center;
    }
  }

</style>
