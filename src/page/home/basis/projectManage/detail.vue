<template>
	<div class="detail_message" v-if="show==2">
		<div class="detail_title">基本信息</div>
		<ul class="detail_list">
			<li>
				<p><span>项目名称:</span>{{showList.houseName}}</p>
				<p><span>项目类型:</span>{{showList.typeName}}</p>
			</li>
			<li><p><span>项目区域:</span>{{showList.province}}</p></li>
			<li><p><span>详细地址:</span>{{showList.province}}{{showList.city}}{{showList.area}}{{showList.address}}</p></li>
			<li class="map_show" style="width:">
				<googMap ref="myMap" > </googMap>
			</li>
		</ul>
		<!-- 维保信息 -->
		<div class="detail_title">维保信息</div>
		<ul class="detail_list">
			<li>
				<p><span>客户名称:</span>{{showList.propName}}</p>
				<p><span>关联合同编号:</span>{{showList.propName}}</p>
			</li>
			<li>
				<p><span>电梯数:</span>{{showList.elevatorNumber}}</p>
				<p><span>在保电梯数:</span></p>
			</li>
			<li>
				<p><span>维保负责人:</span>{{ showList.principal== null?"无":showList.principal.name}}</p>
				
			</li>
			<li>
				<p><span>服务开始时间:</span>{{new Date(showList.startDate).toLocaleDateString().replace(/\//g,'-') }}</p>
				<p><span>服务结束时间:</span>{{new Date(showList.endDate).toLocaleDateString().replace(/\//g,'-') }}</p>
				
			</li>
		</ul>
		<div class="back"><button class="back_btn" @click="backBtn">返回</button></div>
	</div>
</template>
<script >
	import googMap from '@/components/map'
	import {projectHttpUrl} from '../httpUrl';
	export default{
		components:{
			googMap,
		},
		data(){
			return{
				addressSelect:['广东省', '广州市', '天河区'],
				detailAddress:'科韵路98号',
		
				
			}
		},
		props:{
			show:{
				default:1,
			},
			 type: {
		        type: String,
		        default: 'Object',//add edit see
		      },
		      detailId:{
		      	type:String,
		      },
		      showList:{
		      	type:Object,
		      	defalut:{}
		      }
			
		},
		methods:{
			backBtn(){
				this.$emit("detailBack")
			},
			// //获取详情后台数据
			// getData(){
			// 	this.$xttp.get(projectHttpUrl.detail+this.detailId+'/detail').then(res=>{
			// 		if(res.errorCode==0){
			// 			Object.assign(this.showList,res.data)

			// 		}
					
			// 	})
			// }
			
		},
		mounted(){

		},
		created(){

		},
		computed:{
			typeText(){
		          return this.type === 'add' ? '新增' : '';
		     },
		     disabled(){
        		// return this.type === 'see'
     		 }
		},
		watch: {
			show(newVal,oldVal) {
				console.log("新",newVal,"旧",oldVal)
				let localdetailAddress=this.showList.province+","+ this.showList.city+","+this.showList.area+','+this.showList.address;
				
				if (newVal==2) {
					// if(newVal==2){
					// 	this.getData();
					// }
					this.$store.commit('PUSHDIRECT', "项目详情")
					
					
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
					
				} else if(oldVal==2){
					this.$store.commit('POPDIRECT');
				}
			},
		},
	}
</script>
<style lang="scss" scoped>
	.detail_message{
		width:100%;
		height:100%;
		padding:10px 0 10px 12px;
		border-box:box-sizing; 
		.detail_title{
			margin:10px 0;
			height:30px;
			line-height:30px;width:80%;
			margin:0 auto;
		}
		.detail_list{
			width:80%;
			margin:0 auto;
			height:auto;
			li{
				padding-left:70px;
				border-box:box-sizing;
				display:flex;
				height:26px;
				line-height:26px;
				font-size:16px;
				p{
					width:100%;
					flex:1;
					display:flex;
					span{
						display:block;
						height:100%;
						width:120px;
						text-align:right;
						margin-right:8px;
					}
				}
			}
			.map_show{
				width:100%;
				over-flow:hidden;
				height:351px;
				padding-left:120px;
				border-box:box-sizing;
			}
		}
		.back{
			width:100%;
			height:auto;
			margin-top:40px;
			.back_btn{
				display:block;
				width:100px;
				height:40px;
				line-height:40px;
				background:#409EFF;
				color:white;
				margin:0 auto;
				border-radius:4px 4px;
				-o-border-radius:4px 4px;
				-ms-border-radius:4px 4px;
				-moz-border-radius:4px 4px;
				-webkit-border-radius:4px 4px;
				cursor:pointer;
			}
		}
	}
</style>