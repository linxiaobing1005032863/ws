<template>
	<div class="operationwarp">
		<!-- 侧边栏 -->
		<leftlist @housesDetail="housesDetail" :list='list' @hiddenBtnDo="hiddenBtnDo"/>
		
		<div class="leaveList" :class="{showallwidth:showAllWidth}">
			<div class="liftdetail">
				<ul class="liftdetail_sum">
					<li v-for="(liftkey,liftindex) in messageDetailText">
						<div class="lift_name">
							{{liftkey.liftName}}
						</div>
						<div class="lift_img">
							<img src="./u9009.png">
							<p>{{liftkey.liftNumber}}</p>
						</div>
						<div class="lift_message">
							<p >电梯楼层&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >电梯状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >运行方向&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >梯门状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >电源状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >阻尼状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
						</div>
					</li>
				</ul>

				<ul class="liftdetail_sum">
					<li v-for="(liftkey,liftindex) in messageDetailText">
						<div class="lift_name">
							{{liftkey.liftName}}
						</div>
						<div class="lift_img">
							<img src="./u9009.png">
							<p>{{liftkey.liftNumber}}</p>
						</div>
						<div class="lift_message">
							<p >电梯楼层&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >电梯状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >运行方向&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >梯门状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >电源状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >阻尼状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
						</div>
					</li>
				</ul>

				<ul class="liftdetail_sum">
					<li v-for="(liftkey,liftindex) in messageDetailText">
						<div class="lift_name">
							{{liftkey.liftName}}
						</div>
						<div class="lift_img">
							<img src="./u9009.png">
							<p>{{liftkey.liftNumber}}</p>
						</div>
						<div class="lift_message">
							<p >电梯楼层&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >电梯状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >运行方向&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >梯门状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >电源状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
							<p >阻尼状态&nbsp;&nbsp;{{liftkey.statusDetail.flod}}</p>
						</div>
					</li>
				</ul>
				
			</div>
			<div class="c-block">
		      <el-pagination
		        @current-change="handleCurrentChange"
		        :current-page="currentPage"
		        :page-size="10"
		        layout="total, prev, pager, next, jumper"
		        :total="total">
		      </el-pagination>
   			 </div>
		</div>
	</div>
</template>
<script>
import leftlist from '@/components/leftlist/choseListSecond'
 import myDirect from '@/components/direct'
export default{
	data(){
		return{
			showAllWidth:false,
			list:[
				{title:"府兴物业",middletitle:['和谐警苑1','xxx楼盘1','xxx楼盘2']},
				{title:"府兴物业2",middletitle:['和谐警苑3','xxx楼盘4','xxx楼盘5']}
			],
			liftTitletext:['电梯楼层:','电梯状态:','运行方向','梯门状态:','电源状态:','阻尼状态:'],
			 currentPage:1,
       		 total:1,
       		messageDetailText:[
       		{liftName:'8888',liftNumber:'EV0010001',statusDetail:{flod:'不正常',status:'不正常',go:'上下',door:'不正常',power:'不正常',other:'不正常'}},
       		{liftName:'8888',liftNumber:'EV0010001',statusDetail:{flod:'不正常',status:'不正常',go:'上下',door:'不正常',power:'不正常',other:'不正常'}},
       		{liftName:'8888',liftNumber:'EV0010001',statusDetail:{flod:'不正常',status:'不正常',go:'上下',door:'不正常',power:'不正常',other:'不正常'}},
       		]
		}
	},
	components:{
		leftlist,
		myDirect,
	},
	methods:{
		//侧边栏方法
		housesDetail(arr){
			console.log(arr)
		},
		hiddenBtnDo(){
			console.log(6666)
				this.showAllWidth=this.showAllWidth==false?true:false;
				console.log(this.showAllWidth)
		},
		//分页方法
		 handleCurrentChange(){

      }
	},
	created(){

	},
	

}	
</script>
<style lang="scss" scoped>
	.operationwarp{
		width:100%;
		height:100%;
	}
	.leaveList{
		width:80%;
		height:100%;
		float:right;
	}

.operationwarp .showallwidth{
		width:100%;
	}
	.liftdetail{
		width:100%;
		height:90%;
		padding-top:20px;
		border-box:box-sizing;
	}

	.liftdetail_sum{
		width:95%;
		margin:0 auto;
		height:205px;
		margin-bottom:10px;
		display:flex;
		li{

			height:100%;
			width:33.3%;
			// min-width:276px;
			border:1px #666 solid;
			display:flex;
			.lift_name{
				border-right:1px #333 solid;
				height:100%;
				width:33%;
				text-align:left;
				line-height:205px;
				padding-left:5px;
				border-box:box-sizing;
			}
			.lift_img{
				width:34%;
				height:100%;
				img{
					width:100%;
					height:80%;
					display:block;

				}
				p{
					width:100%;
					height:20%;
					line-height:39px;
					text-align:center;
					font-size:15px;
				}

			}
			.lift_message{
				width:33%;
				height:100%;
				p{
					width:100%;
					text-align:center;
					font-size:12px;
					line-height:25px;
					white-space:nowrap;
					text-overflow:ellipsis;
					overflow:hidden;
				}
				p:nth-child(1){
					margin-top:6px;
				}
			}

		}
		li:nth-child(2){
			border-left:0px #333 solid ;
			border-right:0px #333 solid ;
		}
	}
	
</style>
