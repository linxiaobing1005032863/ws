<template>
	 <!--保养管理-->
  <el-main>
      <imgShowUrl ref="imgShowM"></imgShowUrl>
      <adds ref="detailM"></adds>
    <div>
      <my-direct></my-direct>
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-input v-model="form.projectName" placeholder="请输入项目名"></el-input>
          <el-input v-model="form.buildNum" placeholder="楼栋"></el-input>
          <el-select v-model="form.status" placeholder="请选择状态" >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input v-model="form.maintenanceNum" placeholder="请输入保养单号"></el-input>

          <el-button type="primary" @click="search">搜索</el-button>
        </el-form>
        <el-button type="primary" class="c-addBtn" @click="add" v-show='false'>新增</el-button>

         <el-date-picker
      v-model="value7"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions2" style="margin-top:10px;" @change="dateChange">
    </el-date-picker>
      </div>
    </div>
    <el-table :data="list" style="width: 100%" v-loading="loading" :row-class-name="tableRowClassName">
      <el-table-column label="保养单号" :show-overflow-tooltip="true" width="130" align="center">
        <!-- <template type="text">{{scope.row.planName }}</el-button> -->
          <el-button slot-scope="scope" type="text" style="color:blue;" @click="showDetail(scope.row)">{{ scope.row.planName }}</el-button>
      </el-table-column>
      <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.houseName}}</template>
      </el-table-column>

      <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.buildNum  }}</template>
      </el-table-column>

      <el-table-column label="电梯名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.elevatorNum }}</template>
      </el-table-column>

        <el-table-column label="计划日期" :show-overflow-tooltip="true" align="center"  width="140">
        <template slot-scope="scope">{{ new Date(scope.row.planStartTime).toLocaleDateString().replace(/\//g,'-')  }}</template>
      </el-table-column>

       <el-table-column label="执行日期" :show-overflow-tooltip="true" align="center"  width="140">
        <template slot-scope="scope">{{ new Date(scope.row.startTime ).toLocaleDateString().replace(/\//g,'-')   }}</template>
      </el-table-column>

      <el-table-column label="状态" :show-overflow-tooltip="true" align="center" >
        <template slot-scope="scope">{{ scope.row.status==0?"未开始":scope.row.status==1?"已出发":scope.row.status==2?"保养中":scope.row.status==3?"保养结束 ":scope.row.status==4?"用户已确认":false}}</template>
      </el-table-column>

      <el-table-column label="维保工人" :show-overflow-tooltip="true" align="center" >
       <!--  <template slot-scope="scope">{{ scope.row.groupMembers}}</template> -->
        <template slot-scope="scope"><p style="font-size:12px;" v-for="(items,index) in scope.row.groupMembers">{{items.userName}}</p ></template>
      </el-table-column>

      <el-table-column label="耗时(分钟)" :show-overflow-tooltip="true" align="center"  >
        <template slot-scope="scope">{{ scope.row.timeConsuming}}</template>
      </el-table-column>

      <el-table-column label="物业签字" :show-overflow-tooltip="true" align="center"  >
        <template slot-scope="scope">{{ scope.row.customerAutograph }}</template>
      </el-table-column>

      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button @click="showReport(scope.row)" type="primary" size="small" style="margin:0 auto">保养报告</el-button>

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
  </el-main>
</template>
<script>
  import myDirect from '@/components/direct'
  import {maintainHttpUrl} from '@/page/home/jobmangement/jobMangerUrl'
  import imgShowUrl from '@/page/home/jobmangement/maintain/reportImg'
  import {filterParams} from '@/utils/processForm'
  import adds from './add'

  export default {
    name: 'contractManage',
    components:{myDirect,imgShowUrl,adds},
    data(){
      return {

        list:[],
        msg: 'hello',
        sendData:{
    		  endTime: 0,
    		  page: 1,

    		  startTime: 0,
    		  templateId: "string"
    		},

        form:{
         brandId:null,//(ObjectId, optional): 品牌id ,
         companyId:null,// (ObjectId, optional): 公司id ,
         elevatorId:null,// (ObjectId, optional): 电梯id ,
         endPlanTime:null,// (integer, optional): 查询条件计划时间右边界 ,
         endTime:null,// (integer, optional): 创建时间 结束时间 ,
         houseId:null,// (ObjectId, optional): 楼盘id ,
         //page:1,// (integer, optional): 页码 ,
         //size:10,// (integer, optional): 每页所包含的条数 ,
         startPlanTime:null,// (integer, optional): 查询条件计划时间左边界 ,
         startTime:null,// (integer, optional): 创建时间 开始时间 ,
         status:null,// (integer, optional): 状态（0：未开始 1：已出发 2：保养中 3：保养结束 4：用户已确认） ,
         userId:null,// (ObjectId, optional): 用户userId

         //新版本部分
         maintenanceNum:null,//保养单号
         buildNum:null,//楼号
         projectName:null,//项目名称
         houseName:null,//楼盘名称

        },
        currentPage:1,
        total:1,
        size: 10,
        loading:false,//列表加载loading
        statusList:[
            {value:null,label:'全部状态'}
            ,{value:0,label:'未开始'}
            ,{value:1,label:'已出发'}
            ,{value:2,label:'保养中'}
            ,{value:3,label:'保养结束'}
            ,{value:4,label:'用户已确认'}
        ],
        statusValue:'',
        inputName:'',//输入名称
        inputmaintainNum:'',//输入保养单号


        //时间选择
         pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
         value7:'',
      }
      // http://apielevator.test.bitiot.com.cn/v1/maintenanceTemplate/list

    },
    methods:{

      showDetail(val){
        this.$refs.detailM.show=true;
        this.$refs.detailM.id=val.id;
      },
      dateChange(){
        
        this.form.startTime=this.value7[0].valueOf();
        this.form.endTime =this.value7[1].valueOf();

      },
      //未完成为高量
      tableRowClassName({row, rowIndex}) {
        let date = new Date()
      
        if(date.valueOf()>row.planStartTime){

            return 'warning-row';
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
       * @description 编辑
       * @param row 行数据
       */
      showReport(row){
        console.log(row)
         this.$refs.imgShowM.imgUrl=row.reportImage
         if(this.$refs.imgShowM.imgUrl){
          this.$refs.imgShowM.imgShow=true;
        }else{
          this.$message("无相关信息")
        }
          
      },
      /**
       * @description 换页
       */
      handleCurrentChange(currentPage){
         this.currentPage = currentPage;
         this.getListData();
      },
      getListData(){
      	this.$xttp.post(maintainHttpUrl.list,Object.assign({
          page:this.currentPage,
          size:this.size,
        },filterParams(this.form))).then(res=>{
          if(res.errorCode ==0){

            this.list = res['data'].records;
            this.total = res['data'].total;
          }else{
            this.$message(res.errorMsg)
          }
        })
      },
      search(){
        // this.form.size=1;

        this.getListData()
      },
    },
    created(){
    	this.getListData();



    }
  }
</script>
<style  lang="scss" >

.el-table .warning-row{
    background-color:#f56c6c;
}
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


</style>
