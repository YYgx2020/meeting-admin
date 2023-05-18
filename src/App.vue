<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}

// /deep/ .el-popover {
//     min-width: 50px;
//   }

// 修改头像的 el-popover 样式
.my-popover {
  min-width: 60px !important;
  text-align: center !important;
  .more-control {
    // margin-top: 140px;
    // position: absolute;
    // width: 80px;
    // background: #fff;
    // box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
    // padding: 8px;
    // border-radius: 10px;

    .more-control-item {
      line-height: 36px;
      font-size: 14px;
    }

    .more-control-item:hover {
      cursor: pointer;
      color: #409eff;
    }
  }
}

.page {
  display: flex;
  flex-direction: column;
  height: 100%;

  .pagination {
    height: 60px;
    // align-items: flex-end;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}

.top-panel {
  width: 100%;
  // height: 80px;
  line-height: 60px;

  display: flex;
  .el-input {
    width: 180px;
    margin-right: 12px;
  }

  .top-item {
    margin-right: 16px;
  }
}
</style>
