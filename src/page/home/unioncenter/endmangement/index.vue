<template>
   <!--终端管理-->
  <el-main>
    <div>
      <my-direct></my-direct>
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="客户名称">
            <el-input v-model="form.name" placeholder="模糊查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="c-addBtn" @click="add">新增</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="序号" :show-overflow-tooltip="false" width="47" align="center">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
      <el-table-column label="终端编码" :show-overflow-tooltip="false" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.keyType }}</template>
      </el-table-column>

      <el-table-column label="厂商编码" :show-overflow-tooltip="false" align="center" width="47">
        <template slot-scope="scope">{{ scope.row.test }}</template>
      </el-table-column>

      <el-table-column label="服务商" :show-overflow-tooltip="false" align="center" width="47">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>

      <el-table-column label="终端号" :show-overflow-tooltip="false" align="center"  width="47">
        <template slot-scope="scope">{{ scope.row.roomName }}</template>
      </el-table-column>

      <el-table-column label="手机号码" :show-overflow-tooltip="false" align="center"  width="100">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>

      <el-table-column label="SIM号码" :show-overflow-tooltip="false" align="center"  width="100">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>

      <el-table-column label="SIM类型" :show-overflow-tooltip="false" align="center"  width="47">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
      <el-table-column label="软件版本" :show-overflow-tooltip="false" align="center"  width="80">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
      <el-table-column label="区域" :show-overflow-tooltip="false" align="center"  width="80">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
       <el-table-column label="创建时间" :show-overflow-tooltip="false" align="center"  width="100">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
       <el-table-column label="链接" :show-overflow-tooltip="false" align="center"  width="47">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
       <el-table-column label="激活" :show-overflow-tooltip="false" align="center"  width="47">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
       <el-table-column label="调试" :show-overflow-tooltip="false" align="center"  width="47">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>
       <el-table-column label="检修" :show-overflow-tooltip="false" align="center"  width="47"> 
        <template slot-scope="scope">{{ scope.row.number }}</template>
       </el-table-column>


<!-- 
      <el-table-column label="操作" :show-overflow-tooltip="true" align="center"  width="170">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column> -->

      <el-table-column label="操作" width="120" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="primary" style="margin:6px 0 6px 0;" size="small" >编辑设备</el-button>
          <el-button @click="edit(scope.row)" type="info" size="small" style="margin:0 0 6px 0;">查看详情</el-button>
          <el-button @click="edit(scope.row)" type="danger" size="small" style="margin:0 0 6px 0;">删除设备</el-button>
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
  export default {
    name: 'contractManage',
    components:{myDirect},
    data(){
      return {
        
        msg: 'hello',
        tableData:[],
        form:{
          name:''
        },
        currentPage:1,
        total:1,
        loading:false,//列表加载loading

      }
    },
    methods:{
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
      edit(row){

      },
      /**
       * @description 换页
       */
      handleCurrentChange(){

      }
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
  }
</style>
