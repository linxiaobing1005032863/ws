<template>
	<!--小区选择 -->
	<div class="listleft" :class="{listleft_hidden:hiddenAll}">
		<div class="listleft_header" >楼盘目录</div>
		<ul class="listleft_ul">
			<li v-for='(key,index) in list' class="listleft_title liftLeftement">
				<div class="chosetenement" @click="enementDetail(key,index)">{{key.title}}</div>
				<ul :class="{listleft_title_in:hidden[index]}">
					<li v-for="(middkey,midindex) in key.middletitle" @click="housesShow(middkey,midindex)" :class="{chosecolor:choseliText==middkey}" class="liftLeftement">{{middkey}}</li>		
				</ul>
			</li>
		</ul>
		<div class="hidden_show_btn" @click="hiddenBtn" :class="{hidden_btn_right:hiddenAll}">{{hiddenShowText}}</div>
	</div>
</template>
<script>
export default{
	data(){
		return{
			//楼层显示隐藏
			hidden:[],
			hiddenShowText:"<<",
			//整个list隐藏
			hiddenAll:false,
			choseliText:"",
			enementIndex:null,
		}
	},
	props:{
		list:{
			type:Array,
			default:[],
		}
	},
	methods:{
		//点击物业
		enementDetail(key,index){
			
			let showHide=this.hidden[index]==false?true:false;
			this.hidden.splice(index,1,showHide)
			this.enementIndex=index;
		},
		//点击楼盘详情
		housesShow(middkey,midindex){
			//#409EFF
			this.choseliText=middkey;
			console.log(this.choseliText,this.enementIndex)
			this.$emit("housesDetail",[middkey,midindex])
		},
		hiddenBtn(){
			
			this.hiddenAll=this.hiddenAll==false?true:false;
			this.hiddenShowText=this.hiddenAll==false?"<<":">>";
			this.$emit("hiddenBtnDo","")
			
		}
	},
	created(){
		for(let x =  0; x<this.list.length;x++){
			this.hidden.push(true)
		}
	},
	

}	
</script>
<style lang="scss" scoped>
	.listleft{
		height:100%;
		width:20%;
		// height:auto;
		background:#999;
		float:left;
		position:relative;
	}
	.listleft_header{
		overflow:hidden;
		padding-left:10px;
		margin-top:10px;
		margin-bottom:10px;
		border-box:box-sizing;
	}
	.listleft_title div{
		width:100%;
		text-align:left;
		cursor:pointer;
		overflow:hidden;
	}
	.listleft_ul{
		overflow:hidden;
		padding-left:30px;
		border-box:box-sizing;
	}
	.listleft_ul ul{
		padding-left:30px;
		border-box:box-sizing;
	}
	.listleft_ul ul li{
		cursor:pointer;

	}
	.liftLeftement{
		color:#444;
	}

	.listleft_ul ul .chosecolor{
		color:#409EFF;
	}
	.listleft_title_in{
		height:0;
		overflow:hidden;
	}


	.hidden_show_btn{
		width:20px;
		height:40px;
		text-align:center;
		line-height:40px;
		font-family:'Simsun';
		font-weight:bold;
		position:absolute;
		top:300px;
		left:0;
		background:#ddd;
		font-size:14px;
		border-radius:0px 4px 4px 0px;
		-webkit-border-radius:0px 4px 4px 0px;
		-mos-border-radius:0px 4px 4px 0px;
		-ms-border-radius:0px 4px 4px 0px;
		-o-border-radius:0px 4px 4px 0px;
		cursor:pointer;

	}

	.listleft .hidden_btn_right{
		right:-20px;
	}
	
	.listleft_hidden{
		width:0;
		height:0;
		
	}
</style>