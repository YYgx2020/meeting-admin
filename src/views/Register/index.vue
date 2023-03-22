<template>
  <div class="register-page">
    <div class="register-box">
      <!-- <el-button type="primary" @click="returnLoginEvent()"
      >已有账号，返回登录</el-button
    > -->
      <h3 class="title-tip">请填写注册信息</h3>
      <el-form label-position="left" label-width="80px" :model="registerForm" :rules="rules" ref="registerForm">
        <!-- 工号 -->
        <el-form-item label="工号" prop="code">
          <el-input placeholder="请确认您的工号" v-model="registerForm.code"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" type="password" v-model="registerForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="verifyPwd">
          <el-input placeholder="请确认您的密码" type="password" v-model="registerForm.verifyPwd"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入您的真实姓名" v-model="registerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="registerForm.gender">
            <el-radio :label="0">女</el-radio>
            <el-radio :label="1">男</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input placeholder="请输入您的真实年龄" v-model="registerForm.age"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input placeholder="请输入您的手机号" v-model="registerForm.phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入您的邮箱" v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-row>
          <el-input maxlength="6" placeholder="请输入验证码" v-model="registerForm.verifyCode"></el-input>
          <el-button :disabled="canSendCode" type="primary" @click="sendVerifyCode()">{{
            canSendCode ? captchaTime + " 秒后重试" : "获取验证码"
          }}</el-button>
        </el-row>
        <el-button :disabled="loading" class="register-btn" type="primary"
          @click="registerEvent(registerForm)">申请注册</el-button>
        <el-button class="return-to-login" @click="returnLoginEvent()">已有账号，返回登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
// import encrypt from "@/utils/encrypt";
import { getVerifyCode, register, checkAdminCode } from "@/api";
import { Notification } from "element-ui";
export default {
  name: "register",
  data() {
    // 确认密码
    const verifyPwd = (rule, value, callback) => {
      // console.log("value: ", value);
      if (value === null) {
        callback(new Error("请再次输入密码"));
      } else if (this.registerForm.password !== value) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    // 判断年龄
    const checkAge = (rule, value, callback) => {
      if (value === null) {
        callback(new Error("请输入您的年龄"));
      } else {
        if (value * 1 < 25) {
          callback(new Error("您的年龄不符合公司管理员任职要求, 满25周岁"));
        }
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
      loading: false,
      canSendCode: false, // 设置是否可以发送验证码
      captchaTime: 60, // 验证码倒计时
      registerForm: {
        code: null,
        password: null,
        verifyPwd: null,
        name: null,
        gender: 1,
        age: null,
        phone: null,
        // department_id: null,
        email: null,
        verifyCode: null,
      },
      rules: {
        code: [{ required: true, message: "请输入您的工号", trigger: "blur" }],
        password: [
          { required: true, message: "请输入您的密码", trigger: "blur" },
        ],
        verifyPwd: [
          {
            required: true,
            validator: verifyPwd,
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入您的真实姓名",
          },
        ],
        gender: [
          {
            required: true,
          },
        ],
        age: [
          {
            required: true,
            validator: checkAge,
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            trigger: "blur",
            message: "请输入您的手机号",
          },
          {
            min: 11,
            max: 11,
            message: "请输入11位手机号码",
            trigger: "blur",
          },
          {
            pattern:
              /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            message: "请输入正确的手机号码",
          },
        ],
        email: [{ required: true, trigger: "blur", validator: checkEmail }],
      },
    };
  },
  methods: {
    // 发送验证码
    async sendVerifyCode() {
      let timer1 = null;
      if (this.canSendCode) return;
      clearTimeout(timer1);
      console.log("邮箱：", this.registerForm.email);
      let { email } = this.registerForm;
      console.log("email: ", email);
      // 先查看邮箱是否填写
      if (email === null) {
        return;
      }
      try {
        let res = await getVerifyCode({ email });
        console.log("验证码获取结果：", res);
        Notification({
          title: "成功",
          type: "success",
          message: res.data.message,
          offset: 100,
        });
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

    // 登录事件处理
    registerEvent(registerForm) {
      console.log("执行器");
      // console.log(Object.values(this.registerForm));
      console.log(registerForm);
      const dataObj = JSON.parse(JSON.stringify(registerForm));
      console.log(dataObj);
      for (const value of Object.values(dataObj)) {
        console.log(value);
        if (value === null) {
          this.$message({
            message: "请填写完整的注册信息",
            type: "warning",
          });
          return;
        }
      }
      this.loading = true;
      register(dataObj)
        .then((res) => {
          console.log("res: ", res);
          if (res.data.code !== 200) {
            // this.$message({
            //   message: res.data.message,
            //   type: "warning",
            // });
          } else {
            this.$alert(
              "您的注册申请已经提交，请耐心等待系统管理员审核",
              "提示",
              {
                confirmButtonText: "确定",
                callback: (action) => { },
              }
            );
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          console.log("err: ", err);
        });
    },

    // 切换登录组件
    returnLoginEvent() {
      this.$router.replace({
        name: "login",
      });
    },
  },
};
</script>

<style lang="less">
.register-page {
  display: flex;
  justify-content: center;

  .register-box {
    display: flex;
    width: 360px;
    margin-top: 100px;
    background: #fff;
    border-radius: 8px;
    border: solid 1px #c2c2c2;
    // box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    //   rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    padding: 30px;
    box-sizing: border-box;
    flex-direction: column;
    text-align: left;
    margin-bottom: 40px;

    .title-tip {
      margin-bottom: 30px;
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

    .register-btn {
      margin-top: 22px;
      margin-bottom: 22px;
      width: 100%;
    }

    .return-to-login {
      width: 100%;
      margin: 0;
      // padding: 0px;
    }
  }
}
</style>
