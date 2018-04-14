<template>
	<!-- 楼栋添加 -->
	<div class="wap" v-if="showOrHidden==1||showOrHidden==2">
		<el-form :model="form" ref="form" label-width="120px" class="demo-form">
		  <div class="tit">基本信息</div>

		    <el-row>
		          <el-col :span="8">
		            <el-form-item label="楼盘名称:" required>
		              <el-input v-model="form.name" size="medium" :disabled="disableds"></el-input>
		            </el-form-item>
		          </el-col>
		          <el-col :span="8">
		            <el-form-item label="楼盘类型:" required >
		               <el-select v-model="form.communityType" placeholder="请选择类型" :disabled="disableds">
		                <el-option
		                  v-for="item in communityTypeSelect"
		                  :key="item.value"
		                  :label="item.labled"
		                  :value="item.value">
		                </el-option>
		              </el-select>
		            </el-form-item>
		          </el-col>
       		 </el-row>
       		 <!-- 选择地址 -->
       		 <el-form-item label="项目区域">
		           <el-select v-model="form.province" placeholder="请选择省" @change="addressChange()" :disabled="disableds">
		                  <el-option
		                    v-for="(item,indexs) in addressData" 
		                    :key='indexs'
		                     :label="item.name"
		                    :value="item.name">
		                  </el-option>
		             </el-select>

		             <el-select v-model="form.city" placeholder="请选择市" style="margin:0 5px;" @change="cityChange()"  :disabled="disableds">
		                  <el-option
		                    v-for="(item,indexs) in cityList" 
		                    :key='indexs'
		                     :label="item.name"
		                    :value="item.name">
		                  </el-option>
		             </el-select>

		             <el-select v-model="form.area" placeholder="请选择区"  :disabled="disableds">
		                  <el-option
		                    v-for="(item,indexs) in areaList" 
		                    :key='indexs'
		                     :label="item"
		                    :value="item">
		                  </el-option>
		             </el-select>
       			 </el-form-item>

       			  <el-form-item label="详细地址" required :inline="true">
            		  <el-input v-model="form.address" :disabled="disableds" style="width:90%;" ></el-input>
        		  </el-form-item>
        	  </el-form-item>

        	   <!-- 地圖 -->
        	  <div class="mapshow" >

        	  	<googMap ref="myMap" :disable="disableds" @click="mapClick" @complete="mapComplete"> </googMap>
        	  </div>

        	  	<div class="btn_some" v-if="showOrHidden==1">
        	  		<el-button type="primary" @click="addSubmit" style="display:block;margin:20px auto">保存</el-button>
        	  	</div>
        	  	<div class="btn_some"  v-else style="display:flex;justify-content:center;">
        	  		<div style="margin-right:20px;"><el-button :type="btnChange=='编辑'?'danger':'primary'" @click="edit" style="display:block;margin:20px auto">{{btnChange}}</el-button></div>
        	  		<div>
        	  			<el-button type="primary" @click="getBack" style="display:block;margin:20px auto" >返回</el-button>
        	  		</div>
        	  		
        	  		
        	  	</div>
        	   
		 </el-form>
	</div>
</template>
<script >
	import addressDatas from  '@/utils/addressData'
	import {bulidMangerHttpUrl} from '@/page/home/basis/httpUrl';
	import googMap from '@/components/map'
	export default{
		components:{googMap,},
		data(){
			return{
				id:null,//用于获取detail
				btnChange:"编辑",
				initForm:{},//初始化数据
				disableds:false,//状态为不可修改
				addressData:addressDatas,//省份
				 cityList:[],
        		areaList:[],//区
				form:{
					address:null, //(string): 详细地址 ,
					area:null, //(string): 区/县 ,
					buildNum:null, //(integer, optional): 楼栋数量 ,
					city:null, //(string): 城市 ,
					name:null, //(string, optional): 楼盘名称 ,
					communityType:null, //(integer, optional): 楼盘类型（1：写字楼 2：住宅楼 3：医院 4：学校 5：商场 ）默认1 ,
					liftNum:null, //(integer, optional): 电梯数量 ,
					propertyId:null, //(ObjectId, optional): 所属物业公司ID ,
					propertyName:null, //(string, optional): 所属物业公司名称 ,
					province:null, //(string): 省份 ,
					userNum:null, //(integer, optional): 住户数量
					//自定义的省市区值
					addressValue:'',//省
					cityValue:'',//市
					areaValue:'',//区
					detailAddress:"",//详细地址，
				},
				communityTypeSelect:[//楼盘类型
					{
						value:1,
						labled:"写字楼"
					},{
						value:2,
						labled:"住宅楼"
					},{
						value:3,
						labled:"医院"
					},{
						value:4,
						labled:"学校"
					},{
						value:5,
						labled:"商场"
					}
				],


			}
		},
		props:{
			showOrHidden:{
				default:0,
			},
		},
		/*computed:{
			showOrHidden(){
				return this.showOrHidden
			},
		},
		watch:{
			showOrHidden(newVal,oldVal){
				console.log(newVal)
				if(newVal==1){
					this.disableds=false;
				}
			},
		},*/
		mounted(){
			Object.assign(this.initForm,this.form);
		},
		methods:{
			getBack(){
				this.btnChange='编辑';
				this.$emit("addSuccess")
			},
			//编辑
			edit(){
				if(this.btnChange=="编辑"){
					this.btnChange="保存"
					this.disableds=false
				}else{
					
					
	        		this.$xttp.post(bulidMangerHttpUrl.communityEdit,this.form).then(res=>{
	        			if(res.errorCode==0){
	        				this.$message("新增成功");
	        				this.$emit("addSuccess")
	        				this.btnChange="编辑"
	        			}else{
	        				this.$message(res.errorMsg)
        			}
	        		})
				}
			},
			//新增保存
			addSubmit(){
				
        		this.$xttp.post(bulidMangerHttpUrl.communityAdd,this.form).then(res=>{
        			if(res.errorCode==0){
        				this.$message("新增成功");
        				this.$emit("addSuccess")
        			}else{
        				this.$message(res.errorMsg)
        			}
        		})
			},

			//选择省份
				addressChange(){
					
				  for(let x = 0 ; x <this.addressData.length;x++){
				  	
				    if(this.addressData[x].name==this.form.province){
				    	// console.log(1,this.addressData[x].name,2,this.form.addressValue)
				         Object.assign({},this.areaList);
				          Object.assign({},this.cityList);
				          this.form.city='';
				          this.form.area='';
				          console.log(this.addressData[x])
				        Object.assign(this.cityList,this.addressData[x].city)
				        // this.form.address=this.form.province+this.form.city+ this.form.area;
				       console.log(this.cityList)

				    }

				  }
				},
				//选择城市
				cityChange(){
					console.log(88888)
				    for(let x = 0; x <this.cityList.length;x++){
				      console.log(this.cityList[x])
				      if(this.cityList[x].name==this.form.city){
				        this.areaList=[]
				        this.form.areaValue='';
				         Object.assign(this.areaList,this.cityList[x].area)
				          // this.form.address=this.form.province+this.form.city+ this.form.area;
				         console.log(this.areaList)
				      }
				    }
				},

				//地图事件
				mapClick(val){
				  this.form.province = val.province;//省
				  this.form.city = val.city;//市
				  this.form.area = val.district;//区
				  this.form.address = val.formattedAddress;//详细地址
				},
				mapComplete(val){
				  console.log('Complete')
				  this.form.province = val.province;//省
				  this.form.city= val.city;//市
				  this.form.area = val.district;//区
				  this.form.address = val.formattedAddress;//详细地址
				},
		},
		updated(){

			
		},
		computed:{
			// showOrHidden(){
			// 	return this.showOrHidden
			// },	
		},
		watch:{
			showOrHidden(newVal,oldVal){
				Object.assign(this.form,this.initForm)
				let localdetailAddress=this.form.province+","+ this.form.city+","+this.form.area+','+this.form.address;
				if(newVal==1){
					this.$store.commit('PUSHDIRECT', "新增楼盘")
					this.disableds=false;
					
					try{
						this.$nextTick(() => {
							this.$refs.myMap.$emit('mapInit', {
								
								initAddress:localdetailAddress//`${this.addressSelect.join('')}${this.detailAddress}`
							})
						})
					}catch(e){
						this.$nextTick(() => {
							this.$refs.myMap.$emit('mapInit', {
								
								initAddress:`${this.addressSelect.join('')}${this.detailAddress}`
							})
						})
					}
					//初始化地址选择
				}else if(newVal==2){
					this.$xttp.get(bulidMangerHttpUrl.getDetail+this.id+"/detail").then(res=>{
						if(res.errorCode==0){
							Object.assign(this.form,res.data)
						}else{
							this.$message(res.errorMsg)
						}
					})
					this.disableds=true;

					this.$store.commit('PUSHDIRECT', "编辑楼盘")
					
					
					try{
						this.$nextTick(() => {
							this.$refs.myMap.$emit('mapInit', {
								
								initAddress:localdetailAddress//`${this.addressSelect.join('')}${this.detailAddress}`
							})
						})
					}catch(e){
						this.$nextTick(() => {
							this.$refs.myMap.$emit('mapInit', {
								
								initAddress:`${this.addressSelect.join('')}${this.detailAddress}`
							})
						})
					}
				}else if(newVal==0){
					 this.$store.commit('POPDIRECT');
				}
			}
		}
	}
</script>
<style lang="scss" scoped>
	.mapshow{
		margin-left:80px;
	}
	.btn_some{
		height:60px;
		width:100%;
	}
</style>
