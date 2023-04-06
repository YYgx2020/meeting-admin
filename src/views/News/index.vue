<template>
  <div class="news-page">
    <div class="header-panel">
      <div class="search-box">
        <el-input placeholder="输入搜索内容" v-model="keyWord"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchNewsByKeyWord()">搜索</el-button>
      </div>
      <div class="publish-button">
        <el-button type="primary" @click="publishNewArticle()">发布新文章</el-button>
      </div>
    </div>
    <div class="news-list">
      <div :class="widthClass" v-for="(item) in newsList" :key="item.id"></div>
      <!-- <div :class="widthClass"></div> -->
      <!-- <div :class="widthClass"></div> -->
      <!-- <div :class="widthClass"></div> -->
      <!-- <div :class="widthClass"></div> -->
      <!-- <div :class="widthClass"></div> -->
      <!-- <div :class="widthClass"></div> -->
      <!-- <div :class="widthClass"></div> -->
    </div>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="100" @next-click="nextPageEvent"
        @pre-click="prevPageEvent" @current-change="currentChangeEvent">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getNewsList } from '@/api';
export default {
  name: 'news',
  data() {
    return {
      keyWord: null,
      widthClass: null,
      newsList: [],
    }
  },
  created() {
    console.log(document.body.clientWidth);
    const width = document.body.clientWidth;
    if (width >= 1200 && width < 1600) {
      console.log('width-3 news-item');
      this.widthClass = 'width-3 news-item';
    } else if (width >= 1600 && width < 1900) {
      console.log('width-2 news-item');
      this.widthClass = 'width-2 news-item';
    } else {
      console.log('width-1 news-item');
      this.widthClass = 'width-1 news-item';
    }
    /* 
      > 1900: 15%, margin: 0 calc(10% / 6 / 2) 20px calc(10% / 6 / 2);
      > 1600: 18%, margin: 0px calc(10% / 6 / 2) 20px calc(10% / 6 / 2);
      > 1200: 22%, margin: 0px calc(15% / 6 / 2) 20px calc(15% / 6 / 2);
    */

    // 发请求获取数据
    this.getNewsList({ limit: 8, offset: 0 })
  },

  methods: {
    // 默认获取前八条数据
    getNewsList(data) {
      getNewsList(data).then(res => {
        console.log(res);
        this.newsList = res.data.result;
      })
    },
    nextPageEvent(e) {
      console.log(e);
    },
    prevPageEvent(e) {
      console.log(e);
    },
    currentChangeEvent(e) {
      console.log(e);
    },

    // 跳转到新闻编辑页面
    publishNewArticle() {
      let routeUrl = this.$router.resolve({
        name: 'editor',
        query: {
          new_article: new Date().getTime(),
        },
      });
      window.open(routeUrl.href, '_blank');
    },
  }
}
</script>

<style lang="less">
.header-panel {
  display: flex;
  line-height: 60px;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;

  .search-box {

    // width: 600px;
    .el-input {
      width: 180px;
      margin-right: 12px;
    }
  }
}

.news-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;

  .news-item {
    // width: 15%;
    height: 280px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    // margin: 0 calc(10% / 6 / 2) 20px calc(10% / 6 / 2);
    cursor: pointer;
  }

  // width >= 1900px
  .width-1 {
    width: 15%;
    margin: 0 calc(10% / 6 / 2) 20px calc(10% / 6 / 2);
  }

  // width >= 1600px
  .width-2 {
    width: 18%;
    margin: 0px calc(10% / 6 / 2) 20px calc(10% / 6 / 2);
  }

  // width >= 1200px
  .width-3 {
    width: 22%;
    margin: 0px calc(15% / 6 / 2) 20px calc(15% / 6 / 2);
  }
}

.pagination {
  display: flex;
  align-items: flex-end;
  flex-direction: row;
  justify-content: flex-end;
}
</style>