<template>
  <div id="Login">
    <!-- logo -->
    <div class="logo">
      <!-- <img src="../../assets/img/guet_logo.png" alt=""> -->
    </div>
    <!-- 标题 -->
    <div class="login_panel">
      <h1>会议室预约管理系统</h1>
      <div class="login_box">
        <h3>欢迎登录</h3>
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" :rules="rules"
          ref="formLabelAlign">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formLabelAlign.phone" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="formLabelAlign.password" maxlength="11"></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-link :underline="false">忘记密码？</el-link>
        </el-row>
        <el-button type="primary" round @click="loginEvent('formLabelAlign')">登录</el-button>
      </div>
    </div>
    <!-- 背景轮播图 -->
    <el-carousel indicator-position="none" height="100vh" arrow="never">
      <el-carousel-item v-for="(item, index) in cover" :key="index">
        <img :src="item" alt="">
        <!-- <img src="../../assets/img/1.jpg" alt=""> -->
      </el-carousel-item>
    </el-carousel>
    <div class="inner-header flex">
      <!-- <h1>简单的 CSS3 波浪效果</h1> -->
    </div>
    <!-- 主登录窗口 -->
    <div>
      <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
          <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
          <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
          <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
        </g>
      </svg>
    </div>
    <div class="space"></div>
  </div>
</template>

<script>
import { login, getVerifyCode, changePassword } from "@/api";
import Cookies from "js-cookie"; // 登录或者注册后使用 cookie 保存 token
import { Notification } from 'element-ui';
const expire_time = 1;
export default {
  name: "Login",
  components: {},
  data() {
    return {
      cover: [
        require('../../assets/images/1.jpg'),
        require('../../assets/images/2.jpg'),
        require('../../assets/images/3.jpg'),
        require('../../assets/images/4.jpg'),
        require('../../assets/images/5.jpg'),
      ],
      labelPosition: 'left',
      formLabelAlign: {
        phone: '',
        password: '',
      },
      rules: {
        phone: [
          {
            required: true, message: '请输入电话号码', trigger: 'blur',
          },
          {
            min: 11, max: 11, message: '请输入11位手机号码', trigger: 'blur'
          },
          {
            pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: '请输入正确的手机号码'
          },
        ],
        password: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          },
        ]
      }
    };
  },
  methods: {
    // 切换注册组件
    changeResetPwd() {
      // this.show = !this.show;
    },
    // 登录处理事件
    loginEvent(formLabelAlign) {
      const loginForm = JSON.parse(JSON.stringify(formLabelAlign));
      for (const value of Object.values(loginForm)) {
        if (value === null || value === "") {
          this.$message({
            message: "请填写完整的登录信息",
            type: "warning",
          });
          return;
        }
      }
      this.loading = true;
      this.$router.replace({
        name: 'home',
      }).catch(() => { })
      this.loading = false;
      // login(loginForm)
      //   .then((res) => {
      //     this.loading = false;
      //     console.log(res);
      //     // 跳转到首页去，把登录信息保存到存储中
      //     const { userInfo } = res.data.result
      //     if (this.checked) {
      //       // 1. 将 token 和用户基本信息保存到 localStorage 和 cookie 中
      //       // localStorage.setItem("yg_l_token", res.data.result.token)
      //       // localStorage.setItem("userInfo", JSON.stringify(userInfo))
      //       // 设置 cookie 5分钟后过期
      //       Cookies.set('hrms_token', res.data.result.token, {
      //         expires: expire_time
      //       })
      //       Cookies.set('userInfo', JSON.stringify(userInfo), {
      //         expires: expire_time
      //       })
      //     } else {
      //       console.log('不设置过期时间');
      //       // 不设置过期时间，浏览器一旦关闭，cookie 就会被清除
      //       Cookies.set('hrms_token', res.data.result.token)
      //       Cookies.set('userInfo', JSON.stringify(userInfo))
      //     }
      //     this.$router.replace({
      //       name: 'home',
      //     })
      //   })
      //   .catch((err) => {
      //   this.loading = false;
      //   console.log(err);
      // });
    },

    // 切换注册组件
    registerEvent() {
      // 跳转到登录页面
      this.$router.push({
        name: "register",
      });
    },


    // 取消重置密码
    cancelReset() {
      this.show = !this.show;
    },

    // 发送验证码
    async sendVerifyCode() {
      let timer1 = null;
      if (this.canSendCode) return;
      clearTimeout(timer1);
      console.log("邮箱：", this.resetPwdForm.email);
      let { email } = this.resetPwdForm;
      console.log("email: ", email);
      // 先查看邮箱是否填写
      if (email === null) {
        return;
      }
      try {
        let res = await getVerifyCode({ email });
        console.log("验证码获取结果：", res);
        // Notification({
        //   title: "成功",
        //   type: "success",
        //   message: res.data.message,
        //   offset: 100,
        // });
        this.canSendCode = true;
        this.countdownFun60();
      } catch (error) {
        console.log(error);
        Notification({
          title: "错误",
          type: "error",
          message: error.response.data.message,
          offset: 100,
        });
      }
      /*
        邮箱获取成功之后显示倒计时，
        这里不需要保存到本地存储，
        直接在页面显示就可以了，页面刷新了也没事。
      */
    },
    // 倒计时函数
    countdownFun60() {
      this.interval = setInterval(() => {
        this.captchaTime = this.captchaTime - 1;
        if (this.captchaTime === 0) {
          clearInterval(this.interval);
          this.canSendCode = false;
          this.captchaTime = this.fixedSecond2;
        }
      }, 1000);
    },
    // 重置密码
    resetPwdEvent(resetPwdForm) {
      console.log('重置密码');
      const resetForm = JSON.parse(JSON.stringify(resetPwdForm));
      for (const value of Object.values(resetForm)) {
        if (value === null || value === "") {
          this.$message({
            message: "请填写完整的登录信息",
            type: "warning",
          });
          return;
        }
      }
      this.resetLoading = true;
      console.log('resetForm: ', resetForm);
      // 重置密码请求
      changePassword(resetForm).then(res => {
        console.log(res);
        this.resetLoading = false;
        this.show = !this.show;
      }).catch(err => {
        console.log(err);
        this.resetLoading = false;
      })
    }
  },
};
</script>

<style lang="less">
@import url('@/assets/less/login.less');
</style>


<!-- 
  后台管理系统功能：
  机构管理
  用户管理
  会议室管理
 -->