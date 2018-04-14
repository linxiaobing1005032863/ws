<template>
  <!--班组管理-->
  <el-main>
    <div class="con-wrap">
      <div class="list-wrap">
        <myDirect/>
        <div class="c-search">
          <el-form :inline="true" :model="form" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="form.groupName" size="small" clearable placeholder="班组"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="form.userName" size="small" clearable placeholder="成员"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="small" @click="find">搜索</el-button>
            </el-form-item>
          </el-form>
          <div class="c-process">
            <el-button type="primary" size="small" @click="openDialog('add','detailDialog')">新增</el-button>
          </div>
        </div>
        <el-table :data="list" style="width: 100%" v-loading="loading">
          <el-table-column label="班组名称" width="200" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.teamName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成员" :show-overflow-tooltip="true" align="center">
            <template slot-scope="scope">
              <div>
                <span v-for="(item,index) in scope.row.groupMembers">{{ item.userName }}{{index < scope.row.groupMembers.length - 1 ? '、' : ''}}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="维保项目" :show-overflow-tooltip="true" align="center" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.houseName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="openDialog('edit','detailDialog',scope.row)">编辑</el-button>
              <el-button type="primary" size="small" @click="openPage({name:'maintainLine',row:scope.row})">保养路线</el-button>
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
      <router-view/>
    </div>
    <!--新增/编辑-->
    <el-dialog
      :title="dialogType === 'add' ? '新增' : '编辑'"
      width="800px"
      :visible.sync="detailDialog">
      <div class="detail-con">
        <div class="left">
          <span class="tit">未分组人员</span>
          <el-input v-model="keyword" size="small" placeholder="输入名称">
            <el-button slot="append" icon="el-icon-search" @click="getNotWorkGroup"></el-button>
          </el-input>
          <div class="list-wrap">
            <draggable element="span" :list="targetList" @end="onEnd" :move="onMove" :options="dragOptions">
              <transition-group data-id="target" class="drag-wrap" tag="ul" name="flip-list">
                <li v-for="element in targetList" :key="element.userId"  class="list-complete-item">
                  {{element.userName}} {{element.mobile}}
                </li>
              </transition-group>
            </draggable>
          </div>
        </div>
        <div class="right">
          <div class="tit">班组名称</div>
          <el-input v-model="detailForm.teamName" size="small" placeholder="请输入班组名称"></el-input>
          <div class="item-wrap">
            <div class="tit">班组长</div>
            <div class="list-wrap">
              <draggable element="span" :list="leaderList" @end="onEnd" :move="onMove" :options="dragOptions">
                <transition-group data-id="leader" class="drag-wrap" tag="ul" name="flip-list">
                  <li v-for="element in leaderList" :key="element.userId"  class="list-complete-item">
                    {{element.userName}} {{element.mobile}}
                  </li>
                </transition-group>
              </draggable>
            </div>
          </div>
          <div class="item-wrap" v-for="(item,index) in aimsList">
            <div class="item-block">
              <div class="tit">{{item.groupName}}</div>
              <div class="list-wrap">
                <draggable element="span" :list="item.groupMembers" @end="onEnd" :move="onMove" :options="dragOptions">
                  <transition-group data-id="aims" :data-index="index" class="drag-wrap" tag="ul" name="flip-list">
                    <li v-for="(element,elementIndex) in item.groupMembers" :key="elementIndex"  class="list-complete-item">
                      {{element.userName}} {{element.mobile}}
                    </li>
                  </transition-group>
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-button type="primary" @click="save">保存</el-button>
    </el-dialog>
  </el-main>
</template>
<script>
  import {teamHttpUrl as httpUrl} from '../httpUrl';
  import {filterParams} from '../process';
  import draggable from 'vuedraggable'
  import myDirect from '@/components/direct';
  export default {
    components:{ draggable ,myDirect},
    data(){
      return {
        form:{
          groupName:null,
          userName:null,
        },
        list:[],
        loading:false,
        currentPage:1,
        size:10,
        total:1,

        detailDialog:false,
        dialogType:'add',//add edit
        keyword:null,
        keywordTimer:null,
        targetList:[],//未分组人员
        leaderList:[],//班组长
        aimsList:[
          {
            groupName:'第1组',
            groupMembers:[]
          }
        ],
        dragged:null,//被拖拽对象
        detailForm:{
          teamHeadImg:null,//班长头像
          teamHeadPhone:null,//班长电话
          teamHeadId:null,//班长id
          teamHeadName:null,//班长姓名
          teamName:null,//班组名称
          groupList:[
            {
              groupName:'第1组',
              groupMembers:[]
            }
          ]//分组成员
        }
      }
    },
    computed:{
      dragOptions () {
        return  {
          group: 'description',
          ghostClass: 'ghost'
        };
      }
    },
    methods:{
      onMove({draggedContext}){
        this.dragged = draggedContext.element;
      },
      onEnd({target,to,newIndex,oldIndex}){
        if (to.dataset['id'] === 'aims') {//组
          //超过最大限数  重复现象
          if (to.children.length > 2 || this.aimsList[to.dataset['index']].groupMembers.filter(val => val.userId === this.dragged.userId).length > 1){
            this.aimsList[to.dataset['index']].groupMembers.splice(newIndex,1);
            if(target.dataset['id'] === 'aims'){
              this.aimsList[target.dataset['index']].groupMembers.splice(oldIndex,0,JSON.parse(JSON.stringify(this.dragged)));
            } else {
              this[`${target.dataset['id']}List`].splice(oldIndex,0,JSON.parse(JSON.stringify(this.dragged)));
            }
            this.$message.warning(to.children.length > 2 ? '每组最多可分配两名人员' :'不可重复分配');
            return false;
          }
          if (this.targetList.length && this.aimsList[this.aimsList.length - 1].groupMembers.length === 2) {//新开组
            this.aimsList.push({
                groupName:`第${this.aimsList.length + 1}组`,
                groupMembers:[],
              })
          }
        }
        if (to.dataset['id'] === 'leader') {//班
          if (to.children.length > 1) {
            this.leaderList.splice(newIndex,1);
            if(target.dataset['id'] === 'aims'){
              this.aimsList[target.dataset['index']].groupMembers.splice(oldIndex,0,JSON.parse(JSON.stringify(this.dragged)));
            } else {
              this[`${target.dataset['id']}List`].splice(oldIndex,0,JSON.parse(JSON.stringify(this.dragged)));
            }
            this.$message.warning('班组长只能分配一名人员');
            return false;
          }
          if(this.aimsList[0].groupMembers.length < 2) {
            this.aimsList[0].groupMembers.push(JSON.parse(JSON.stringify(this.dragged)));
          }
        }
      },
      openDialog(type,name,row){
        this.keyword = null;
        this.dialogType = type;
        if (type === 'add') {
          //清空数据
          this.targetList = [];
          this.leaderList = [];
          this.aimsList = [
            {
              groupName:'第1组',
              groupMembers:[]
            }
          ];
          this.detailForm = {
            teamHeadImg:null,//班长头像
            teamHeadPhone:null,//班长电话
            teamHeadId:null,//班长id
            teamHeadName:null,//班长姓名
            teamName:null,//班组名称
            groupList:[]//分组成员
          };
          this[name] = true;
        }
        if (type === 'edit') {
          //清空数据
          this.targetList = [];
          //获取数据
          this.getDetail(row.teamId,name)
        }
        this.getNotWorkGroup();

      },
      openPage({name,type,row }){
        this.$router.push({
          name:name,
          query:Object.assign({},type ? {'type' : type} :{},row ? {'id' : row.teamId}:{})
        })
      },
      handleCurrentChange(currentPage){
        this.currentPage = currentPage;
        this.get();
      },
      find(){
        this.currentPage = 1;
        this.get();
      },
      get(){
        this.loading = true;
        this.$xttp.post(httpUrl.list,Object.assign({
          page:this.currentPage,
          size:this.size,
        },filterParams(this.form))).then(res => {
            if (!res['errorCode']) {
              this.list = res.data['records'];
            }
            this.loading = false;
          }).catch(err => this.loading = false);
      },
      save(){
        //班组名称、班组长 必须有一组成员
        if(!this.detailForm.teamName || this.detailForm.teamName.replace(/(^\s*)|(\s*$)/g, "") === ''){
          this.$message.warning('请输入班组名称');
          return false;
        }
        if(!this.leaderList.length){
          this.$message.warning('请选择班组长');
          return false;
        }
        if (!this.aimsList.some(val=> val.groupMembers.length > 0)){
          this.$message.warning('请选择组员');
          return false;
        }
        //班长信息
        this.detailForm.teamHeadId = this.leaderList[0].userId;
        this.detailForm.teamHeadImg = this.leaderList[0].headImg;
        this.detailForm.teamHeadName = this.leaderList[0].userName;
        this.detailForm.teamHeadPhone = this.leaderList[0].mobile;
        //过滤无成员分组
        this.detailForm.groupList = [];
        this.aimsList.map(val =>{
          if(val.groupMembers.length > 0) this.detailForm.groupList.push(val);
        });
        this.dialogType === 'add' ? (this.add()) :(this.edit());
      },
      add(){
        this.$xttp.post(httpUrl.add,this.detailForm)
          .then(res=>{
            if(!res['errorCode']){
              this.detailDialog = false;
              this.get();
            }
          })
      },
      edit(){
        this.$xttp.post(httpUrl.edit,this.detailForm)
          .then(res=>{
            if(!res['errorCode']){
              this.detailDialog = false;
              this.get();
            }
          })
      },
      getNotWorkGroup(){
        this.$xttp.post(httpUrl.getNotWordGroup,filterParams({
          userName:this.keyword
        })).then(res => {
            if(!res['errorCode']){
              this.targetList = res['data'];
            }
          })
      },
      getDetail(id,name){
        this.$xttp.get(`${httpUrl.detail}${id}/detail`)
          .then(res=>{
            if (!res['data'].groupList.some(val => val.groupMembers.length < 2)) {
              res['data'].groupList.push({
                groupName:`第${res['data'].groupList.length + 1}组`,
                groupMembers:[],
              })
            }
            //赋值 过滤get set
            this.leaderList = [{
              userId:res['data'].teamHeadId,
              headImg:res['data'].teamHeadImg,
              userName:res['data'].teamHeadName,
              mobile:res['data'].teamHeadPhone,
            }];
            this.aimsList = res['data'].groupList;
            this.detailForm = res['data'];
            this[name] = true;
          })
      },
      handleRefresh(){
        //初始化数据
        this.positionOption = [];
        this.viewAptitudes = [];
        this.viewSkilled = [];
        //请求数据
        this.get();
      }
    },
    watch:{
      keyword(newVal){
        clearImmediate(this.keywordTimer);
        this.keywordTimer = setTimeout(()=>{
          this.getNotWorkGroup();
        },500)
      },
    },
    mounted(){
      this.handleRefresh();
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../../style/mixins";
  .c-search {
    position: relative;
    width: 100%;
    .c-process {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }
  .con-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    .list-wrap {
      width: 100%;
      height: 100%;
    }
  }
  .detail-con{
    width: 100%;
    height: 500px;
    display: flex;
    .left {
      margin-right: 50px;
      padding-right: 50px;
      position: relative;
      .tit {
        font-weight: bold;
      }
      .el-input {
        margin-bottom: 16px;
      }
      &::before {
        content: '=>';
        position: absolute;
        right: 0;
        top: 30%;
      }
      &::after {
        content: '<=';
        position: absolute;
        right: 0;
        top: 35%;
      }
    }
    .right {
      .tit {
        height: 36px;
        display: flex;
        align-items: center;
      }
    }
    .list-wrap {
      border: 1px solid #eee;
      border-radius: 8px;
      min-height: 32px;
      max-height: 400px;
      overflow-y: auto;
      @include optimizationScroll;
      .drag-wrap {
        padding-left: 0;
        min-height: 32px;
        .list-complete-item {
          height: 32px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          padding: 0 16px;
          &:last-child{
            border-bottom: none;
            border-radius: 0 0 8px 8px;
          }
        }
        &[data-id='aims'] {
          .list-complete-item {
            background-color: #e6a23c;
            &:nth-child(1),&:nth-child(2){
              background-color: #fff;
            }
          }
        }
        &[data-id='leader'] {
          .list-complete-item {
            background-color: #e6a23c;
            &:nth-child(1){
              background-color: #fff;
            }
          }
        }
      }
    }
  }
</style>
<style lang="scss" >
  .flip-list-move {
    transition: transform 0.5s;
  }
</style>
