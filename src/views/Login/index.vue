<template>
  <div id="Login">
    <!-- 标题 -->
    <div class="login-panel">
      <div class="title">
        <h1>小型公司人资管理系统</h1>
      </div>
      <div class="login-box">
        <h3>欢迎登录</h3>
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" :rules="rules"
          ref="formLabelAlign">
          <el-form-item label="账号" prop="code">
            <el-input v-model="formLabelAlign.code" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="formLabelAlign.password" maxlength="11"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin-bottom: 22px">
          <div>
            <el-checkbox style="float: left" v-model="checked">记住我</el-checkbox>
          </div>
          <div style="float: right">
            <el-link :underline="false">忘记密码？</el-link>
          </div>
        </div>
        <!-- <el-row>
          
        </el-row> -->
        <el-button :loading="loading" type="primary" round @click="loginEvent(formLabelAlign)">{{ loading? '正在登录中...': '登录' }}</el-button>
        <div class="register-panel">
          <el-button round @click="registerEvent()">申请账号</el-button>
        </div>
      </div>
      <!-- <login-component></login-component> -->
      <!-- <register-component></register-component> -->
    </div>
    <div class="inner-header flex"></div>
  </div>
</template>

<script>
import { login } from "@/api";
import Cookies from "js-cookie"; // 登录或者注册后使用 cookie 保存 token
const expire_time = 1;
export default {
  name: "Login",
  components: {},
  data() {
    return {
      checked: false,
      labelPosition: "left",
      loading: false,
      formLabelAlign: {
        code: "",
        password: "",
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
      },
    };
  },
  methods: {
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
      login(loginForm)
        .then((res) => {
          this.loading = false;
          console.log(res);
          // 跳转到首页去，把登录信息保存到存储中
          const { userInfo } = res.data.result
          if (this.checked) {
            // 1. 将 token 和用户基本信息保存到 localStorage 和 cookie 中
            // localStorage.setItem("yg_l_token", res.data.result.token)
            // localStorage.setItem("userInfo", JSON.stringify(userInfo))
            // 设置 cookie 5分钟后过期
            Cookies.set('hrms_token', res.data.result.token, {
              expires: expire_time
            })
            Cookies.set('userInfo', JSON.stringify(userInfo), {
              expires: expire_time
            })
          } else {
            console.log('不设置过期时间');
            // 不设置过期时间，浏览器一旦关闭，cookie 就会被清除
            Cookies.set('hrms_token', res.data.result.token)
            Cookies.set('userInfo', JSON.stringify(userInfo))
          }
          this.$router.replace({
            name: 'home',
          })
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },

    // 切换注册组件
    registerEvent() {
      // 跳转到登录页面
      this.$router.push({
        name: "register",
      });
    },
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

    h3 {
      color: #000;
      margin-bottom: 22px;
    }

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
