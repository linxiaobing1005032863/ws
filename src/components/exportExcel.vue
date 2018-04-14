<template>
	<div>
		<button @click="export2Excel" class="exportBtn">导出</button>
	</div>
	
</template>
<script >
	import XLSX from 'xlsx'; 
	export default{
		props:{
			detailData:{
				type:Array,
				default:["88"],
			},
			headerTitle:{
				type:Array,
				default:[],
			},
			filterName:{
				type:Array,
				default:[],
			}
		},
		data(){
			return{
				list:[
				   
				 ]
			}
			
		},
		mounted(){/*this.flash();*/},
		created(){},
		methods:{
			formatJson(filterVal, jsonData) {
				console.log(jsonData)
			 　　　　return jsonData.map(v => filterVal.map(j => v[j]))
			 　　},
			 export2Excel() {
			 		if(this.detailData.length==0){
			 			this.$message("请选择导出数据！")
			 			return false;
			 		}
			 　　　　require.ensure([], () => {

			 　　　　　　const { export_json_to_excel } = require('@/vendor/Export2Excel');
			 　　　　　　//const tHeader = ['商品名称','商品货号','售价','库存','销量','分享',];//筛选的头部
			 　　　　　　//const filterVal = ['name', 'number', 'salePrice', 'stocknums', 'salesnums', 'sharenums', ];//帅选的json字段
						
			 			const tHeader =this.headerTitle
			 			const filterVal=this.filterName
			 			const list=[];
			  // 　　　　　　const list = this.detailData;
			  			Object.assign(list,this.detailData);
			  			console.log(list)
			 　　　　　　const data = this.formatJson(filterVal, list);
			 　　　　　　export_json_to_excel(tHeader, data, '商品管理列表');
			 　　　　})
			 　 }
		}
	}
</script>
<style lang="scss" scoped>
	.exportBtn{
		width:70px;
		height:39.6px;
		border:0 #000 solid;
		-o-border-raidus:4px 4px;
		-ms-border-radius:4px 4px;
		-webkit-border-radius:4px 4px;
		-moz-border-radius:4px 4px;
		background:#409EFF;
		color:white;
		font-family:"Simson";
		font-size:16px;
		margin:6px;
	}
</style>