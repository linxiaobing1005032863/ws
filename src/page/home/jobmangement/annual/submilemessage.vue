<template>
	<div class="submile" v-if='show'>
		<div>编辑</div>
		<el-form  label-width="150px" :model="form">
		  <el-form-item label="年检人员1：" >
		    <el-input v-model="form.firstName" :disabled="true" style="
		    width:200px;"></el-input>
		  </el-form-item>
		  <el-form-item label="年检人员2：" >
		    <el-input v-model="form.secondName" :disabled="true" style="
		    width:200px;"></el-input>
		  </el-form-item>
		  <el-form-item label="注册代码：">
		    <el-input v-model="form.regitCode" :disabled="true" style="
		    width:200px;"></el-input>
		  </el-form-item>
		   <el-form-item label="完成年检时间：">
		    <el-date-picker
		      v-model="value2"
		      align="right"
		      type="date"
		      placeholder="选择日期"
		      :picker-options="pickerOptions1">
		    </el-date-picker>
		  </el-form-item>
		   <el-form-item label="下次年检时间：">
		    <el-date-picker
		      v-model="value2"
		      align="right"
		      type="date"
		      placeholder="选择日期"
		      :picker-options="pickerOptions1">
		    </el-date-picker>
		  </el-form-item>

		   <el-form-item label="是否检查限速器：">
		   <el-checkbox label="" name="type"></el-checkbox>
		  </el-form-item>

		   <el-form-item label="年检合格标签">
		    <el-input v-model="form.regitCode"></el-input>
		  </el-form-item>
		</el-form>

		<div class="btn_div">
			<el-button type="primary">保存</el-button>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				
				form:{
					firstName:null,
					secondName:null,
					regitCode:null,
				},
				formLabelAlign:null,
				pickerOptions1:{
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
				 value2:'',
			}
		},
		props:{
			show:{
				default:false,
				type:Number
			},
		},
	}
</script>
<style lang="scss" scoped>
	.submile{
		width:100%;
		height:100%;
	}	
	.btn_div{
		width:100;
		
		margin:0 atuo;
		display:flex;
		justify-content:center;
	}
</style>