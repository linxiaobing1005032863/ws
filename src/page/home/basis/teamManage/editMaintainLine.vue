<template>
  <!--新增保养路线-->
  <div>
    <transition>
      <div class="page-add">
        <my-direct/>
        <el-table :data="list" style="width: 100%" v-loading="loading">
          <el-table-column label="项目名称" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">?</template>
          </el-table-column>
          <el-table-column label="楼栋" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">?</template>
          </el-table-column>

          <el-table-column label="电梯名称" :show-overflow-tooltip="true" align="center" width="100">
            <template slot-scope="scope">?</template>
          </el-table-column>

          <el-table-column label="预计工时" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">?</template>
          </el-table-column>

          <el-table-column label="日期" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">?</template>
          </el-table-column>

          <el-table-column label="作业时间" :show-overflow-tooltip="true" align="center" width="170">
            <template slot-scope="scope">?</template>
          </el-table-column>

          <el-table-column label="维保组" :show-overflow-tooltip="true" align="center" width="130">
            <template slot-scope="scope">?</template>
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
    </transition>
  </div>
</template>
<script>
  import myDirect from '@/components/direct';
  import {teamHttpUrl as httpUrl} from '../httpUrl';
  import {filterParams} from '../process';
  export default {
    components:{myDirect},
    data(){
      return {
        list: [],
        loading:false,
        total:1,
        size:10,
        currentPage:1,

      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
