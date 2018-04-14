<template>
  <div class="c-login-container">
    <div class="bg"></div>
    <div class="login-area">
      <div class="header"><h2>后台登录</h2></div>
      <div class="form">
        <div class="form-item">
          <input type="text" placeholder="用户名" v-model.trim="form.mobile" autofocus />
        </div>
        <div class="form-item">
          <input type="password" placeholder="密码" v-model.trim="form.pwd"/>
          <!--<span class="verCode-btn" @click="setCodeCountdown">{{codeCountdown ? codeCountdown : '获取验证码'}}</span>-->
        </div>
      </div>
      <div class="footer">
        <button type="button" @click="login">登 录</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { Loading } from 'element-ui';
  export default {
    name: 'login',
    data() {
      return {
        form:{
          mobile: '15918729264',
          pwd: '123456',
          //添加图片验证码字段
        },
        options:[] ,//社区列表
        value: null ,//当前 社区
        codeCountdown:null,//短信倒计时
        errorCount:0,//错误次数
      }
    },
    methods: {
      /**
       * @description 登录
       */
      login() {
        this.$Validate({
          obj:this.form,
          rules:{
            mobile:{
              required:true,
              isPhone:true,
            },
            pwd:{
              required:true,
            }
          },
          msg:{
            mobile:{
              required:'请输入手机号码',
              isPhone:'请输入正确的手机号码',
            },
            pwd:{
              required:'请输入密码',
            }
          }
        }).then(()=>{
          let loadingInstance = Loading.service();
          this.$xttp.post('/user/signIn', this.form).then(res => {
            if (res.errorCode === 0) {
              this.$store.dispatch('changeToken', res.data);
              this.$router.push(this.beforeRouterPath);
            }
            //若密码错误 则记录 超过三次需图片验证码
            this.pwd = '';
            loadingInstance.close();
          }).catch(() => {
            loadingInstance.close();
          });
        })
      },
      /**
       * @description 设置倒数时间
       */
      setCodeCountdown(){
        if ( this.codeCountdown ) return false;
        this.codeCountdown = 120;
        let count = 119, timer = setInterval(() => {
          this.codeCountdown = count;
          if (count === 0) {
            this.codeCountdown = null;
            clearInterval(timer)
          }
          count--;
        }, 1000)
      },
    },
    computed: mapGetters(['beforeRouterPath']),
  }
</script>

<style scoped lang="scss">
  .c-login-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2000;
  }
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: #3d3d3d url('../../assets/login-bg.jpg') center;
    background-size: cover;
    filter: brightness(25%);
    z-index: -1;
  }
  .login-area {
    width: 420px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 10;
    transform: translate(-50%,-50%);
  }

  .login-area .header h2 {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    background-color: #eee;
    font-size: 18px;
    font-weight: bold;
  }

  .login-area .form {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 10px;
  }
  .login-area .form .form-item {
    display: flex;
    border-bottom: 1px solid #ddd;
    input {
      border: none;
      height: 44px;
      width: 100%;
      font-size: 14px;
    }
    .verCode-btn {
      width: 30%;
      font-size: 12px;
      line-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration:underline;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .login-area .footer {
    padding: 30px 20px;
  }
  .login-area .footer button {
    background-color: #f71e43;
    width: 100%;
    height: 44px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }
</style>
