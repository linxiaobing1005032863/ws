<template>
	<el-main>
		<div class="warp">
			<!-- 新增详情 -->
			<add ref="addM" ></add>
			<!-- 楼层对照表 -->
			<floodMap ref="flooldM"></floodMap>
			<!-- 操作部分开始 -->
			 <el-form :inline="true" :model="form" class="demo-form-inline">
			 	 <el-form-item > 
			 	 	<el-input v-model="form.buildName"></el-input>
           			
         		 </el-form-item>

         		 <el-form-item > 
         		  <el-button type="primary" @click="goSearch" class="flex"><i class="iconfont icon-sousuo">&nbsp;</i>搜索</el-button>
         		  </el-form-item>

         		  <el-form-item > 
         		  <el-button type="primary" @click="goSearch" class="flex"><i class="iconfont ">&nbsp;</i>导入</el-button>
         		  </el-form-item>
         		  <el-button type="primary" @click="add" class="flex"><i >&nbsp;</i>新增</el-button>
         		  </el-form-item>
			 </el-form>
			 <!-- 操作部分结束 -->
			 <!-- 表格开始 -->
			 <div class="tableshow">
			 	<el-table :data="list" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" tooltip-effect="dark" >
			 		<el-table-column label="楼栋名" :show-overflow-tooltip="true" align="center" >
			 		  <template slot-scope="scope"  >{{ scope.row.name  }}</template>
			 		</el-table-column>
			 		<el-table-column label="地上建筑层数" :show-overflow-tooltip="true" align="center" >
			 		  <template slot-scope="scope"  >{{ scope.row.upFloorNum }}</template>
			 		</el-table-column>
			 		<el-table-column label="地下建筑层数" :show-overflow-tooltip="true" align="center" >
			 		  <template slot-scope="scope"  >{{ scope.row.downFloorNum }}</template>
			 		</el-table-column>
			 		<el-table-column label="楼层总数" :show-overflow-tooltip="true" align="center" >
			 		  <template slot-scope="scope"  >{{ scope.row.downFloorNum+ scope.row.upFloorNum}}</template>
			 		</el-table-column>

			 		 <el-table-column label="楼层对照表" width="150" fixed="right">
			          <template slot-scope="scope">
			            <el-button @click="toFloodMap(scope.row)" type="primary" size="small">楼层对照表</el-button>

			            
			          </template>
        </el-table-column>
			 	</el-table> 
			 	<!-- 分页开始 -->
			 	<el-pagination
			 	  @current-change="handleCurrentChange"
			 	  :current-page="currentPage"
			 	  :page-size="size"
			 	  layout="total, prev, pager, next, jumper"
			 	  :total="total">
			 	</el-pagination>
			 	<!-- 分页结束 -->
			 </div>
			 <!-- 表格结束 -->
		</div>
	</el-main>
</template>

<script >
	import {bulidMangerHttpUrl} from '../httpUrl';
	import {filterParams} from '../process';
  	import myDirect from '@/components/direct';
  	import add from '@/page/home/basis/buildMangers/buildmangeradd'
  	import floodMap from '@/page/home/basis/buildMangers/floodmap'

  	export default{
  		components:{add,floodMap},
  		data(){
  			return{
  				form:{
  					endTime:null, //(integer, optional): 创建时间 结束时间 ,
  					communityId:null, //(ObjectId, optional): 楼盘id ,
  					communityName:null, //(ObjectId, optional): 楼盘名称 ,
  					buildName:null,
  					page:null, //(integer, optional): 页码 ,
  					size:null, //(integer, optional): 每页所包含的条数 ,
  					startTime:null, //(integer, optional): 创建时间 开始时间
  				},
  				currentPage: 1,//当前页码
  				total: 1,//总数
  				size: 10,//总页数
  				loading: false,//列表加载loading
  				list:[],
  				id:null,
  			}
  		},
  		watch:{
  			id(newVal,oldVal){
  				if(newVal){
  					this.form.communityId=this.id
  					this.getData()
  					// this.id=null;

  				}
  			},
  		},
  		methods:{
  			//楼层对照表
  			toFloodMap(val){

  				this.$refs.flooldM.mapshow=true;
  				this.$refs.flooldM.id = val.id;
  			},
  			add(val){
  				this.$refs.addM.show=true;
  				this.$refs.addM.form.id=this.id;
  				
  			},
  			//搜索
  				goSearch(){
  					this.getData({communityId:this.id})
  				},
  			/**
	       * @description 换页
	       * @param currentPage
	       */
		      handleCurrentChange(currentPage){
		        this.currentPage = currentPage;
		        // this.get();
		      },
		      //选择条目选择并对数据进行帅选导出
		       handleSelectionChange(val) {

		       },
		       //获取页面数据
		       getData(op={}){
					this.loading = true;
					this.$xttp.post(bulidMangerHttpUrl.list, Object.assign({
						page: this.currentPage,
						size: this.size,
					}, filterParams(this.form),op)).then(res => {
						if (!res['errorCode']) {
							console.log(res)

							this.list = res['data'].records;
							this.total = res['data'].total;
							this.loading = false;
						} else {
							this.loading = false;
						}
					}).catch(err => this.loading = false)
		       },

  		},
  		// mounted(){this.getData()},
  		updated(){},


  	}
</script>
<style >
	.warp{
		width:100%;
		height:100%;
	}
	.isflex{
		display:flex;
	}

</style>