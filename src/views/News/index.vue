<template>
  <div class="news-page">
    <div class="header-panel">
      <div class="search-box">
        <el-input placeholder="输入搜索内容" v-model="keyWord"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchNewsByKeyWord()">搜索</el-button>
        <el-button type="primary" plain @click="resetData()">重置</el-button>
        <el-button type="danger" plain @click="delSelectedArticle(selectData)">批量删除</el-button>
      </div>
      <div class="publish-button">
        <el-button type="primary" @click="publishNewArticle()">发布新文章</el-button>
      </div>
    </div>
    <div v-if="false" class="news-list">
      <div :class="widthClass" v-for="(item) in newsList" :key="item.id" @click="lookDetail(item)">
        <div class="item-tag" v-if="!item.is_publish">
          <span>草稿</span>
        </div>
        <div class="item-cover">
          <img v-if="!item.cover" src="../../assets/images/no-cover.png" alt="">
          <img v-if="item.cover" :src="item.cover" alt="">
        </div>
        <div class="item-title">
          <span>{{ item.title }}</span>
        </div>
        <div class="editor-panel">
          <el-button @click.stop="toEditorPage(item)" type="text">编辑</el-button>
        </div>
      </div>
    </div>
    <div class="news-list">
      <el-table ref="multipleTable" :data="newsList" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="文章标题">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image style="width: 40px; height: 40px" :src="scope.row.cover" :preview-src-list="[scope.row.cover]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="is_publish" label="发布状态" width="100"
          :filters="[{ text: '未发布', value: false }, { text: '已发布', value: true }]" :filter-method="filterApplyStatus"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.statusClass" disable-transitions>{{
              scope.row.statusText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.is_publish" @click="lookDetail(scope.row)">查看</el-button>
            <el-button type="text" @click="toEditorPage(scope.row)">编辑</el-button>
            <el-button type="text" style="color: #f56c6c;" @click="delArticle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="count" @next-click="nextPageEvent"
        @pre-click="prevPageEvent" @current-change="currentChangeEvent">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getNewsList, delArticle, searchNewsByKeyWord } from '@/api';
export default {
  name: 'news',
  data() {
    return {
      keyWord: null,
      widthClass: null,
      newsList: [],
      limit: 8,
      offset: 0,
      count: 0,
      selectData: [],
    }
  },
  created() {
    console.log(document.body.clientWidth);
    // const width = document.body.clientWidth;
    // if (width >= 1200 && width < 1600) {
    //   console.log('width-3 news-item');
    //   this.widthClass = 'width-3 news-item';
    // } else if (width >= 1600 && width < 1900) {
    //   console.log('width-2 news-item');
    //   this.widthClass = 'width-2 news-item';
    // } else {
    //   console.log('width-1 news-item');
    //   this.widthClass = 'width-1 news-item';
    // }
    /* 
      > 1900: 15%, margin: 0 calc(10% / 6 / 2) 20px calc(10% / 6 / 2);
      > 1600: 18%, margin: 0px calc(10% / 6 / 2) 20px calc(10% / 6 / 2);
      > 1200: 22%, margin: 0px calc(15% / 6 / 2) 20px calc(15% / 6 / 2);
    */

    // 发请求获取数据
    this.getNewsList()
  },

  methods: {
    // 模糊查找
    searchNewsByKeyWord() {
      searchNewsByKeyWord({ keyWord: this.keyWord }).then(res => {
        console.log(res);
        this.initData(res.data.result.rows, res.data.result.count);
      })
    },

    // 重置
    resetData() {
      this.keyWord = null;
      this.getNewsList()
    },
    initData(result, count) {
      this.newsList = result.map(item => {
        if (item.is_publish) {
          item.statusText = '已发布';
          item.statusClass = 'success'
        } else {
          item.statusText = '未发布'
          item.statusClass = 'info'
        }
        return item;
      });
      this.count = count;
    },
    // 默认获取前八条数据
    getNewsList() {
      const data = {
        limit: this.limit,
        offset: this.offset,
      }
      this.selectData = [];
      getNewsList(data).then(res => {
        console.log(res);
        this.initData(res.data.result.rows, res.data.result.count);
      })
    },

    // 分页相关
    nextPageEvent(e) {
      console.log(e);
    },
    prevPageEvent(e) {
      console.log(e);
    },
    currentChangeEvent(e) {
      console.log(e);
    },

    // 根据标签进行筛选
    filterApplyStatus(value, row) {
      // console.log(value, row);
      return row.is_publish === value;
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

    // 跳转到新闻查看页面
    lookDetail(item) {
      console.log(item);
      if (!item.is_publish) {
        return;
      }
      const routeUrl = this.$router.resolve({
        name: 'detail',
        query: {
          article_id: item.article_id,
        },
      })
      window.open(routeUrl.href, '_blank');
    },

    // 未发布的文章跳转到文章编辑页面
    toEditorPage(item) {
      console.log(item);
      let routeUrl = this.$router.resolve({
        name: 'editor',
        query: {
          new_article: item.article_id,
        },
      });
      window.open(routeUrl.href, '_blank');
    },

    // 删除文章
    delArticle(item) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delArticle(item).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getNewsList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      // delArticle(item).then(res => {
      //   this.getNewsList()
      // })
    },

    // 监听选中行
    handleSelectionChange(e) {
      console.log(e);
      this.selectData = e;
    },

    delSelectedArticle() {

    }
  }
}
</script>

<style lang="less">
@import url('@/assets/less/news.less');
</style>