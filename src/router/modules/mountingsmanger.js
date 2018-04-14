const path=[
 //配件管理
	{
		name:'mountingsmangements',
		path:'/mountingsmangements',
		component:(resolve) => require(["@/page/home/warehousemangement/mountingsmangements/index"], resolve)
	},

//订单中心
	{
		name:'taskmangement',
		path:'/taskmangement',
		component:(resolve) => require(["@/page/home/warehousemangement/taskmangement/index"], resolve)	
	}
]
export default path