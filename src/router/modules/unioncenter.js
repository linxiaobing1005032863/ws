const path =[
//数据统计
	/*{
    name:'datastatics',
    path: '/datastatics',
    component: (resolve) => require(["@/page/home/jobmangement/maintain/index"], resolve)
  },*/
  //终端管理
  {
    name:'endmangement',
    path: '/endmangement',
    component: (resolve) => require(["@/page/home/unioncenter/endmangement/index"], resolve)
  },
  //运行管理
  {
    name:'opereationmangement',
    path: '/opereationmangement',
    component: (resolve) => require(["@/page/home/unioncenter/operationmangement/index"], resolve)
  },
]
export default path