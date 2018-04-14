<template>
  <!--年检管理-->
  <el-main>
    <div>
      <my-direct></my-direct>
      <div class="c-search">
        <el-form :inline="true" :model="form" class="demo-form-inline">
<!--全部品牌  -->
          <el-select v-model="brandvalue" filterable placeholder="全部品牌">
              <el-option
                v-for="item in brandoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
<!-- 全部梯种 -->
          <el-select v-model="leftvalue" filterable placeholder="全部梯种">
              <el-option
                v-for="item in liftoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
<!-- 日期选择 -->
 <el-date-picker
      v-model="datevalue"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions2">
    </el-date-picker>

          <el-input v-model="inputContains" placeholder="配件内容/下单人"></el-input>
          <el-form-item>
            <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="c-addBtn" @click="add">新增</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column label="订单编号" :show-overflow-tooltip="true" width="130" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="配件内容" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.keyType }}</template>
      </el-table-column>

      <el-table-column label="关联维保单" :show-overflow-tooltip="true" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.test }}</template>
      </el-table-column>

      <el-table-column label="下单类型" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>

      <el-table-column label="下单人" :show-overflow-tooltip="true" align="center"  width="100">
        <template slot-scope="scope">{{ scope.row.roomName }}</template>
      </el-table-column>

      <el-table-column label="总价（元）" :show-overflow-tooltip="true" align="center"  width="143">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>

      <el-table-column label="下单时间" :show-overflow-tooltip="true" align="center"  width="96">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>

      <el-table-column label="订单状态" :show-overflow-tooltip="true" align="center"  width="90">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>

      

      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          
          <el-button @click="edit(scope.row)" type="primary" size="small">查看详情</el-button>
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
        tableData:[{phone:8888}],
        form:{
          name:''
        },
        currentPage:1,
        total:1,
        loading:false,//列表加载loading
        sendData:{},
        //选择列表品牌
        brandoptions: [{
          value: '选项1',
          label: '全部下单类型'
        }, {
          value: '选项2',
          label: '维保APP'
        }, {
          value: '选项3',
          label: '维保后台'
        }],
        brandvalue:'',
        //全部状态
         liftoptions: [{
          value: '选项1',
          label: '全部状态'
        }, {
          value: '选项2',
          label: '已接单'
        }, {
          value: '选项3',
          label: '已生效'
        }, {
          value: '选项4',
          label: '已发货'
        },{
          value: '选项4',
          label: '已签收'
        }],
        liftvalue:'',
       
        //配件内容/下单人
        inputContains:'',
        //日历
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
        datevalue:'',
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

      },
       getListData(){
        this.$xttp.post('/maintenanceTemplate/list',...this.sendData).then(res=>{})
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
    .c-addBtn {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }
</style>
