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
<!-- 全部分类 -->
          <el-select v-model="modlevalue" filterable placeholder="全部分类">
              <el-option
                v-for="item in modleoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
<!--有货 -->
          <el-select v-model="goodsvalue" filterable placeholder="有货">
              <el-option
                v-for="item in goodsoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          <el-input v-model="input" placeholder="配件名称/型号/编码"></el-input>
          <el-form-item>
            <el-button type="primary" @click="find"><i class="iconfont icon-sousuo">&nbsp;</i>查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="c-addBtn" @click="add">新增</el-button>
      </div>
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column label="配件编码" :show-overflow-tooltip="true" width="130" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="配件名称" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.keyType }}</template>
      </el-table-column>

      <el-table-column label="型号" :show-overflow-tooltip="true" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.test }}</template>
      </el-table-column>

      <el-table-column label="分类" :show-overflow-tooltip="true" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>

      <el-table-column label="品牌" :show-overflow-tooltip="true" align="center"  width="100">
        <template slot-scope="scope">{{ scope.row.roomName }}</template>
      </el-table-column>

      <el-table-column label="梯种" :show-overflow-tooltip="true" align="center"  width="143">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>

      <el-table-column label="价格" :show-overflow-tooltip="true" align="center"  width="96">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>

      <el-table-column label="库存" :show-overflow-tooltip="true" align="center"  width="90">
        <template slot-scope="scope">{{ scope.row.number }}</template>
      </el-table-column>

      

      <el-table-column label="操作" width="200" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="primary" size="small">入库</el-button>
          <el-button @click="edit(scope.row)" type="primary" size="small">采购</el-button>
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
          label: '全部品牌'
        }, {
          value: '选项2',
          label: '鑫诺'
        }, {
          value: '选项3',
          label: '戈尔'
        }, {
          value: '选项4',
          label: '奥的斯'
        }, {
          value: '选项5',
          label: '日立'
        }],
        brandvalue:'',
        //梯种
         liftoptions: [{
          value: '选项1',
          label: '全部梯种'
        }, {
          value: '选项2',
          label: 'MRGL'
        }, {
          value: '选项3',
          label: 'GPL'
        }, {
          value: '选项4',
          label: 'GML'
        }],
        liftvalue:'',
        //分类
        modleoptions: [{
          value: '选项1',
          label: '全部分类'
        }, {
          value: '选项2',
          label: '继电器板'
        }, {
          value: '选项3',
          label: '控制板'
        }, {
          value: '选项4',
          label: '显示屏'
        }],
        modlevalue:'',
        //有货
         goodsoptions: [{
          value: '选项1',
          label: '全部分类'
        }, {
          value: '选项2',
          label: '继电器板'
        }, {
          value: '选项3',
          label: '控制板'
        }, {
          value: '选项4',
          label: '显示屏'
        }],
        goodsvalue:'',
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
