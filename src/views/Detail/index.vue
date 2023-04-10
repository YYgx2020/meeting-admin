<template>
  <div class="detail-page">
    <el-backtop />
    <div class="title-box">
      <div class="title">
        <h1>{{ articleInfo.title }}</h1>
      </div>
      <div class="created-time">
        <span>{{ articleInfo.createdAt }}</span>
      </div>
    </div>
    <div class="content-box">
      <mavon-editor style="box-shadow: none; padding:20px; border-radius: 0px;" v-html="articleInfo.html" />
    </div>
  </div>
</template>

<script>
import { getArticleInfo } from '@/api';
import dayjs from 'dayjs';
import { mavonEditor } from 'mavon-editor';
export default {
  name: 'detail',
  components: {
    mavonEditor,
  },
  data() {
    return {
      articleInfo: null,
      article_id: null,
    }
  },
  created() {
    console.log(this.$route.query);
    this.article_id = this.$route.query.article_id;
    this.getArticleInfo(this.article_id);
  },
  methods: {
    getArticleInfo(article_id) {
      getArticleInfo({ article_id }).then(res => {
        console.log(res);
        this.articleInfo = res.data.result;
        // dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
        this.articleInfo.createdAt = dayjs(this.articleInfo.createdAt).format("YYYY-MM-DD HH:mm:ss");
        document.title = this.articleInfo.title;
      })
    },
  },
}
</script>

<style lang="less">
.detail-page {
  background: #f5f5f5;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;

  .title-box {
    width: 1062px;
    min-width: 300px;
    // height: 100px;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;

    .title {
      // font-size: 36px;
    }

    .created-time {
      padding: 10px 0px;
    }
  }

  // 内容区域
  .content-box {
    width: 1062px;
  }
}
</style>