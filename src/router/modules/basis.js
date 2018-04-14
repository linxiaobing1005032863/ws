//基础管理
const path = [
  //合同管理
  {
    name:'contractManage',
    path: '/contractManage',
    props: true,
    component: () => import(/*webpackChunkName:"contractManageList"*/'@/page/home/basis/contractManage/list'),
    children:[
      //合同详情
      {
        name:'contractManageDetail',
        path:'/contractManage/detail',
        component: () => import('@/page/home/basis/contractManage/detail')
      }
    ]
  },
  //电梯管理
  {
    name:'certificateManage',
    path: '/certificateManage',
    component: (resolve) => require(["@/page/home/basis/certificateManage/list"], resolve)
  },
  //客户管理
  {
    name:'cusManage',
    path: '/cusManage',
    props: true,
    component: (resolve) => require(["@/page/home/basis/cusManage/list"], resolve)
  },
  //项目管理
  {
    path: '/projectManage',
    component: () => import(/*webpackChunkName:"projectManageList*/'@/page/home/basis/projectManage/list'),
  },
  //班组管理
  {
    name:'teamManage',
    path:'/teamManage',
    component: () => import(/*webpackChunkName:"teamManageList*/'@/page/home/basis/teamManage/list'),
    children:[
      //保养路线
      {
        name:'maintainLine',
        path:'/teamManage/maintainLine',
        props: true,
        component: () => import(/*webpackChunkName:"maintainLine*/'@/page/home/basis/teamManage/maintainLine'),
        children:[
          //新增保养路线
          {
            name:'editMaintainLine',
            path:'/teamManage/maintainLine/editMaintainLine',
            components: () => import(/*webpackChunkName:"editMaintainLine*/'@/page/home/basis/teamManage/editMaintainLine'),
          }
        ]
      }
    ]
  },
  //职工管理
  {
    name: 'employeeManage',
    path: '/employeeManage',
    props: true,
    component: () => import(/*webpackChunkName:"employeeManageList*/'@/page/home/basis/employeeManage/list'),
    children:[
      //职工新增
      {
        name:'employeeManageDetail',
        path:'/employeeManage/detail',
        component: () => import(/*webpackChunkName:"employeeManageDetail*/'@/page/home/basis/employeeManage/detail')
      },
      //保养计划
      {
        name:'maintainPlan',
        path:'/employeeManage/maintainPlan',
        component: () => import(/*webpackChunkName:"maintainPlan*/'@/page/home/basis/employeeManage/maintainPlan')
      }
    ]
  },
  //楼盘管理
  {
    name: 'bulidListManger',
    path: '/bulidListManger',
    component: (resolve) => require(["@/page/home/basis/buildMangers/list"], resolve)
  }
]

export default path;
