<template>
  <div id="Menu">
    <!-- 
      功能：
      1.处理预约 handleAppointments
      2.学生/教师认证申请审核 UserManagement
      3.会议室管理 roomManagement
    -->
    <el-menu :router='true' :default-active="path" class="el-menu-vertical-demo" background-color="#304156"
      text-color="#fff" active-text-color="#409EFF">
      <div v-for="(item, index) in menus" :key="index + ''">
        <el-menu-item :index="item.path" v-if="index !== menus.length - 1">
          <i :class="item.icon" class="icon"></i>
          <span slot="title">{{ item.meta.title }}
          </span>
        </el-menu-item>
      </div>
      <el-submenu index="1">
        <template slot="title">
          <i class="iconfont icon-shenpi icon"></i>
          <span>审批管理</span>
        </template>
        <div v-for="(item, index) in menus[menus.length - 1].children" :key="index + ''">
          <el-menu-item :index="item.path" v-if="item.name === 'admin' ? adminInfo.is_super : 1">
            <!-- <i :class="item.icon" class="icon"></i> -->
            <span slot="title">{{ item.meta.title }}
            </span>
          </el-menu-item>
        </div>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Menu',
  data() {
    return {
      path: null,
      menus: [],
      adminInfo: null,
    }
  },
  created() {
    this.path = window.location.pathname;
    console.log(window.location.pathname);
    // console.log(this.$store.state.adminInfo);
    this.adminInfo = this.$store.state.adminInfo;
    // 目前菜单较少
    this.menus = [...this.$router.options.routes[2].children];
  },
}
</script>

<style lang="less" scoped>
@import '@/assets/icon/iconfont.css';

#Menu {
  height: calc(100vh - 60px);
  // width: 120px;
  .icon {
    padding-right: 10px;
    // color: #fff;
  }

  .el-menu {
    text-align: left;
    border-right: none;
  }
}
</style>