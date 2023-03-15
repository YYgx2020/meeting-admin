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
        <div class="more-control-item" @click="changePersonInfo()">修改信息</div>
        <div class="more-control-item" @click="logout()">退出登录</div>
      </div>
      <!-- <el-button slot="reference">删除</el-button> -->
      <div slot="reference" class="avatar" @click="clickAvatarEvent()">
        <img :src="adminInfo.avatar" alt="">
      </div>
    </el-popover>
  </div>
</template>

<script>
import Cookie from 'js-cookie';
export default {
  name: 'Header',
  data() {
    return {
      adminInfo: null,
      showMoreControl: false,
      visible: false,
    }
  },
  created() {
    // 获取用户信息
    // console.log(JSON.parse(Cookie.get('userInfo')));
    this.adminInfo = JSON.parse(Cookie.get('userInfo'));
  },
  methods: {
    clickAvatarEvent() {
      this.showMoreControl = !this.showMoreControl;
    },
    changePersonInfo() {
      console.log('点击修改个人信息');
    },
    // 退出登录
    logout() {
      // 移除 cookie，跳回登录页面
      Cookie.remove('hrms_token');
      Cookie.remove('userInfo');
      this.$router.replace({
        name: 'login',
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

  .avatar {
    height: 48px;
    width: 48px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>