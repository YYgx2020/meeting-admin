<template>
  <div id="Header">
    <!-- 展示学校logo、管理员头像等 -->
    <!-- <div class="date"></div> -->
    <!-- <div class="avatar" @click="clickAvatarEvent()">
      <img :src="adminInfo.avatar" alt="">
    </div>
    <div ref="more" class="more-control" v-if="showMoreControl">
      <div class="more-control-item">修改信息</div>
      <div class="more-control-item">退出登录</div>
    </div> -->
    <!-- <el-popover placement="top" width="160" v-model="visible">
      <div ref="more" class="more-control">
        <div class="more-control-item">修改信息</div>
        <div class="more-control-item">退出登录</div>
      </div>
      <img :src="adminInfo.avatar" alt="">
    </el-popover> -->
    <el-popover popper-class="my-popover" placement="top" width="72" v-model="visible">
      <!-- <p>这是一段内容这是一段内容确定删除吗？</p> -->
      <div class="more-control">
        <div class="more-control-item" @click="dialogVisible1 = true">修改信息</div>
        <div class="more-control-item" @click="dialogVisible2 = true">修改密码</div>
        <div class="more-control-item" @click="logout()">退出登录</div>
      </div>
      <!-- <el-button slot="reference">删除</el-button> -->
      <div slot="reference" class="avatar" @click="clickAvatarEvent()">
        <!-- <img :src="avatar" alt=""> -->
        <img src="../../assets/images/avatar.png" alt="">
      </div>
    </el-popover>
    <!-- 修改信息弹窗 -->
    <el-dialog custom-class="my-dialog" style="text-align: left;" title="修改管理员信息" :visible.sync="dialogVisible1"
      width="30%">
      <el-form label-position="left" label-width="80px" :model="formLabelAlign">
        <el-form-item label="头像">
          <!-- <el-input v-model="formLabelAlign.name"></el-input> -->
          <el-upload class="avatar-uploader" action="#" :show-file-list="false" :http-request="uploadHttp">
            <img v-if="formLabelAlign.avatar" :src="formLabelAlign.avatar" class="_avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formLabelAlign.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="formLabelAlign.age"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formLabelAlign.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formLabelAlign.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="changePersonInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog custom-class="my-dialog" style="text-align: left;" title="修改密码" :visible.sync="dialogVisible2" width="30%">
      <!-- :rules="rules" -->
      <el-form label-position="left" label-width="80px" :model="resetPwdForm">
        <el-form-item label="账号" prop="code">
          <el-input v-model="resetPwdForm.code" disabled placeholder="请输入你的账号"></el-input>
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
            canSendCode ? captchaTime + " 秒后重试" : "获取邮箱验证码"
          }}</el-button>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="resetPwdEvent()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Cookie from 'js-cookie';
import { put } from '@/utils/alioss';
import { updateAdminInfoById, getVerifyCode, changePassword } from '@/api';
import { Notification } from 'element-ui';
export default {
  name: 'Header',
  data() {
    return {
      adminInfo: null,
      showMoreControl: false,
      visible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      resetLoading: false,
      // 管理员修改信息表单
      formLabelAlign: {
        id: null,
        avatar: null,
        name: null,
        age: null,
        phone: null,
        email: null,
      },

      // 管理员修改密码表单
      resetPwdForm: {
        code: null,
        password: null,
        verifyPwd: null,
        email: null,
        verifyCode: null,
      },
      canSendCode: false, // 设置是否可以发送验证码
      captchaTime: 60, // 验证码倒计时
      avatar: '../../assets/images/avatar.png',
    }
  },
  created() {
    // 获取用户信息
    console.log(JSON.parse(Cookie.get('userInfo')));
    this.adminInfo = JSON.parse(Cookie.get('userInfo'));
    this.formLabelAlign = { ...this.adminInfo };
    // this.resetPwdForm = { ...this.adminInfo };
    // this.resetPwdForm.verifyCode = null;
    this.resetPwdForm.code = this.adminInfo.code;
    this.resetPwdForm.password = this.adminInfo.password; // 保存旧密码到密码框中。如果用户没有密码框
    this.resetPwdForm.email = this.adminInfo.email; // 保存旧邮箱到密码框中。如果用户有邮箱框，
  },
  methods: {
    clickAvatarEvent() {
      this.showMoreControl = !this.showMoreControl;
    },
    changePersonInfo() {
      // console.log('点击修改个人信息');
      // this.dialogVisible1 = true;
      this.formLabelAlign.id = this.adminInfo.id;
      updateAdminInfoById(this.formLabelAlign).then(res => {
        console.log(res);
        this.logout();
      })
    },
    // 退出登录
    logout() {
      // 移除 cookie，跳回登录页面
      Cookie.remove('hrms_token');
      Cookie.remove('userInfo');
      this.$router.replace({
        name: 'login',
      })
    },

    // 上传用户头像
    uploadHttp(option) {
      console.log(option);
      const fileName = new Date().getTime() + '';
      const loading = this.$loading({
        lock: true,
        text: '图片上传中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // 调用 ali-oss 中的方法
      put(fileName, option.file).then(res => {
        console.log(res)
        loading.close();
        this.formLabelAlign.avatar = res.url;
      }).catch(err => {
        loading.close();
      })
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
    resetPwdEvent() {
      console.log('重置密码');
      const resetForm = JSON.parse(JSON.stringify(this.resetPwdForm));
      for (const value of Object.values(resetForm)) {
        if (value === null || value === "") {
          this.$message({
            message: "请填写完整的重置信息",
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
        this.logout();
        // this.show = !this.show;
      }).catch(err => {
        console.log(err);
        this.resetLoading = false;
      })
    }
  },
}
</script>

<style lang="less" scoped>
#Header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;

  .el-dialog {
    display: flex;
    align-items: flex-start;

    .avatar-uploader .el-upload {
      // border: 1px dashed #d9d9d9 !important;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      border: 1px dashed #d9d9d9 !important;
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }

    ._avatar {
      width: 120px;
      height: 120px;
      display: block;
    }
  }

  .avatar {
    height: 48px;
    width: 48px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
</style>