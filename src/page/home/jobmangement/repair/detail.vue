<template>
  <el-dialog
    title="详情"
    width="700px"
    :visible.sync="show">
    <div class="con-wrap" v-if="show">
      <div class="left-wrap">
        <el-row>
          <el-col :span="7">项目名称：</el-col>
          <el-col :span="16">{{detail.projectName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="7">楼栋：</el-col>
          <el-col :span="16">{{detail.buildName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="7">电梯名称：</el-col>
          <el-col :span="16">{{detail.elevatorName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="7">维修单号：</el-col>
          <el-col :span="16">{{detail.id}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="7">召修来源：</el-col>
          <el-col :span="16">
            <span v-if="detail.source === 1">C端用户提交</span>
            <span v-if="detail.source === 2">物业提交</span>
            <span v-if="detail.source === 3">维保端提交</span>
            <span v-if="detail.source === 4">自检故障</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">召修原因：</el-col>
          <el-col :span="16">
            <span>{{detail.causeFailure}}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">召修内容：</el-col>
          <el-col :span="16">{{detail.faultDescription}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="7">召修日期：</el-col>
          <el-col :span="16">{{detail.faultDate | time('yyyy-MM-dd HH:mm:ss')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="7">执行日期：</el-col>
          <el-col :span="16">{{detail.beginRepairTime | time('yyyy-MM-dd HH:mm:ss')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="7">维保人员：</el-col>
          <el-col :span="16">
            <div v-for="item in detail.dealWithUsers">
              <span>{{item.userName}}</span>
              <span>{{item.mobile}}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="right-wrap">
        <my-map ref="myMap" width="350px" height="261px" :disabled="true"></my-map>
      </div>
    </div>
    <el-tabs v-if="show" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="客户反馈" name="0">
        <el-row>
          <el-col :span="4">物业人员：</el-col>
          <el-col :span="3">{{detail.comemt.userName}}</el-col>
          <el-col :span="4">{{detail.comemt.mobile}}</el-col>
          <el-col :span="4">{{detail.comemt.sign}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">物业人员：</el-col>
          <el-col :span="7">{{detail.comemt.position}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">服务态度评分：</el-col>
          <el-col :span="7">
            <el-rate
              v-model="detail.comemt.attitudeScore"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}">
            </el-rate>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">维保质量评分：</el-col>
          <el-col :span="7">
            <el-rate
              v-model="detail.comemt.qualityScore"
              disabled
              show-score
              text-color="#ff9900"
              score-template="{value}">
            </el-rate>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">客户意见：</el-col>
          <el-col :span="7">{{detail.comemt.customerOpinion}}</el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="作业记录" name="1">
        <el-table
          :data="detail.attendanceList"
          style="width: 100%">
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.attendanceStatus === 1">签到</span>
              <span v-if="scope.row.attendanceStatus === 2">签退</span>
              <span v-if="scope.row.attendanceStatus === 3">出发</span>
              <span v-if="scope.row.attendanceStatus === 4">暂停</span>
              <span v-if="scope.row.attendanceStatus === 5">重启</span>
            </template>
          </el-table-column>
          <el-table-column
            label="时间">
            <template slot-scope="scope"></template>
          </el-table-column>
          <el-table-column
            label="位置">
            <template slot-scope="scope">{{scope.row.address}}</template>
          </el-table-column>
          <el-table-column
            label="备注">
            <template slot-scope="scope">{{scope.row.content}}</template>
          </el-table-column>
          <el-table-column
            label="耗时">
            <template slot-scope="scope"></template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="作业图片" name="2">
        <el-carousel trigger="click" height="150px">
          <el-carousel-item v-for="item in detail.images" :key="item">
            <img :src="item" alt="">
          </el-carousel-item>
        </el-carousel>
      </el-tab-pane>
      <el-tab-pane label="故障信息" name="3">
        <el-row>
          <el-col :span="4">故障类型：</el-col>
          <el-col :span="8">
            <span v-if="detail.faultType === 0">困人</span>
            <span v-if="detail.faultType === 1">单梯停梯</span>
            <span v-if="detail.faultType === 2">不能启动</span>
            <span v-if="detail.faultType === 3">普通维修</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">故障码：</el-col>
          <el-col :span="8">{{detail.faultCode}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">故障部位：</el-col>
          <el-col :span="8">{{detail.faultPosition}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">故障发生时间：</el-col>
          <el-col :span="8">{{detail.faultDate | time('yyyy-MM-dd HH:mm:ss')}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">故障描述：</el-col>
          <el-col :span="8">{{detail.faultDescription}}</el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="电梯信息" name="5">
        <el-row>
          <el-col :span="4">电梯编号：</el-col>
          <el-col :span="8">{{detail.elevatorId}}&nbsp;</el-col>
          <el-col :span="4">电梯类型：</el-col>
          <el-col :span="8">
            <span v-if="detail.elevatorType === 1">直梯</span>
            <span v-if="detail.elevatorType === 2">扶梯</span>
            <span v-if="detail.elevatorType === 3">自动人行道</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">电梯名称：</el-col>
          <el-col :span="8">{{detail.elevatorName}}&nbsp;</el-col>
          <el-col :span="4">电梯用途：</el-col>
          <el-col :span="8">{{detail.elevatorUse}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">注册代码：</el-col>
          <el-col :span="8">{{detail.registerCode}}&nbsp;</el-col>
          <el-col :span="4">开门方式：</el-col>
          <el-col :span="8">
            <span v-if="detail.openType === 1">左开</span>
            <span v-if="detail.openType === 2">中开</span>
            <span v-if="detail.openType === 3">右开</span>
            <span v-if="detail.openType === 4">双开</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">品牌：</el-col>
          <el-col :span="8">{{detail.brandName}}&nbsp;</el-col>
          <el-col :span="4">电梯安装日期：</el-col>
          <el-col :span="8">{{detail.installationTime | time}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">梯种：</el-col>
          <el-col :span="8">{{detail.elevatorTypeName}}&nbsp;</el-col>
          <el-col :span="4">梯龄：</el-col>
          <el-col :span="8"><span v-if="detail.elevatorAge">{{detail.elevatorAge}}年</span></el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
  import map from '@/components/map';
  import {repairHttpUrl as httpUrl} from '../jobMangerUrl';
  export default {
    components:{'my-map':map},
    data(){
      return {
        show: false,
        info:null,
        detail:null,
        activeName:0,
        tableData:[],
      }
    },
    methods:{
      get(){
        this.$xttp.get(`${httpUrl.detail}${this.info.id}/webRequestDetail`)
          .then(res => {
            if (!res['errorCode']) {
              this.detail = res['data'];
              if (this.detail.comemt.attitudeScore) parseFloat(this.detail.comemt.attitudeScore /= 10).toFixed(1);
              if (this.detail.comemt.qualityScore) parseFloat(this.detail.comemt.qualityScore /= 10).toFixed(1);
              this.show = true;
              this.$nextTick(()=>{
                this.$refs.myMap.$emit('mapInit',{
                  initAddress:res['data'].location
                })
              })
            }
          })
      },
      handleClick(){}
    },
    mounted(){
      this.$on('show',op => {
        //初始化
        this.info = op.info;
        this.activeName = 0;
        this.get();
      });
      this.$on('hide',()=> {
        if (this.show) this.show = false;
      })
    },
  }
</script>
<style lang="scss" scoped>
  .con-wrap {
    display: flex;
    .left-wrap {
      flex: 1;
    }
    .right-wrap {
      flex: 1;
    }
  }
</style>
