<template>
  <el-main>
    <my-direct @click="handleDirectClick" ></my-direct>
    <div v-show="!detailType" class="page-list">
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline" >
          <el-form-item>
            <el-select v-model="form.houseIds" placeholder="项目名称" v-show="isProjectChange">
              <el-option
                v-for="item in projetName"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
             <el-select v-model="form.workGroupId" placeholder="维保班组">
              <el-option
                v-for="item in classGroundp"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.name" placeholder="电梯名称">
              <el-option
                v-for="item in liftName"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
             <el-input v-model="form.registerCode" placeholder="注册码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.elevatorId" placeholder="梯号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"  @click="find">搜索</el-button>

          </el-form-item>

            <el-form-item>
          <el-button type="primary" @click="importDialog = true">导入</el-button>
          </el-form-item>
           <el-form-item>
          <el-button type="primary" @click="add">导出</el-button>
           </el-form-item>
            </el-form-item>
          <el-button type="primary" @click="add">新增</el-button>
           </el-form-item>
        </el-form>
        <!-- <div class="c-process"> -->


        <!-- </div> -->
        <div>
           <!--  <exportExcel  :detailData="detailDatas" :headerTitle="headerTitles" :filterName="filterNames"></exportExcel> -->
        </div>
      </div>

      <el-table :data="list" style="width: 100%"
                v-loading="loading"
                @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
         <el-table-column label="电梯名称" :show-overflow-tooltip="true" width="130" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="梯号" :show-overflow-tooltip="true" width="130" align="center">
          <template slot-scope="scope">{{ scope.row.elevatorNum }}</template>
        </el-table-column>
        <el-table-column label="注册码" :show-overflow-tooltip="true" width="130" align="center">
          <template slot-scope="scope">{{ scope.row.registerCode}}</template>
        </el-table-column>
        <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">{{ scope.row.houseName}}</template>
        </el-table-column>
         <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.buildId}}</template>
        </el-table-column>
        <el-table-column label="电梯品牌" :show-overflow-tooltip="true" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.elevatorTypeName}}</template>
        </el-table-column>

         <el-table-column label="电梯状态" :show-overflow-tooltip="true" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.elevatorStatus==0?"正常":2?"检修":3?"终端断开":"故障"}}</template>
        </el-table-column>



        <el-table-column label="维保班组" :show-overflow-tooltip="true" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.workGroupName}}</template>
        </el-table-column>
        
        <el-table-column label="最近保养时间" :show-overflow-tooltip="true" align="center" width="170">
          <template slot-scope="scope">{{new Date(scope.row.preMaintenanceDate).toLocaleDateString().replace(/\//g,'-')}}</template>
        </el-table-column>

        <el-table-column label="下次保养时间" :show-overflow-tooltip="true" align="center" width="170">
          <template slot-scope="scope">{{new Date(scope.row.nextMaintenanceDate).toLocaleDateString().replace(/\//g,'-') }}</template>
        </el-table-column>

        <el-table-column label="操作" width="340" fixed="right" style="position:relative;">
          <template slot-scope="scope">
            <el-button @click="seeDetail(scope.row)" type="primary" size="small">详情</el-button>
             <el-button @click="" type="primary" size="small">实时状态 </el-button>
              <el-button @click="" type="primary" size="small">运行报告</el-button>
               <el-button @click="more(scope.row)" type="primary" size="small">更多</el-button>
             <ul  class="moreList" v-if="scope.row.id==showRow">
               <li>保养记录</li>
               <li>维修记录</li>
               <li>年检记录</li>
             </ul>  
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="size"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="维保人员"
      width="80%"
      :visible.sync="maintainDialog"
      :before-close="handleClose">
      <el-form :model="maintainForm" ref="maintainForm" label-width="120px" class="demo-form">
        <el-form-item label="维保人员1" required>
          <el-input v-model="maintainForm.name" size="medium" ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" required>
          <el-input v-model="maintainForm.name" size="medium" ></el-input>
        </el-form-item>
        <el-form-item label="维保人员2">
          <el-input v-model="maintainForm.name" size="medium" ></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="maintainForm.name" size="medium" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="导入"
      width="80%"
      :visible.sync="importDialog"
      :before-close="handleClose">
      <el-form :model="importForm" ref="importForm" label-width="120px" class="demo-form">
        <el-form-item label="单文件上传" required>
          <el-upload
            class="upload-demo"
            drag
            action=""
            :http-request="uploadFile"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
    <add :show="detailType" :type="detailType" :liftId.sync="liftId" @addHied="addHied()"></add>
  </el-main>
</template>
<script>
  import {certificateHttpUrl} from '../httpUrl';
  import {filterParams} from '../process';
  import add from './add';
  import myDirect from '@/components/direct';
  import exportExcel from '@/components/exportExcel'//导出
  export default {
    name: 'employeeManage',
    components: {myDirect,add,exportExcel},
    data(){
      return {
       isProjectChange:true,
        showRow:null,
        liftId:null,//电梯Id
        //导出数据
        detailDatas:[],
        headerTitles:["电梯名称","梯号","注册码","项目名称","楼栋","电梯品牌","电梯状态","维保班组","最近保养时间","下次保养时间"],
        filterNames:["name","elevatorNum","registerCode","houseName","buildId","elevatorTypeName","elevatorStatus","workGroupName" ,"preMaintenanceDate","nextMaintenanceDate"],
        detail: {},
        detailType: null,//add see
        list: [],
        form: {
            houseIds:[],//项目名称ID
            projectName:null,//项目名称
            name:null,//电梯名称
            workGroupId:null,//维保组Id
            registerCode:null,//注册码
            elevatorId:null,//电梯编号
          // useType : null,//类型
          // brandName:null,//品牌名称
          // houseName:null,//项目名称
          // address:null,//位置
          // elevatorNum :null,//梯号
        },
        projetName:[
          {
            value:0,
            label:'全部类型'
          },
          {
            value: 1,
            label: '金燕小区1'
          },
          {
            value: 2,
            label: '金燕小区2'
          },
          {
            value: 3,
            label: '金燕小区3'
          },
          {
            value: 4,
            label: '金燕小区4'
          },
          {
            value: 5,
            label: '金燕小区5'
          },
        ],
        //班组
        classGroundp:[
            {
              value:0,
              label:'全部类型'
            },
            {
              value: 1,
              label: '维保一队'
            },
            {
              value: 2,
              label: '维保二队'
            },
            {
              value: 3,
              label: '维保三队'
            },
            {
              value: 4,
              label: '维保四队'
            },
            {
              value: 5,
              label: '维保五队'
            }],
        
        liftName:[
          {
            label:'电梯A',
            value:1
          },
           {
            label:'电梯b',
            value:2
          },
           {
            label:'电梯c',
            value:3
          },
        ],
        currentPage: 1,//当前页码
        total: 1,//总数
        size: 10,//总页数
        loading: false,//列表加载loading

        maintainDialog: false,//维保人员
        importDialog: false,//导入

        maintainForm:{
          name:null,
        },//维保人员
        importForm:{
          file:null,
        },//导入
      }
    },
    
    methods: {
      more(val){
        this.showRow=this.showRow==null?val.id:null;
      },
      addHied(){
        this.detailType=null;
        // this.$message("保存成功!")
      },
      //查看详情
      seeDetail(val){
        //liftId电梯Id
        this.liftId=val.id;
        this.detailType = 'see';
        
      },
      /**
       * @description 新增
       */
      add(){
        this.detailType = 'add';
      },
      see(row){
        this.detailType = 'see';
        this.detail = row;
      },
      /**
       * @description 查找
       */
      find(){
        //this.detailType = 'see';
        // console.log(888888)
        this.get();
      },
      /**
       * @description 编辑
       * @param row 行数据
       */
      edit(row){
        this.detailType = 'edit';
        this.detail = row;
      },
      /**
       * @description 换页
       * @param currentPage
       */
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.get();
      },
      /**
       * @description table select
       */
      handleSelectionChange(val){
        console.log(val)
         let value=[];
               this.detailDatas=[];
              //遍历数组，添加所需要的字段
              for(let x = 0 ;x <val.length;x++){
                val[x].elevatorStatus= val[x].elevatorStatus==0?"正常":2?"检修":3?"终端断开":"故障"
              }
              Object.assign(this.detailDatas,val)
      },
      handleClose(){
        this.maintainDialog = false;
        this.importDialog = false;
      },
      handleDirectClick(){
        this.detailType = null;
      },
      get(op={}){
        this.loading = true;
        this.$xttp.post(certificateHttpUrl.list, Object.assign({
          page: this.currentPage,
          size: this.size,
        }, filterParams(this.form)),op).then(res => {
          if (!res['errorCode']) {
            console.log(res)
           
            this.list = res['data'].records;
            this.total = res['data'].total;
             this.loading = false;
          }else{
              this.loading = false;
          }
        }).catch(err => this.loading = false)
      },
      /**
       * @description 导入文件
       */
      uploadFile(file){
        console.log(file)
      },
    },
    created(){
      if(this.$route.query.id){
         this.isProjectChange=false;
         this.form.houseIds.push(this.$route.query.id)
         console.log(this.$route.query.houseName)
      } 
      
      this.get();
    }
  }
</script>
<style lang="scss" scoped>
  .c-search {
    position: relative;
    width: 100%;
    .c-process {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }

  .page-list {
    width: 100%;
    height: 100%;
  }
  .moreList{
    background:white;
    z-index:9999;
    position:absolute;
    right:16px;
    top:32px;
    border:1px #ddd solid;
    li{
      cursor:pointer;
      font-size:12px;
      color:blue;
      padding:2px 4px;
      borer-box:box-sizing;
      -o-borer-box:box-sizing;
      -ms-borer-box:box-sizing;
      -moz-borer-box:box-sizing;
      -webkit-borer-box:box-sizing;

    }
  }
</style>
