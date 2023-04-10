<template>
  <div class="recruitment-page">
    <!-- <h3>招聘管理页面</h3> -->
    <!-- 顶部搜索框、发布按钮 -->
    <div class="header-panel">
      <div class="search-box">
        <el-input v-model="name" placeholder="请输入岗位名称"></el-input>
        <el-button style="margin-left: 12px;" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
      </div>
      <div class="release">
        <el-button type="primary" @click="releaseJob()">发布</el-button>
      </div>
    </div>
    <!-- 中部岗位卡片 -->
    <div class="job-list-box">
      <!-- <ul>
        <li class="sub-li" v-for="item in jobList" :key="item.id">
          <div class="sub-li-top">
            <div class="name">带货主播</div>
            <div class="salary">12-24K·18薪</div>
          </div>
          <el-row class="sub-li-bottom">
            <el-tag type="info">深圳</el-tag>
            <el-tag type="info">1-3年</el-tag>
            <el-tag type="info">本科</el-tag>
          </el-row>
        </li>
      </ul> -->
    </div>
  </div>
</template>

<script>
import { getJobList } from '@/api';
export default {
  name: 'recruitment',
  data() {
    return {
      name: null,
      jobList: [1, 2, 3, 4, 5, 6, 7],
    }
  },
  created() {
    this.getJobList();
  },

  methods: {
    // 获取岗位列表
    getJobList() {
      getJobList().then(res => {
        console.log(res);
      })
    },
    // 搜索岗位
    search() {

    },
    // 发布岗位
    releaseJob() {

    },
  }
}
</script>

<style lang="less">
.header-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  line-height: 60px;

  .search-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    // line-height: 60px;
    // justify-content: center;
    // justify-content: space-around;
  }
}

.job-list-box {
  // margin-top: 20px;

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;

    .sub-li {
      width: 290px;
      height: 110px;
      padding: 20px;
      margin: 10px;
      border-radius: 10px;
      box-sizing: border-box;
      box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      .sub-li-top {
        display: flex;
        justify-content: space-between;

        .salary {
          color: #fe574a;
        }
      }
      .sub-li-bottom {
        .el-tag {
          margin-right: 10px;
        }
      }
    }

    .sub-li:hover {
      .sub-li-top {
        .name {
          color: #409eff;
        }
      }
    }
  }
}
</style>