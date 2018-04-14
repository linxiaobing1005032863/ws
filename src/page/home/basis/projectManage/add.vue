<template>
	<!-- 项目管理添加 -->
  <transition>
    <div v-if="show" class="page-add">
      <div class="title_message">基本信息</div>
      <el-form :model="form" ref="form" label-width="120px" class="demo-form" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目名称" required :inline="true">
              <el-input v-model="form.projectName" :disabled="disabled" style="width:90%;"></el-input>
            </el-form-item>
          </el-col>
         
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="客户名称"  :inline="true">
              <el-select
                 v-model="name"
                 multiple
                  filterable
                 remote

                 reserve-keyword
                 placeholder="客户名称"
                 :remote-method="remoteSearch"
                 :loading="loading" @change="customerChanges">
                 <el-option
                   v-for="item in customerList"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
              <!-- <el-input v-model="form.projectName" :disabled="disabled" style="width:90%;"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12" :inline="true">
            <el-form-item label="关联合同" >
             <!--  <el-input v-model="form.name" ></el-input> -->
              <el-select v-model="form.ProjectTypeVaule" placeholder="请选择项目关联合同">
                  <el-option
                    v-for="(item,indexs) in projectType" :key='indexs'
                     :label="item.label"
                    :value="item.label">
                  </el-option>
               </el-select>
            </el-form-item>
          </el-col>
        </el-row>
       
	       <el-form-item label="楼盘名称" required>
				    <el-select
                 v-model="form.houseName"
                 multiple
                  filterable
                 remote

                 reserve-keyword
                 placeholder="请输入楼盘名称"
                 :remote-method="remoteSearchHouseName"
                 :loading="loading" @change="houseNameChanges">
                 <el-option
                   v-for="item in houseNameList"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id">
                 </el-option>
               </el-select>
			 </el-form-item> 

        <el-form-item label="住宅类型" >
            <div>{{form.communityType==1?'写字楼':form.communityType==2?'住宅楼':form.communityType==3?'住宅楼':form.communityType==4?'医院':form.communityType==5?'商场':''}}</div>
       </el-form-item>     
	        
       
        <!-- <el-form-item label="项目区域">
           <el-select v-model="form.addressValue" placeholder="请选择省" @change="addressChange()">
                  <el-option
                    v-for="(item,indexs) in addressData" :key='indexs'
                     :label="item.name"
                    :value="item.name">
                  </el-option>
             </el-select>
        
             <el-select v-model="form.cityValue" placeholder="请选择市" style="margin:0 5px;" @change="cityChange()">
                  <el-option
                    v-for="(item,indexs) in cityList" :key='indexs'
                     :label="item.name"
                    :value="item.name">
                  </el-option>
             </el-select>
        
             <el-select v-model="form.areaValue" placeholder="请选择区">
                  <el-option
                    v-for="(item,indexs) in areaList" :key='indexs'
                     :label="item"
                    :value="item">
                  </el-option>
             </el-select>
            
        </el-form-item> -->
        <el-form-item label="详细地址" required :inline="true">
            <div>{{form.province+form.city+form.area+form.address}}</div>
              <!-- <el-input v-model="form.detailAddress" :disabled="true" style="width:90%;" ></el-input> -->
         </el-form-item>
         <!-- 地圖 -->
        <div class="mapshow">

        	<googMap ref="myMap" :disable="disabled" @click="mapClick" @complete="mapComplete"> </googMap>
        </div>
        
        
        
        
        <el-form-item v-if="!disabled">
          <el-button type="primary" @click="saveSubmit" style="margin-top:30px;">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </transition>
</template>
<script>
import addressDatas from  '@/utils/addressData'
import googMap from '@/components/map'
import {projectHttpUrl} from '@/page/home/basis/httpUrl'; 
  export default {
  	components:{googMap,},
    props: {
      show: {
        // required: true,
        default: 0
      },
      type: {
        type: String,
        default: 'add',//add edit see
      },
      detail:{

      },
       propId:{
        default:null,
        type:String
      },
    },
    data(){
      return {

      	initData:{},
      	addressSelect: ['广东省', '广州市', '天河区'],//初始化地址
        name:null,//客户名称
      	customerList:[],//客户列表
        houseNameList:[],
        loading:false,
        form: {
          communityType:null,//(integer, optional): 楼盘类型（1：写字楼 2：住宅楼 3：医院 4：学校 5：商场 ） ,
          houseName:null,
          projectName: null,//项目名称
          ProjectTypeVaule:null,//项目类型
          user: null,
          addressValue:'',//省
          cityValue:'',//市
          areaValue:'',//区
          detailAddress:"",//详细地址，

          province:null,// (string, optional): 省份 ,
          city:null,// (string, optional): 城市 ,
          area:null,// (string, optional): 区/县 ,
          address:null, //(string, optional): 详细地址 ,
          files: [{
            name: 'xxx',
            url: 'xxxxxx'
          }],
          startTime: null,
          endTime: null,
          cusmoterValue:'',
          contactUntilValue:'',
          elevatorNumber:"",
        },
        time: null,
        projectType:[{value:'选项1',label:'住宅楼'},{value:'选项2',label:'写字楼'},{value:'选项3',label:'医院'},{value:'选项4',label:'学校'},{value:'选项5',label: '商场'}],

        addressData:addressDatas,//省份
       
   
        cityList:[],
        areaList:[],//区
        cusmoterList:["888",8888,9999],//客户名称
        contactUnitList:[9999,6666,7777],//关联合同
       
       
      }
    },
  
    mounted(){
    	 this.initFormData();
    	console.log(this.form)
    },
    computed:{
      typeText(){
        return this.type === 'add' ? '新增项目' : this.type === 'edit' ? '编辑项目' : '项目详情';
      },
      disabled(){
        return this.type === 'see'
      }
    },
    methods: {
      //远程获取客户名称列表
      remoteSearch(query){
        console.log(query)
        if (query !== '') {
          this.loading = true;
          this.$xttp.post(projectHttpUrl.customer,{page:this.currentPage,size:10,name:query}).then(res=>{
            
            console.log(res)
            if(res.errorCode==0){
              
              this.customerList=res.data.records;


              
              // this.
            }else{
              this.$message(res.errorMsg)
            }
            this.loading = false;
          })
          
        } else {
          this.customerList = [];
        }
      },
       customerChanges(){
           console.log(this.name[0])
           this.$xttp.post(projectHttpUrl.contractList,{page:1,size:10,propertyCompanyId:this.name}).then(res=>{
                if(res.errorCode==0){
                    this.projectType=res.data.records
                }else{
                  this.$message(res.errorMsg)
                }
           })
       },
   //远程获取楼盘名称
    remoteSearchHouseName(query){
      if (query !== '') {
        this.loading = true;
        this.$xttp.post(projectHttpUrl.buildList,{page:this.currentPage,size:10,name:query}).then(res=>{
          
          console.log(res)
          if(res.errorCode==0){
            
            this.houseNameList=res.data.records;
            console.log(this.houseNameList)

            
            // this.
          }else{
            this.$message(res.errorMsg)
          }
          this.loading = false;
        })
        
      } else {
        this.customerList = [];
      }
        // this.houseNameList
    },
    houseNameChanges(){
      console.log(this.houseNameList)
        for( let x= 0 ; x<this.houseNameList.length;x++){
          if(this.houseNameList[x].id==this.form.houseName){
              console.log(9999)
              this.form.province=this.houseNameList[x].province;
              this.form.city = this.houseNameList[x].city
              this.form.area =this.houseNameList[x].area;
              this.form.address = this.houseNameList[x].address;
              this.form.communityType=this.houseNameList[x].communityType;
          }
        }
    },
    	//隐藏
    	accessSave(){
    		this.$emit("accessSave",this.show)
    	},
    	//提交接口
    	getData(op={}){
    		this.$xttp.post('house/add',op).then(res=>{
    			if(res.errorCode==0 && res.success==true){
    				this.$message('保存成功')
    				this.accessSave();
    			}else{
    				this.$message('请输入完整信息')
    			}
    		})
    	},
    	//保存添加
	    saveSubmit(){
	    	let sendData={
	    		"projectName":this.form.projectName,
	    		// "province":this.form.province,
	    		// "city":this.form.city,
	    		// "area":this.form.area,
	    		"address":this.form.address,
          'communityId':this.form.houseName[0],
	    		 "propId":this.name[0],
	    		// "contractId":"5ab5f4f4268a07d522c53649",
	    		// "propId":this.form.cusmoterValue,
	    		// "contractId":this.form.contactUntilValue,
	    		// "elevatorNumber":this.form.elevatorNumber
	    	}
	    	this.getData(sendData);
	    	
	    },
      handleAvatarSuccess(res, file){

      },
      handleRemove(){

      },
      //选择省份
      addressChange(){
      	
        for(let x = 0 ; x <this.addressData.length;x++){
        	
          if(this.addressData[x].name==this.form.addressValue){
          	console.log(1,this.addressData[x].name,2,this.form.addressValue)
               Object.assign({},this.areaList);
                Object.assign({},this.cityList);
                this.form.cityValue='';
                this.form.areaValue='';
                console.log(this.addressData[x])
              Object.assign(this.cityList,this.addressData[x].city)
              this.form.detailAddress=this.form.addressValue+this.form.cityValue+ this.form.areaValue;
             console.log(this.cityList)

          }

        }
      },
      //选择城市
      cityChange(){
      	console.log(88888)
          for(let x = 0; x <this.cityList.length;x++){
            console.log(this.cityList[x])
            if(this.cityList[x].name==this.form.cityValue){
              this.areaList=[]
              this.form.areaValue='';
               Object.assign(this.areaList,this.cityList[x].area)
                this.form.detailAddress=this.form.addressValue+this.form.cityValue+ this.form.areaValue;
               console.log(this.areaList)
            }
          }
      },
      //地图事件
      mapClick(val){
        this.form.addressValue = val.province;//省
        this.form.cityValue = val.city;//市
        this.form.areaValue = val.district;//区
        this.form.detailAddress = val.formattedAddress;//详细地址
      },
      mapComplete(val){
        
        this.form.addressValue = val.province;//省
        this.form.cityValue = val.city;//市
        this.form.areaValue = val.district;//区
        this.form.detailAddress = val.formattedAddress;//详细地址
      },
      initFormData(){
      	Object.assign(this.initData,this.form)
      },
    },
    watch:{
      show(newVal,oldVal){
      	
      	Object.assign(this.form,this.initData)
        if(newVal) {
          this.$store.commit('PUSHDIRECT',this.typeText)
          //初始化
           /*if (this.detail.name!=null) {
            this.form = JSON.parse(JSON.stringify(this.detail));
            this.addressSelect = [this.detail.province,this.detail.city,this.detail.area];
          }*/
          this.$nextTick(()=>{
            this.$refs.myMap.$emit('mapInit',{
              // disabled:(this.type !== 'add' && this.selfType !== 'edit'),
              initAddress: this.type === 'add' ? null : `${this.addressSelect.join('')}${this.form.address}`
            })
          })
          //初始化地址选择
          this.addressChange();
          this.cityChange();
        } else {
          this.$store.commit('POPDIRECT');

           
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
.title_message{
	height:30px;
}
  .page-add {
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
    .el-form-item__content {
      display: flex;
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

  .mapshow{
  	width:80%;
  	height:auto;
  	margin:0 auto;
  }

</style>
