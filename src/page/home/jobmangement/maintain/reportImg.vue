<template>	
		<div class="imgwarp" v-if="imgShow" @click.self="close">	
				<div class="imgin">
					<p @click="close">	X</p>
					<img :src="imgUrl">
				</div>
				
		</div>
</template>
<script >
	export default{
		data(){
			return{
				imgUrl:null,
				imgShow:false,
			}
		},
		porps:{
			// imgShow:{
			// 	default:false,
			// }
		},
		methods:{
			close(){
				this.imgShow=false
			},
		}
	}
</script>
<style scoped lang="scss">
	.imgwarp{
		background: rgba(0,0,0,0.5);
		width:100%;
		height:100%;
		position:fixed;
		top:0;
		left:0;
		z-index:88;
		overflow:scroll;

		.imgin{
			width:450px;
			height:auto;
			margin:80px auto 40px auto;
			position:relative;
			p{
				display:block;
				width:30px;
				height:30px;
				line-height: 30px;
				font-size:30px;
				position:absolute;
				right:0;
				top:8px;
				cursor:pointer;
				text-align:center;

			}
			img{
				// background: white;
				display:block;
				width:100%;
				height:600px;
			}
		}
		
	}
</style>