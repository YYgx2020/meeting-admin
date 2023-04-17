<template>
  <div class="recruitment-page">
    <!-- <h3>招聘管理页面</h3> -->
    <!-- 顶部搜索框、发布按钮 -->
    <div class="header-panel">
      <div class="search-box">
        <el-input v-model="keyWord" placeholder="请输入岗位名称"></el-input>
        <el-button style="margin-left: 12px;" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        <el-button type="primary" plain @click="resetData()">重置</el-button>
        <el-button type="danger" plain @click="delJob(selectData)">批量删除</el-button>
      </div>
      <div class="release">
        <el-button type="primary" @click="dialogVisible = true">发布</el-button>
      </div>
    </div>
    <!-- 填写窗口 -->
    <el-dialog :title="jobInfoForm.title" :visible.sync="dialogVisible" width="60%">
      <el-form :inline="true" :model="jobInfoForm">
        <el-row>
          <el-form-item label="岗位名称" label-width="80px">
            <el-input placeholder="请输入岗位名称" v-model="jobInfoForm.name"></el-input>
          </el-form-item>
          <el-form-item label="薪资" label-width="80px">
            <el-input placeholder="请输入岗位薪资" v-model="jobInfoForm.salary"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="城市" label-width="80px">
            <el-input placeholder="请输入岗位所在城市" v-model="jobInfoForm.city"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="经验要求" label-width="80px">
            <el-input placeholder="请输入岗位的经验要求" v-model="jobInfoForm.experiece"></el-input>
          </el-form-item>
          <el-form-item label="学历要求" label-width="80px">
            <el-input placeholder="请输入岗位的学历要求" v-model="jobInfoForm.degree"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="岗位描述" label-width="80px">
          </el-form-item>
          <el-input :autosize="{ minRows: 5, maxRows: 5 }" style="width: 100%" type="textarea"
            v-model="jobInfoForm.desc"></el-input>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="releaseJob()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 中部岗位列表 -->
    <div class="job-list-box">
      <el-table ref="multipleTable" :data="jobList" tooltip-effect="dark" style="width: 100%"
        @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="岗位名称" prop="name">
        </el-table-column>
        <el-table-column label="薪资" prop="salary">
        </el-table-column>
        <el-table-column label="城市" prop="city">
        </el-table-column>
        <el-table-column label="经验要求" prop="experiece">
        </el-table-column>
        <el-table-column label="学历要求" prop="degree">
        </el-table-column>
        <el-table-column label="岗位描述" prop="desc">
          <template slot-scope="scope">
            <el-popover placement="right-start" title="岗位描述" width="400" trigger="hover" :content="scope.row.desc">
              <!-- <span slot="reference" class="job-desc">{{ scope.row.desc }}</span> -->
              <span slot="reference" class="job-desc">{{ scope.row.desc }}</span>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="">
          <template slot-scope="scope">
            <span>{{ dayjs(scope.row.updateAt).format("YYYY-MM-DD") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editJobInfo(scope.row)">编辑</el-button>
            <el-button type="text" style="color: #f56c6c;" @click="delJob(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getJobList, addJob, updateJobInfo, searchJobByKeyWord, del } from '@/api';
export default {
  name: 'recruitment',
  data() {
    return {
      name: null,
      jobList: [],
      keyWord: null,
      // 是否展示对话框
      dialogVisible: false,
      count: 0,
      jobInfoForm: {
        title: '添加岗位',
        name: null,
        salary: null,
        city: null,
        experiece: null,
        degree: null,
        desc: null,
      },
      isEdit: false,
      selectData: [],
    }
  },
  created() {
    this.getJobList();
  },

  methods: {
    // 获取岗位列表
    getJobList() {
      this.isEdit = false;
      this.dialogVisible = false;
      this.jobInfoForm = {
        title: '添加岗位',
        name: null,
        salary: null,
        city: null,
        experiece: null,
        degree: null,
        desc: null,
      };
      this.selectData = [];
      getJobList().then(res => {
        console.log(res);
        this.jobList = res.data.result.rows;
        this.count = res.data.result.count;
      })
    },
    // 搜索岗位
    search() {
      searchJobByKeyWord({ keyWord: this.keyWord }).then(res => {
        console.log(res);
        this.count = res.data.result.count;
        this.jobList = res.data.result.rows;
      })
    },

    // 重置按钮
    resetData() {
      this.keyWord = null;
      this.getJobList();
    },

    // 编辑岗位
    editJobInfo(item) {
      this.jobInfoForm = item;
      this.jobInfoForm.title = '编辑岗位信息'
      this.dialogVisible = true;
      this.isEdit = true;
    },

    // 发布岗位
    releaseJob() {
      if (!this.isEdit) {
        addJob(this.jobInfoForm).then(res => {
          // console.log(res);
          this.getJobList();
        })
      } else {
        updateJobInfo(this.jobInfoForm).then(res => {
          // console.log(res);
          this.getJobList();
        })
      }

    },

    // 监听选中行事件
    handleSelectionChange(e) {
      console.log(e);
      this.selectData = e;
    },

    // 删除岗位
    delJob(item) {
      if (item instanceof Array) {
        if (item.length == 0) return;
      }
      this.$confirm('此操作将永久删除该岗位的招聘信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(item).then(res => {
          console.log(res);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getJobList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
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
  .job-desc {
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // border: none;
    // outline: none;
    // resize: none;
    // background: red;
  }

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