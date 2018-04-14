const cusHttpUrl = {
  //客户管理
    list:'/customer/list',
    add:'/customer/add',
    edit:'/customer/edit',
    searchProperty:'/property/searchForCustomer',//搜索添加客户关系
    applyRelations:'/customer/applyRelations',//申请绑定
  },
  contractHttpUrl = {
  //合同管理
    list:'/contract/list',
    detail:'/contract/',//{id}/detail
    add:'/contract/add',
    edit:'/contract/edit',
    searchCus:'/customer/list',//搜索客户
    searchProject:'/house/list',//搜索项目
    searchPosition:'/position/list',//搜索项目
    searchEmployee:'/employee/list',//搜索职工
    getProjectList:'/house/list',//合同关联的项目
    addEmployee:'/employee/add',//添加维保人员
    searchCommunity:'/community/page',//搜索楼栋
    addProject:'/house/add',//添加项目
  },
  certificateHttpUrl = {
  //电梯管理
    list:'/elevator/list',
    add:'/elevator/add',
    detail:'/elevator/',//详情
    edit:'/elevator/edit',//编辑
    addBrand:'/brand/list',//电梯品牌List
  },
  //项目管理
  projectHttpUrl = {
    list:'/house/list',//列表
    add:'/house/add',//添加
    export:'/house/export',//导出(不用)
    detail:'/house/',//详情
    contractDetail:'/contract/',//{id}/detail
    customer:'/customer/list',//模糊查询客户列表
    contractList:'/contract/list',//客户关联合同
    buildList:'/community/page',//楼栋楼盘列表
   classGround:"/workGroup/list",//班组管理
    classGroundEdit:'/house/workGroup/edit',//修改公办信息
  },
  //楼盘管理
   bulidMangerHttpUrl ={
    list:'/build/list',//楼栋列表
    add:'/build/add',//新增
    edit:'/build/edit',//编辑
    detail:'/build/',//编辑get(GET /v1/build/{id}/detail)
    communityList:'/community/page',//楼盘列表
    communityAdd:'/community/add',//楼盘列表新增
    communityEdit:'/community/edit',//楼盘编辑
    getDetail:'/community/',//获取详情
    deletes:'/community/',//获取详情
  },
  employeeHttpUrl = {
  //职工管理
    list:'/employee/list',
    add:'/employee/add',
    edit:'/employee/edit',
    detail:'/employee/',//{id}/detail
    searchWorkGroup:'/workGroup/list',//搜索班组
    searchHouse:'/house/list',//搜索项目
    searchPosition:'/position/list',//搜索项目
    getUserLocation:'/userLocation/list',//获取员工位置轨迹
    searchBrand:'/brand/list',//获取品牌列表
    getEmployeeLocation:'/employee/',//{userId}/location 获取员工当前位置
    maintainPlanList:'/maintenancePlan/list',//员工保养计划
  },
  teamHttpUrl = {
    add:'/workGroup/add',//增加班组
    edit:'/workGroup/edit',//编辑班组
    list:'/workGroup/list',//搜索班组
    detail:'/workGroup/',//获取分组详情 {id}/detail
    getNotWordGroup:'/workGroup/notWorkGroup',//获取未分组员工
    maintainPlanList:'/maintenancePlan/list',//员工保养计划
    searchProject:'/house/list',//搜索项目
  };


export {cusHttpUrl,contractHttpUrl,certificateHttpUrl,projectHttpUrl,employeeHttpUrl,bulidMangerHttpUrl,teamHttpUrl};

