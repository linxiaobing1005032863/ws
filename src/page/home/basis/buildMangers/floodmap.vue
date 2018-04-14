<template>
	<div class="warp" v-if="mapshow==1" @click.self='close'>
		<div class="map_in">
			<p class='close' @click="close">X</p>
			<div class="title">
				楼层对照表				
			</div>
			<div class="mapshow">
				<div class="list_heards">
					<p>物理楼层</p>
					<p>标示楼层</p>
				</div>
				<ul class="map_list">
					<li v-for="item in 30"><span>{{item}}</span><p><input type="text" maxlength="4"></p></li>
				</ul>
			</div>
			<div class="buttons">
				<button @click="canscolBtn()">取消</button>
				<button @click="saveBtn()">保存</button>
			</div>
		</div>
	</div>
</template>
<script>
	import {bulidMangerHttpUrl} from '../httpUrl';
	export default{
		data(){
			return{
				mapshow:0,
				id:null,
				floor:[],
			}
		},
		watch:{
			mapshow(newval,oldval){
				if(newval==1){
					this.$xttp.get(bulidMangerHttpUrl.detail+this.id+'/detail').then(res=>{
						if(res.errorCode ==0){
							console.log(res)
						}
					})
				}
			},

		},
		methods:{
			canscolBtn(){
				this.mapshow=false;
			},
			saveBtn(){},
			//关闭
			close(){
				this.mapshow=false;
			}
		}
	}
</script>
<style lang="scss" scoped>
	.warp{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:rgba(0,0,0,0.5);
		z-index:9999;

	}

	.map_in{
		width:370px;
		height:457px;
		margin:60px auto 0 auto;
		position:relative;
		background:white;
		border-radius:4px 4px;
		-o-border-radius:4px 4px;
		-ms-border-radius:4px 4px;
		-moz-border-radius:4px 4px;
		-webkit-border-radius:4px 4px;
	}

	.close{
		width:20px;
		height:20px;
		line-height:20px;
		text-align:center;
		position:absolute;
		position:absolute;
		right:6px;
		top:10px;
		cursor:pointer;
	}

	.title{
		width:100%;
		height:44px;
		line-height:44px;
		font-size:20px;
		background:#c4e0f7;
		padding-left:20px;
		 -o-border-box:box-sizing;
		 -ms-border-box:box-sizing;
		 -moz-border-box:box-sizing;
		 -webkit-border-box:box-sizing;


	}

	.mapshow{
		width:288px;
		height:312px;
		margin:0 auto;
		// padding:0 0px 0 0;
		// -o-border-box:box-sizing;
		// -ms-border-box:box-sizing;
		// -moz-border-box:box-sizing;
		// -webkit-border-box:box-sizing;
		border:1px #c4e0f7 solid;
		margin-top:10px;
		.list_heards{
			width:100%;
			height:36px;
			display:flex;
			background:#efefef;
			p{
				flex:1;
				height:100%;
				line-height:36px;
				text-align:center;
				font-size:14px;

			}
			p:nth-child(1){
				border-right:1px #c4e0f7 solid;
			}
		}
		.map_list{
			height:276px;
			width:100%;
			overflow:auto;
			li{
				height:36px;
				line-height:36px;
				border-top:1px #c4e0f7 solid;
				border-bottom:1px #c4e0f7 solid;
				display:flex;
				font-size:13px;
				span{
					display:block;
					flex:1;
					height:100%;
					line-height:36px;
					border-right:1px #c4e0f7 solid;
					text-align:center;
				}
				p{
					height:100%;
					flex:1;
					input{
						width:99px;
						height:25px;
						display:block;
						margin:4px auto 0 ;
						text-align:center;
						border:1px #ddd solid;

					}
				}
			}
		}
	}

	.buttons{
		height:33px;
		width:100%;
		display:flex;
		margin-top:10px;
		justify-content:center;
		button{
			display:block;
			width:78px;
			height:33px;
			margin-right:10px;
			border-radius:4px 4px;
			-o-border-radius:4px 4px;
			-ms-border-radius:4px 4px;
			-moz-border-radius:4px 4px;
			-webkit-border-radius:4px 4px;
			background:#409EFF;
			color:white;
		}

	}


</style>