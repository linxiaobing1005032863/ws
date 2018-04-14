<template>
	<div class="workergroundwarp" @click.self="hidden" v-if="hiddenType">
		<div class="workerin">
			<div class="worker_title">选择班组<p @click="hidden">X</p></div>
			<div class="chose" style="z-index:99999;">
				<el-select
				   v-model="classValue"
				   multiple
				    filterable
				   remote

				   reserve-keyword
				   placeholder="请输入班组"
				   :remote-method="remoteSearch"
				   :loading="loading" @change="changes">
				   <el-option
				     v-for="item in options"
				     :key="item.id"
				     :label="item.teamName"
				     :value="item.id">
				   </el-option>
				 </el-select>
				<el-button @click="enSure">确认</el-button>				
			</div>
			<div class="leadername">
				<p class="leader_title">班组长</p>
				<p class="leaderdetail"><span>{{form.groupHeadName}}</span>&nbsp;&nbsp;<span>{{form.groupHeadPhone}}</span></p>
			</div>
			<div class="leadername">
				<p class="leader_title">{{groundName}}</p>
			</div>	
			<ul class="ground_all">
				<li v-for="(item,index) in member"><span>{{item.userName}}</span>&nbsp;&nbsp;<span>{{item.mobile}}</span></li>	
			</ul>
		</div>
	</div>
</template>
<script >
	import {projectHttpUrl} from '@/page/home/basis/httpUrl';
	export default{
		data(){
			return{
				// id:null,
				list: [],
				options: [],
		      	classValue:null,
		      	// selectedOptions2:[],
		      	leaderName:null,	
		      	leaderPhone:null,
		      	groundName:"1组",
		      	member:[],
		      	loading:false,
		      	currentPage:1,
		      	size:10,

		      	form:{
		      		groupHeadName:null,
		      		groupHeadPhone:null,
		      		groupMembers:[],

		      	}
			}
		},
		props:{
				hiddenType:{
					default:false,
					type:Boolean,
				},
				id:{
					default:null,
					type:String,
				}
		},
		
		methods:{
			//远程获取
			remoteSearch(query){
				console.log(query)
				if (query !== '') {
					this.loading = true;
					this.$xttp.post(projectHttpUrl.classGround,{page:this.currentPage,size:10,groupName:query}).then(res=>{
						
						console.log(res)
						if(res.errorCode==0){
							
							this.options=res.data.records
							
							// this.
						}else{
							this.$message(res.errorMsg)
						}
						this.loading = false;
					})
					
				} else {
					this.options = [];
				}
			},
			hidden(){
				// this.hiddenType=this.hiddenType==false?true:false;
				this.$emit("toHidden",{value:this.hiddenType})
			},
			 handleChange(value) {
		        console.log(value);
		      },
		     enSure(){
		      	this.$xttp.post(projectHttpUrl.classGroundEdit,{id:this.id,workGroupId:this.form.teamId}).then(res=>{
		      		if(res.errorCode ==0){
		      			this.$message('保存成功');
		      			this.$emit("enSureGround","")
		      		}else{
		      			this.$message('errorMsg ');
		      			this.$emit("enSureGround","")
		      		}
		      	})
		      	
		     },
		     changes(){
		     	console.log(99999999999)
		     	this.member=[];
		     	this.form={
		     		groupHeadName:null,
		      		groupHeadPhone:null,
		      		groupMembers:[],
		     	}
		     	console.log(this.classValue,this.options)
		     	for(let x = 0 ; x <this.options.length;x++){
		     		if(this.options[x].id==this.classValue[0]){
		     			try{
		     			Object.assign(this.form,this.options[x])
		     			Object.assign(this.member,this.options[x].groupMembers)
		     			this.form.groupHeadName=this.option[x].groupHeadName
		     		}catch(res){

		     		}
		     			// this.form.groupHeadPhone=this.option[x].groupHeadPhone
		     			// Object.assign(this.form,this.options[x])
		     			// console.log(this.form)

		     			// this.leaderName=this.options[x].groupHeadName;
		     			// this.leaderPhone=this.this.options[x].groupHeadPhone;
		     		}
		     	}

		     }

		},
		updated(){
			

			
		},
	}
</script>
<style lang="scss" scoped>
	.workergroundwarp{
		width:100%;
		height:100%;
		background:rgba(0,0,0,0.5);
		position:fixed;
		top:0;
		left:0;
		z-index:9;


	}
	.workerin{
		width:340px;
		min-height:261px;
		background:#f1f1f1;
		border-radius:8px 8px;
		-o-border-radius:8px 8px;
		-ms-border-radius:8px 8px;
		-moz-border-radius:8px 8px;
		-webkit-border-radius:8px 8px;
		margin:180px auto 0 auto;
		padding-bottom:10px;
		box-sizing:border-box;
		-o-box-sizing:border-box;
		-ms-box-sizing:border-box;
		-moz-box-sizing:border-box;
		-webkit-box-sizing:border-box;
	}
	.worker_title{
		width:100%;
		height:42px;
		line-height:42px;
		text-align:center;
		background:black;
		border-radius:8px 8px 0 0;
		-o-border-radius:8px 8px 0 0;
		-ms-border-radius:8px 8px 0 0;
		-moz-border-radius:8px 8px 0 0;
		-webkit-border-radius:8px 8px 0 0;

		color:white;
		p{
			display:block;
			float:right;
			color:white;
			height:42px;
			width:42px;
			cursor:pointer;
			
		}
	}
	.chose{
		padding:10px 0 0 20px;
		box-sizing:border-box;
		-o-box-sizing:border-box;
		-ms-box-sizing:border-box;
		-moz-box-sizing:border-box;
		-webkit-box-sizing:border-box;

	}
	.leadername{
		margin:10px 0 10px 0;
		padding:0 0 0 20px;
		box-sizing:border-box;
		-o-box-sizing:border-box;
		-ms-box-sizing:border-box;
		-moz-box-sizing:border-box;
		-webkit-box-sizing:border-box;
		p{
			

		}
		.leaderdetail{
			font-size:15px;
			height:25px;
			line-height:25px;
			padding-left:20px;
			-o-box-sizing:border-box;
			-ms-box-sizing:border-box;
			-moz-box-sizing:border-box;
			-webkit-box-sizing:border-box;
		}

	}

	.ground_all{
			padding:0 0 0 20px;
			box-sizing:border-box;
			-o-box-sizing:border-box;
			-ms-box-sizing:border-box;
			-moz-box-sizing:border-box;
			-webkit-box-sizing:border-box;
		}
		.ground_all li{
			font-size:15px;
			height:25px;
			line-height:25px;
			padding-left:20px;
			-o-box-sizing:border-box;
			-ms-box-sizing:border-box;
			-moz-box-sizing:border-box;
			-webkit-box-sizing:border-box;
			display:flex;
			span{
				display:block;
				
				width:80px;
			}
		}
</style>