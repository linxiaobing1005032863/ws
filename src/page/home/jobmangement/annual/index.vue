<template>
  <!--年检管理-->
  <el-main>
    <div style="width:100%;height:100%;">
      <my-direct></my-direct>
        
      
        <submiltMessage :show="submitShow"></submiltMessage>
      
      <div v-if="submitShow==0">
          <div class="c-search">
              
                  <el-select v-model="statusValue" placeholder="请选择">
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

                  <el-input v-model="form.projectName" placeholder="项目名称、梯号"></el-input>
                  <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
                </el-form-item>
              </el-form>
              <el-button type="primary" class="c-addBtn" @click="add" v-show='false'>新增</el-button>
           </div>
    
          <el-table :data="list" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
            <el-table-column
            type="selection"
            width="55">
          </el-table-column>
            <el-table-column label="年检单号" :show-overflow-tooltip="true" width="130" align="center">
              <template slot-scope="scope">{{ scope.row.maintenanceNum}}</template>
            </el-table-column>

             <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.keyType }}</template>
            </el-table-column>
            <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.buildNum  }}</template>
            </el-table-column>

            <el-table-column label="电梯名称" :show-overflow-tooltip="true" align="center" width="100">
              <template slot-scope="scope">{{ scope.row.elevatorName  }}</template>
            </el-table-column>

            <el-table-column label="注册代码" :show-overflow-tooltip="true" align="center">
              <template slot-scope="scope">{{ scope.row.registerCode  }}</template>
            </el-table-column>

            <el-table-column label="状态" :show-overflow-tooltip="true" align="center"  width="200">
              <template slot-scope="scope">{{ status[scope.row.status] }}</template>
            </el-table-column>

            <el-table-column label="班组负责人" :show-overflow-tooltip="true" align="center"  width="170">
              <template slot-scope="scope">{{ scope.row.groupHeadName  }}</template>
            </el-table-column>

            <el-table-column label="下次年检时间" :show-overflow-tooltip="true" align="center"  width="170">
              <template slot-scope="scope">{{ new Date(scope.row.planStartTime).toLocaleDateString().replace(/\//g,'-')}}</template>
            </el-table-column>

            <el-table-column label="检查限速器" :show-overflow-tooltip="true" align="center"  width="170">
              <template slot-scope="scope">
                <div class="checks" :class="{ischeck:scope.row.checkLimit==1?true:false}" >
                  <img src="./chose.png" alt="" v-show=''>
                </div>
             <!--  <i :class="{scope.row.checkLimit==0?'el-icon-error':'el-icon-success'}"></i> -->
              </template>
             <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            </el-table-column>

            

            <el-table-column label="操作" width="180" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button @click="edit(scope.row)" type="primary" size="small">提交年检信息</el-button>
               
              </template>
            </el-table-column>
        </el-table>
        <div class="c-block">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="10"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </el-main>
</template>
<script>
  import myDirect from '@/components/direct'
   import {annualHttpUrl} from '@/page/home/jobmangement/jobMangerUrl'
   import {filterParams} from '@/utils/processForm'
   import submiltMessage from './submilemessage'
  export default {
    name: 'contractManage',
    components:{myDirect,submiltMessage},
    data(){
      return {
        submitShow:0,//0:主页显示1：提交年检单
        hadCheck:false,
        status:{0:"未开始" ,1:"已出发", 2:"保养中", 3:"保养结束", 4:"用户已确认"},
        list:[],
        msg: 'hello',
        tableData:[{phone:8888}],
        form:{
          status:null, //(integer, optional): 状态（0：未开始 1：已出发 2：保养中 3：保养结束 4：用户已确认） ,
          projectName:null, //(string, optional): 项目名称 ,
        },
        currentPage:1,
        total:1,
        loading:false,//列表加载loading
        sendData:{},
        //状态选择
         statusList:[{value:'1',label:'全部状态'},{value:'2',label:'未完成年检'},{value:'3',label:'已完成年检'}],
        statusValue:'',
      }
    },
    methods:{
        tableRowClassName({row, rowIndex}) {
        let date = new Date()
      
        if(date.valueOf()>row.planStartTime){

            return 'warning-row';
        }else if(date.valueOf()-row.planStartTime>0&&date.valueOf()-row.planStartTime<0){
             return 'tow-monts';
        }
        return '';
      },
      /**
       * @description 新增
       */
      add(){
        console.log('新增')
      },
      /**
       * @description 查找
       */
      find(){

      },
      /**
       * @description 年检报告详情
       * @param row 行数据
       */
      edit(row){
        this.submitShow=1;
      },
      /**
       * @description 换页
       */
      handleCurrentChange(){

      },
       getListData(){
        this.$xttp.post(annualHttpUrl.list,Object.assign({
          page:this.currentPage,
          size:this.size,
        },filterParams(this.form))).then(res=>{
          console.log(res)
            this.list=res.data.records
        })
      },
      handleSelectionChange(val){
        console.log(val)
      },
    },
    created(){
      this.getListData()
    }
  }
</script>
<style lang="scss" scoped>
  .c-search {
    position: relative;
    width: 100%;
    margin-bottom:13px;
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }
  .checks{
      margin:0 auto;
    display:block;
    width:10px;
    height:10px;
    border:1px #000 solid; 
  }

  .ischeck{
    
    background-position:-3px -3px;
    background-repeat:no-repeat;
    background-image:url('./chose.png') ;
    background-size:13px 14px;
  }
</style>
