<template>
  <div class="editor-page">
    <!-- <h3>新闻编辑页面</h3> -->
    <!-- 标题输入框 -->
    <div class="header">
      <div class="title-input">
        <!-- <el-input v-model="title" placeholder="请输入内容"></el-input> -->
        <input type="text" v-model="title" placeholder="请输入标题...">
      </div>
      <div class="control-button">
        <el-button @click="save()">保存</el-button>
        <el-button type="primary" @click="dialogVisible = true">发布</el-button>
      </div>
    </div>
    <el-dialog title="提交提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <p>文章标题: {{ title }}</p>
      <p>上传文章封面</p>
      <el-upload class="avatar-uploader" :http-request="uploadHttp" action="#" :show-file-list="false"
        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="cover" :src="cover" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <p>文章简介：</p>
      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容" v-model="brief">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="save()">保 存</el-button>
        <el-button type="primary" @click="submitEvent()">发 布</el-button>
      </span>
    </el-dialog>
    <mavon-editor v-model="content" ref="md" :toolbars="toolbars" @imgAdd="imgAdd" @change="change"
      style="min-height: calc(100vh - 60px);"></mavon-editor>
  </div>
</template>

<script>
import { addArticle, updateArticle } from '@/api';
import { put } from '../../utils/alioss';
import OSS from '../../utils/aliyun-oss-sdk.min.js';
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import Cookie from "js-cookie";
export default {
  name: 'editor',
  components: {
    mavonEditor,
  },
  data() {
    return {
      title: '',
      cover: '',
      brief: '',
      content: null,
      html: null,
      dialogVisible: false,
      article_id: '',
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: false, // 标记
        superscript: false, // 上角标
        subscript: false, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: false, // 下一步
        trash: false, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: false, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
        boxShadow: false
      },
    }
  },
  created() {
    // 查看路由信息，是否有 token
    const token = Cookie.get('hrms_token');
    if (!token) {
      this.$router.replace({ name: 'login' });
    }
    console.log(this.$route.query);
    // 获取文章信息
    this.article_id = this.$route.query.new_article;
    // 进来后先创建文章
    addArticle({ article_id: this.article_id }).then(res => {
      console.log(res);
      this.title = res.data.result.title;
      this.article_id = res.data.result.article_id;
      this.cover = res.data.result.cover;
      this.brief = res.data.result.brief;
      this.content = res.data.result.content;
      this.html = res.data.result.html;
    }).then(err => {
      console.log(err);
    })
  },

  methods: {
    imgAdd(pos, file) {
      console.log(pos, file);
      const formData = new FormData();
      formData.append('file', file);
      console.log('formData: ', formData);
      // this.Upload(file);
      const urlData = file.miniurl;
      const base64 = urlData.split(',').pop();
      const fileType = urlData.split(';').shift().split(':').pop();

      // base64转blob
      const blob = this.toBlob(base64, fileType);

      // blob转arrayBuffer
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onload = event => {
        // console.log(event);
        // 配置
        const client = new OSS.Wrapper({
          region: 'oss-cn-guangzhou',
          accessKeyId: 'LTAI5tRUSMEuLtafGBhrcqAi',
          accessKeySecret: '0DiPjUxmBaDX1G7MMOZDhbdZnCBAsF',
          bucket: 'hrms-gan'
        });
        // 文件名
        const objectKey = `uploads/file/${new Date().getTime()}.${fileType.split('/').pop()}`;
        // arrayBuffer转Buffer
        const buffer = new OSS.Buffer(event.target.result);
        // 上传
        const loading = this.$loading({
          lock: true,
          text: '图片上传中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        client.put(objectKey, buffer).then(result => {
          this.$refs.md.$img2Url(pos, result.url);
          loading.close();
        }).catch(err => {
          console.log(err);
          loading.close();
        });
      }
    },

    // 所有操作都会被解析重新渲染
    change(value, render) {
      console.log(value, render);
      // render 为 markdown 解析后的结果[html]
      this.html = render;
    },

    toBlob(urlData, fileType) {
      let bytes = window.atob(urlData);
      let n = bytes.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bytes.charCodeAt(n);
      }
      return new Blob([u8arr], { type: fileType });
    },

    Upload(file) {
      console.log(file);
      let fileName = 'banner' + `${Date.parse(new Date())}` + '.jpg';  //定义唯一的文件名

      //定义唯一的文件名，打印出来的uid其实就是时间戳
      client().multipartUpload(fileName, file.miniurl).then(
        result => {
          //此处为给自己属性进行赋值，http后面的代码很有可能会和我的不一样，一切与自己阿里云上的数据为准
          this.contacts.conImg = 'http://hrms-gan.oss-cn-guangzhou.aliyuncs.com/' + fileName;

          // 大功搞成  
          //下面是如果对返回结果再进行处理，根据项目需要，下面是我们自己项目所用的，仅供参考
          this.fileList[0] =
          {
            'name': result.name,
            'url': result.url
          }
          uploadBannerPic(this.fileList).then(res => {
            //此处为给自己属性进行赋值，http后面的代码很有可能会和我的不一样，一切与自己阿里云上的数据为准
            //根据需要可能项目还需对自己的数据库进行保存
            this.contacts.conImg = 'http://hrms-gan.oss-cn-guangzhou.aliyuncs.com/' + this.fileList[0].result.name;
          })
        })
    },

    /**
     * 图片限制
     * 图片限制在理论上来说可以不用写，如果想要简单，可以不写
     * 上传图片切记不要过大，可能会导致上传失败
     */
    beforeAvatarUpload(file) {
      const isJPEG = file.name.split('.')[1] === 'jpeg';
      const isJPG = file.name.split('.')[1] === 'jpg';
      const isPNG = file.name.split('.')[1] === 'png';
      const isLt500K = file.size / 1024 / 500 < 2;
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error('上传图片只能是 JPEG/JPG/PNG 格式!');
      }
      if (!isLt500K) {
        this.$message.error('单张图片大小不能超过 500KB!');
      }

      return (isJPEG || isJPG || isPNG) && isLt500K;
    },

    // 保存文章
    save() {
      const {
        title,
        article_id,
        cover,
        brief,
        content,
        html, } = this;
      // console.log(title);
      // 保存是对文章进行更新
      updateArticle({
        title,
        article_id,
        cover,
        brief,
        content,
        html,
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      })
    },

    // 发布文章
    submitEvent() {
      console.log(this.title);
      updateArticle();
    },

    handleAvatarSuccess(e) {
      console.log(e);
    },

    beforeAvatarUpload(e) {
      console.log(e);
    },

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
        this.cover = res.url;
      }).catch(err => {
        loading.close();
      })
    },

    handleClose(option) {
    },
  }
}
</script>

<style lang="less">
.header {
  width: 100%;
  height: 60px;
  // line-height: 120px;
  display: flex;
  flex-direction: row;

  .title-input {
    padding: 0px 20px;
    width: calc(100vw - 170px);

    input {
      line-height: 60px;
      outline: none;
      border: 0;
      font-size: 30px;
    }

    input:focus {
      outline: none;
    }
  }

  .control-button {
    width: 170px;
    line-height: 60px;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>