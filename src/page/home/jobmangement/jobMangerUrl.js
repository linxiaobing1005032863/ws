const maintainHttpUrl={//保养管理
	list:'/maintenance/list',
	detail:'/maintenance/',

},repairHttpUrl = {//维修管理
  list:'/declare/list',
  detail:'/declare/',//{id}/detail
  searchProject:'/house/list',//搜索项目
  searchBuild:'/build/list',//搜索楼栋
  searchWorkGroup:'/workGroup/list',//搜索班组
  dispatch:'/declare/sendFaultToSkillMan',//派工
  nearWorkGroup:'/workGroup/nearWorkGroup',//附近班组
  getUserLocation:'/userLocation/list',//获取用户位置
},
annualHttpUrl ={
	list:'/annualExamine/list'
}


export {maintainHttpUrl,repairHttpUrl,annualHttpUrl};
