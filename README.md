system_wlw（v1.0.0）
==================
---
>相关文档

>* [vue](https://cn.vuejs.org/v2/guide/instance.html)
>* [vue-router](https://router.vuejs.org/zh-cn/essentials/getting-started.html)
>* [vuex](https://vuex.vuejs.org/zh-cn/getting-started.html)
>* [vue-loader](https://vue-loader.vuejs.org/zh-cn/)
>* [vue-cli](https://github.com/vuejs/vue-cli/blob/dev/docs/README.md#introduction)

---
> 开发文件目录说明

## website

* .gitignore git黑名单
* .npmrc npm配置
* .babelrc babel配置
* package.json 项目配置
* index.html 项目入口

##### src

* components 组件

    + aside 菜单组件
    + direct 导航面包屑
    + header 页面头部
    + map 高德地图

* page

    + auth 登录模块


    + home 业务模块
        - basis 基础管理
        - jobmangement 作业管理

* router

    + index 
    + modules 管理模块路由配置

* store

    + index
    + modules 
      * data 菜单状态
      * permission 登录状态

* style

    + common 
    + cover-elementsui 重写element-ui样式
    + mixins 宏方法

* utils

    + validate 表单校验方法
    + addressdata 地址数据
    + citys 地址数据
    + oss 
    + request axios and interceptors
    + time 时间转换函数

* app  vue实例 模块布局

* main 入口


---
> 后台交互注意事项

约定数据返回格式：  

     {  
      	errorCode": 状态码,
    
      	"errorMsg": 状态码说明,
    
      	"data": 具体的数据，可以为空字符串或者null,
      
      	"success": 返回状态
    
    }

状态码说明：

    errorCode       msg
    
    0             success

---

> 项目开发

    npm run dev

> 项目大包

    npm run bulid


# 