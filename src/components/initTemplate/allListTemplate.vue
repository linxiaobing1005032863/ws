<template>
  <el-main>
    <my-direct @click="handleDirectClick"></my-direct>
    
    <!-- 楼栋管理 -->
    <!-- <buildManger></buildManger> -->
    <!--form开始输入框-->
    <div  class="page-list">
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <!-- 省份 -->
           <el-select v-model="addressValue" placeholder="请选择省份" @change="addressChange()">
            <el-option
              v-for="(item,key) in addressData"
              :key="key"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <!-- 城市 -->
           <el-select v-model="cityValue" placeholder="请选择城市" @change="cityChange()">
            <el-option
              v-for="(items,keys) in cityList"
              :key="keys"
              :label="items.name"
              :value="items.name">
            </el-option>
          </el-select>
          <!-- 区 -->
          <el-select v-model="areaValue" placeholder="请选择区域">
            <el-option
              v-for="(itema,keya) in areaList"
              :key="keya"
              :label="itema"
              :value="itema">
            </el-option>
          </el-select>
         
          <!-- 项目名称 -->
          <el-input v-model="BuildName" placeholder="楼盘名称"></el-input>
          

          <el-form-item>
            <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
          </el-form-item>

        </el-form>
     
        <el-button type="primary" class="c-addBtn" @click="add">新增</el-button>

      </div>
      <!--form输入结束-->

      <!-- 表格开始 -->
      <el-table :data="list" style="width: 100%" v-loading="loading"  tooltip-effect="dark" >
      
        <el-table-column label="楼盘名称" :show-overflow-tooltip="true" width="110" align="center">
          <el-button type="text" slot-scope="scope" style="color:black;" >{{scope.row.houseName}}</el-button>
        </el-table-column>
        <el-table-column label="项目类型" :show-overflow-tooltip="true" align="center" >
          <template slot-scope="scope"  >{{ scope.row.propName }}</template>
        </el-table-column>

        <el-table-column label="项目区域" :show-overflow-tooltip="true" align="center" width="100" >
          <el-button slot-scope="scope" type="text" style="color:blue;">{{ scope.row.contractNum }}</el-button>
        </el-table-column>

        <el-table-column label="项目类型" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope" >{{ scope.row.typeName }}</template>
        </el-table-column>

        <el-table-column label="项目区域" :show-overflow-tooltip="true" align="center" width="80">
          <template slot-scope="scope">{{ scope.row.area }}</template>
        </el-table-column>

        <el-table-column label="详细地址" :show-overflow-tooltip="true" align="center" width="260">
          <template slot-scope="scope">{{ scope.row.province+scope.row.city+scope.row.area+scope.row.address}}</template>
        </el-table-column>

       

        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button @click="buildMangerDetail(scope.row)" type="primary" size="small" style="margin-left:30px;">管理楼栋</el-button>
          </template>
        </el-table-column>
      </el-table> 

      <!-- 表格结束 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="size"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 群组管理 -->
  
  </el-main>
</template>
<script>
  import {projectHttpUrl} from '../httpUrl';
  import myDirect from '@/components/direct';
  import addressDatas from  '@/utils/addressData'
 
 

  export default {
    name: 'contractManage',
    components: {myDirect,},
    data(){
      return {
        BuildName:null,
        list:[],
        form: {
          name: ''
        },
        currentPage: 1,//当前页码
        total: 1,//总数
        size: 10,//总页数
        loading: false,//列表加载loading
        addressData:addressDatas,//省份
        addressValue:'',//
        cityValue:'',//城市
        cityList:[],
        areaList:[],//区
        areaValue:'',        
         timeout:null,    
      }
    },
    watch:{
      //侦听显示电梯管理显示
      
    },
    methods: {
     
      //楼栋管理
     buildMangerDetail(){},
   
       /**
       * @description 新增
       */
      
      add(){},
      
       handleSelect(item) {
               console.log(item);
       },
       //导出（不用）
    
    
    
      /**
       * @description 查找
       */
      find(){
        let sendDataList={}
        sendDataList={
          area:this.areaValue,
          city:this.cityValue,//城市
          province:this.addressValue,//区域
          propName:this.customerValue,
       
        }
        this.get(sendDataList)
      },
      
      //选择条目选择并对数据进行帅选导出
   
      //选择省份
      addressChange(){
        for(let x = 0 ; x <this.addressData.length;x++){
          if(this.addressData[x].name==this.addressValue){
               Object.assign({},this.areaList);
                Object.assign({},this.cityList);
                this.cityValue='';
                this.areaValue='';
              Object.assign(this.cityList,this.addressData[x].city)
            

          }

        }
      },
      //选择城市
      cityChange(){
          for(let x = 0; x <this.cityList.length;x++){
           
            if(this.cityList[x].name==this.cityValue){
              this.areaList=[]
              this.areaValue='';
               Object.assign(this.areaList,this.cityList[x].area)
              
            }
          }
      },
      /**
       * @description 换页
       * @param currentPage
       */
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.get();
      },
    
      //顶部导航栏事件
      handleDirectClick(){

      },
      //远程获取数据
      async get(op = {}){
        this.$xttp.post(projectHttpUrl.list,Object.assign({
          page:this.currentPage,
          size:this.size,
        },op)).then(res=>{
         
          if (!res.errorCode) {

            this.list = res['data'].records;
            // Object.assign(this.list,res.data.records)
          
            this.total = res['data'].total;
             
          }
        })
      }
    },
    mounted(){
     
      
        this.get({})
        
    },
    updated(){
      // console.log(this.liftShow)
      
    
    }
  }
</script>
<style lang="scss" scoped>
  .c-search {
    position: relative;
    width: 100%;
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
    .c-outBtn{
     margin-bottom:10px;
    }
  }
  .page-list {
    width: 100%;
    height: 100%;
  }
</style>
