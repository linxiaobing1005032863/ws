<template>
  <el-main>
    <my-direct @click="handleDirectClick"></my-direct>
    
    <!-- 楼栋管理 -->
    <buildManger ref="buildmangerM" v-show="showOrHidden==3" ></buildManger>
    <add ref="addM" :showOrHidden="showOrHidden" @addSuccess="addSuccess"></add>
    <!--form开始输入框-->
    <div  class="page-list" v-if="showOrHidden==0">
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
         <!--  <el-input v-model="BuildName" placeholder="楼盘名称"></el-input> -->
          <el-select
           v-model="BuildName"
           multiple
            filterable
           remote

           reserve-keyword
           placeholder="楼盘名称"
           :remote-method="remoteSearch"
           :loading="loadings" @change="changes">
           <el-option
             v-for="item in options"
             :key="item.id"
             :label="item.communityName"
             :value="item.id">
           </el-option>
         </el-select>
         <!-- 项目名称结束 -->

          <el-form-item>
            <el-button type="primary" @click="find">查询</el-button>
          </el-form-item>

        </el-form>
          <div>
            <el-button type="primary" class="c-addBtn" @click="add">新增</el-button>

          </div>
        
      </div>
      <!--form输入结束-->

      <!-- 表格开始 -->
      <el-table :data="list" style="width: 100%" v-loading="loading"  tooltip-effect="dark" >
      
        <el-table-column label="楼盘名称" :show-overflow-tooltip="true" width="100" align="center">
          <el-button type="text" slot-scope="scope" style="color:black;" >{{scope.row.name }}</el-button>
        </el-table-column>
        <el-table-column label="项目类型" :show-overflow-tooltip="true" align="center" >
          <template slot-scope="scope"  >{{ scope.row.communityType ==1?"写字楼":scope.row.communityType==2?"住宅楼":scope.row.communityType==3?"医院":scope.row.communityType==4?"学校":scope.row.communityType==5?"商场":false}}</template>
        </el-table-column>

        <el-table-column label="项目区域" :show-overflow-tooltip="true" align="center" width="80" >
          <el-button slot-scope="scope" type="text" style="color:blue;">{{ scope.row.province+scope.row.city+scope.row.area  }}</el-button>
        </el-table-column>

       

     

        <el-table-column label="详细地址" :show-overflow-tooltip="true" align="center" width="260">
          <template slot-scope="scope">{{scope.row.province+scope.row.city+scope.row.area+scope.row.address}}</template>
        </el-table-column>

       

        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button @click="buildMangerDetail(scope.row)" type="primary" size="small">管理楼栋</el-button>

            <el-button @click="editDetail(scope.row)" type="primary" size="small">编辑详情</el-button>

            <el-button @click="deleteData(scope.row)" type="danger" size="small">删除</el-button>
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
  import { bulidMangerHttpUrl } from '@/page/home/basis/httpUrl';
  import myDirect from '@/components/direct';
  import addressDatas from  '@/utils/addressData'
  import add from '@/page/home/basis/buildMangers/add'
  import buildManger from '@/page/home/basis/buildMangers/buildmanger'
  export default {
    name: 'contractManage',
    components: {myDirect,add,buildManger},
    data(){
      return {
        showOrHidden:0,
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
         options:[],//远程输入列表选择 
        loadings:false, 
      }
    },
    watch:{
      //侦听显示电梯管理显示
      
    },
    methods: {
      //删除
      deleteData(val){
        this.$xttp.get(bulidMangerHttpUrl.deletes+val.id+'/delete').then(res=>{
          if(res.errorCode==0){
            this.$message("删除成功！")
            this.get();
          }else{
             this.$message(res.errorMsg)
          }
        })
      },
      //编辑详情
      editDetail(val){
        console.log(val)
        this.$refs.addM.id=val.id
        console.log(this.$refs.addM.id)
        this.showOrHidden=2

      },
      //新增成功
      addSuccess(){
        this.showOrHidden=0;

        this.get()
      },
      //输入远程搜索
      remoteSearch(query){
        console.log(query)
          if (query !== '') {
             this.loadings = true;
             this.$xttp.post(bulidMangerHttpUrl.communityList,Object.assign({
               page:1,
                size:10,
              },query)).then(res=>{
                  if(res.errorCode==0){
                    this.options=res.data.records
                  }else{
                    this.$message(res.errorMsg)
                  }
                   this.loadings = true;
              })
          }else{
            this.options = [];
          }
      },
      //当远程搜索改变
      changes(){

      },
     
      //楼栋管理
     buildMangerDetail(val){
     
     console.log(val)
      this.$refs.buildmangerM.id=val.id
       this.showOrHidden=3;
      this.$store.commit('PUSHDIRECT', "楼栋管理")
     },
   
       /**
       * @description 新增
       */
      
      add(){
       
           this.showOrHidden=1;
           // this.$refs.addM.disableds=false;
      },
      
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
          communityName:this.customerValue,
       
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
        this.showOrHidden=0;
        this.get()
         
      },
      //远程获取数据
       get(op = {}){

        this.$xttp.post(bulidMangerHttpUrl.communityList,Object.assign({
          page:this.currentPage,
          size:this.size,
        },op)).then(res=>{
         
          if (!res.errorCode) {
            console.log(res)
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
