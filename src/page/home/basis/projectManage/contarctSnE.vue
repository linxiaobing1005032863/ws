<template>
	<!-- 合同查看 -->
	<div class="contarct_show_edit" v-if="show==3">
		<div class="title_show">合同详情</div>
		<div class="form_show">
			 <el-form :model="form" ref="form" label-width="120px" class="demo-form" >
				<el-row>
				  <el-col :span="12">
				    <el-form-item label="合同编号:" required :inline="true">
				      <el-input v-model="showContractList.contractNum"  style="width:90%;" :disabled="disableds"></el-input>
				    </el-form-item>
				  </el-col>
				  <el-col :span="12" :inline="true">
				    <el-form-item label="合同类型:" required>
				     
				      <el-select v-model="contractType" placeholder="请选择类型" :disabled="disableds">
				          <el-option
				            v-for="(item,indexs) in contractTypeList" :key='indexs'
				             :label="item.label"
				            :value="item.label">
				          </el-option>
				       </el-select>
				    </el-form-item>
				  </el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
					  <el-form-item label="客户名称:" required :inline="true">
					   	<!-- <el-select v-model="showContractList.companyName" placeholder="请选择类型" :disabled="disableds" > -->
					   		<el-select v-model="showContractList.propCompanyName">	
					   	    <el-option
					   	      v-for="(item,indexs) in contractTypeList" :key='indexs'
					   	       :label="item.label"
					   	      :value="item.label">
					   	    </el-option>
					   	 </el-select>

					  </el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12" style="display:flex;">
					 	<el-form-item label="签约日期：" required :inline="true">
							<el-date-picker
				     	      v-model="showContractList.signDate"
				     	      align="right"
				     	      type="date"
				     	      placeholder="选择日期"
				     	      :picker-options="pickerOptions1"  :disabled="disableds">
				     	    </el-date-picker>	
						 </el-form-item>

						 <el-form-item label="结束日期：" required :inline="true">
							<el-date-picker
				     	      v-model="showContractList.endDate"
				     	      align="right"
				     	      type="date"
				     	      placeholder="选择日期"
				     	      :picker-options="pickerOptions1"  :disabled="disableds">
				     	    </el-date-picker>	
						 </el-form-item>
					</el-col>
				</el-row>
				<!-- 合同原件显示 -->
				<div class="imgshow" v-if='disableds'>
					<div class="leftTitle">合同原件：</div>
					<p v-for="(index,item) in showContractList.contractPath">{{index,item}}<img src="item"></p>
					
				</div>
				<!-- 合同原件上传 -->
				<el-row v-else>
					<el-col>
						<el-form-item label="上传合同原件：">
								<el-upload
								  action="https://jsonplaceholder.typicode.com/posts/"
								  list-type="picture-card"
								  :on-preview="handlePictureCardPreview"
								  :on-remove="handleRemove"
								  :auto-upload="false"
								  :on-exceed="exceedF"
								  :limit="2"
								  >
								  <i class="el-icon-plus"></i>
								</el-upload>
							<el-dialog :visible.sync="dialogVisible">
							  <img width="100%" :src="dialogImageUrl" alt="">
							</el-dialog>
						</el-form-item>	
					</el-col>
				</el-row>

				<el-row>
				  <el-col :span="12">
				    <el-form-item label="维保负责人:" required :inline="true">
				      <el-input v-model="showContractList.mainUserId"  style="width:90%;" :disabled="disableds"></el-input>
				    </el-form-item>
				  </el-col>
				  <el-col :span="12" :inline="true">
				    <el-form-item label="首次保养日期 :" required>
				     	<el-date-picker
				     	      v-model="showContractList.startDate"
				     	      align="right"
				     	      type="date"
				     	      placeholder="选择日期"
				     	      :picker-options="pickerOptions1"  :disabled="disableds">
				     	    </el-date-picker>
				      
				    </el-form-item>
				  </el-col>
				</el-row>	

				<el-row>
					<el-col :span="12">
					  <el-form-item label="项目名称:" required :inline="true">
					    <el-input v-model="projectName"  style="width:90%;" :disabled="disableds"></el-input>
					  </el-form-item>
					</el-col>
				</el-row>	
				
			 </el-form>

			 <div class="submitbtn">
			 	<button class="btn" :class="{saveBtn:buttonText=='保存'}" @click="btnClick">{{buttonText}}</button>
			 </div>
		</div>
	</div>
</template>
<script >
 import {projectHttpUrl} from '../httpUrl';
	export default{
		data(){
			return{
				buttonText:"编辑",
				disableds:true,
				custerName:" ",//合同名称
				contractType:'',//合同类型
				
				//项目名称
				form:{
					contractNum:"9999",
					signDate:"",
					propCompanyId:"",
					contractPath: [],//合同文件地址//合同原件
					maintenanceMode: 1,//保养类型 1：半包 2：全包 3：清包 ,
					startDate: new Date().getTime(),//服务开始日期
					endDate: new Date(new Date().getTime() + 31536000000).getTime(),//服务结束时间
					 mainUserId: null,//维保负责人
					  projectOption: [],//项目名称 下拉数据
					contractType:"",
					startData:"",
					endData:"",
					maintaindata:"",
				},
				contractTypeList:[{value:"选项1",label:"半包"},{value:"选项2",label:"全包"},{value:"选项3",label:"清包"}],
				disabled:false,
				//图片上传
				dialogImageUrl: '',
				dialogVisible: false,
				pickerOptions1: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					},
					shortcuts: [{
						text: '今天',
						onClick(picker) {
							picker.$emit('pick', new Date());
						}
					}, {
						text: '昨天',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24);
							picker.$emit('pick', date);
						}
					}, {
						text: '一周前',
						onClick(picker) {
							const date = new Date();
							date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', date);
						}
					}]
				},
				
			}
		},
		props:{
			show:{
				default:0,
				type:Number,
			},
			type:{
				default:"合同详情",
				type:String,
			},
			showContractList:{
				
				type:Object,
			},
			projectName:{
				default:" ",
				type:String,
			},
		},
		

		computed:{
			changeType(){
				return this.show
			}
		},
		watch:{
			changeType(newVal,oldVal){
				console.log(newVal,oldVal)
				if(newVal==3){
					
					Object.assign(this.form,this.showContractList)
					this.contractType =this.showContractList.maintenanceMode==1?"半包":this.showContractList.maintenanceMode==2?"全包":"清包"//赋值给合同类型显示
					this.custerName =this.showContractList.propCompanyId==null?"未知":this.showContractList.propCompanyId

					console.log(this.projectName)
					 this.$store.commit('PUSHDIRECT',"合同详情")
				}else if(oldVal==3){
						this.$store.commit('POPDIRECT');
				}
			},
		},
		methods:{
			btnClick(){
				let sendData={}
				sendData.id=this.showContractList.id;
				sendData.contractNum=this.showContractList.contractNum;
				sendData.maintenanceMode=this.contractType=="半包"?1:this.contractType=="全包"?2:3;
				sendData.signDate=this.showContractList.signDate;
				sendData.endDate=this.showContractList.endDate;
				sendData.startDate=this.showContractList.startDate;
				sendData.projectName=this.projectName;//项目负责人暂时不可以上传
				this.showContractList.mainUserId='5ab1bf944ee7d91054da9ae5'
				sendData.mainUserId=this.showContractList.mainUserId
				if(this.buttonText=="编辑"){
					this.buttonText="保存";

					this.disableds=false;
					
					

				}else{
					
					this.disableds=true;
					this.$xttp.post(projectHttpUrl.contractEdit,sendData).then(res=>{
						if(res.errorCode==0){
							this.$message("保存信息成功！")
							this.buttonText="编辑"
							this.$emit("contartDetailHide")
						}else{
							this.$message(res.errorMsg+",信息保存失败")
						}
					})

				}
			},
			/*
			*****@图片上传
			*/
			handleRemove(file, fileList) {
			        console.log(file, fileList);
			},
			handlePictureCardPreview(file) {
					console.log(file)
			        this.dialogImageUrl = file.url;
			        this.dialogVisible = true;
			 },
			 //图片超出
			 exceedF(){
			 	this.$message("最大上传2张！")
			 }
		},
		mounted(){},


	}
</script>
<style lang="scss" scoped>
	.contarct_show_edit{
		width:100%;
		height:100%;
	}
	.imgshow{
		width:100%;
		height:180px;
		display:flex;
		div{
			margin-left:40px;
		}
		p{
			width:100px;
			height:150px;
			margin-right:10px;
			img{
				display:block;
				height:100%;
				width:100%;

			}
		}
	}
	.submitbtn{
			width:100%;
			height:auto;
			margin-top:40px;
			.btn{
				display:block;
				width:100px;
				height:40px;
				line-height:40px;
				background:#f99c9c;	
				color:white;
				margin:0 auto;
				border-radius:4px 4px;
				-o-border-radius:4px 4px;
				-ms-border-radius:4px 4px;
				-moz-border-radius:4px 4px;
				-webkit-border-radius:4px 4px;
				cursor:pointer;
			}
			.editBtn{
				background:#f99c9c;	
			}
			.saveBtn{
				background:#409EFF;
			}
		}
</style>