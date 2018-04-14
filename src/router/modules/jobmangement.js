const path = [
  //保养管理
  {
    name:'maintaintManage',
    path: '/maintaintManage',
    component: (resolve) => require(["@/page/home/jobmangement/maintain/index"], resolve)
  },
  //年检管理
  {
    name:'annualManage',
    path: '/annualManage',
   component: (resolve) => require(["@/page/home/jobmangement/annual/index"], resolve)
  },
  //维修管理
  {
    name:'repairManage',
    path: '/repairManage',
    component: (resolve) => require(["@/page/home/jobmangement/repair/list"], resolve)
  }

]

export default path;
