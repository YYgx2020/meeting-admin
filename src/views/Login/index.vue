<template>
  <div id="Login">
    <!-- 标题 -->
    <div class="login-panel">
      <div class="title">
        <h1>电子病历系统</h1>
      </div>
      <div class="login-box" v-if="show">
        <h3 class="title-tip">欢迎登录</h3>
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" :rules="rules"
          ref="formLabelAlign">
          <el-form-item label="账号" prop="code">
            <el-input v-model="formLabelAlign.code" placeholder="请输入你的账号" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入你的密码" v-model="formLabelAlign.password" maxlength="11"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 22px">
          <div>
            <el-checkbox style="float: left" v-model="checked">记住我</el-checkbox>
          </div>
          <div style="float: right">
            <el-link :underline="false" @click="changeResetPwd()">忘记密码？</el-link>
          </div>
        </div>
        <el-button :loading="loading" type="primary" round @click="loginEvent(formLabelAlign)">{{ loading ? '正在登录中...' :
          '登录' }}</el-button>
        <!-- <div class="register-panel">
          <el-button round @click="registerEvent()">申请账号</el-button>
        </div> -->
      </div>
      <!-- 重置密码 -->
      <div class="reset-pwd-box" v-if="!show">
        <h3 class="title-tip">重置密码</h3>
        <i class="el-icon-close icon" @click="cancelReset()"></i>
        <el-form :label-position="labelPosition" label-width="80px" :model="resetPwdForm" :rules="rules">
          <el-form-item label="账号" prop="code">
            <el-input v-model="resetPwdForm.code" placeholder="请输入你的账号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="resetPwdForm.password" placeholder="请输入你的密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="verifyPwd">
            <el-input type="password" v-model="resetPwdForm.verifyPwd" placeholder="请确认你的密码"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="resetPwdForm.email" placeholder="请输入你的邮箱"></el-input>
          </el-form-item>
          <el-row>
            <el-input maxlength="6" placeholder="请输入验证码" v-model="resetPwdForm.verifyCode"></el-input>
            <el-button :disabled="canSendCode" type="primary" @click="sendVerifyCode()">{{
              canSendCode ? captchaTime + " 秒后重试" : "获取验证码"
            }}</el-button>
          </el-row>
        </el-form>
        <el-button style="margin-top: 22px;" type="primary" round @click="resetPwdEvent(resetPwdForm)"
          :loading="resetLoading">{{ resetLoading ? '密码重置中...' : '重置密码' }}</el-button>
      </div>
    </div>
    <div class="inner-header flex"></div>
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
    // 确认密码
    const verifyPwd = (rule, value, callback) => {
      if (value === null || value === '') {
        callback(new Error("请再次输入密码"));
      } else if (this.resetPwdForm.password !== value) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 验证邮箱是否正确
    const checkEmail = (rule, value, callback) => {
      if (value === null) {
        callback(new Error("请输入您的邮箱"));
      } else {
        const reg =
          /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确的邮箱地址"));
        }
      }
    };
    return {
      show: true,
      checked: false,
      labelPosition: "left",
      canSendCode: false, // 设置是否可以发送验证码
      captchaTime: 60, // 验证码倒计时
      loading: false,
      resetLoading: false,
      formLabelAlign: {
        code: "",
        password: "",
      },
      resetPwdForm: {
        code: '',
        password: '',
        verifyPwd: '',
        email: '',
        verifyCode: '',
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入您的账号",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
        ],
        verifyPwd: [
          {
            required: true,
            validator: verifyPwd,
            trigger: "blur",
          },
        ],
        email: [{ required: true, trigger: "blur", validator: checkEmail }],
      },
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
      }).catch(() =>{})
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
// #Login {
//   overflow-y: scroll;
//   height: 100%;
// }

.login-panel {
  z-index: 600;
  position: fixed;
  text-align: center;
  width: 100vw;
  height: 100vh;
  // overflow-y: scroll;
  margin: auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  // padding: 40px 0px;
  .title {
    // margin-top: 240px;
    font-size: 30px;
    text-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px,
      rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
    color: #fff;
  }

  .login-box {
    margin-top: 30px;
    position: relative;
    width: 360px;
    height: 380px;
    background: #fff;
    border-radius: 8px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    padding: 30px;
    box-sizing: border-box;

    display: flex;
    justify-content: space-between;
    // align-content: space-around;
    flex-flow: column;
    text-align: left;

    .el-form {

      // margin-top: 20px;
      .el-form-item {
        .el-form-item__label {
          padding: 0px;
          line-height: 36px;
        }
      }
    }

    .el-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      justify-items: flex-end;
      padding: 0px;

      .el-link {
        justify-content: flex-end;
        line-height: 40px;
        width: 80px;
      }
    }

    .register-panel {
      margin-top: 16px;
      display: flex;
      justify-content: center;

      .el-button {
        width: 100%;
      }
    }
  }

  .title-tip {
    color: #000;
    margin-bottom: 22px;
  }

  .reset-pwd-box {
    margin-top: 30px;
    position: relative;
    width: 360px;
    background: #fff;
    border-radius: 8px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    padding: 30px;
    box-sizing: border-box;

    display: flex;
    justify-content: space-between;
    flex-flow: column;
    text-align: left;

    .icon {
      font-size: 22px;
      cursor: pointer;
      position: absolute;
      right: 20px;
    }

    .el-form {
      .el-row {
        display: flex;
        flex-direction: row;

        .el-input {
          margin-right: 20px;
        }
      }
    }
  }
}

.inner-header {
  z-index: 200;
  position: fixed;
  top: 0px;
  height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(60deg, #10239e 0%, #1e75b8 50%, #00cfbd 100%);
  opacity: 0.75;
}

// @import url("@/assets/less/login.less");
</style>
