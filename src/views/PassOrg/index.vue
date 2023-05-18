<template>
  <div class="page">
    <!-- 机构查看页面 -->
    <div class="top-panel">
      <div class="top-item">
        <el-input placeholder="输入机构名称" v-model="keyWord"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchOrganizationByKeyWord()">查找</el-button>
      </div>
      <div class="top-item">
        <el-button type="primary" plain @click="resetData()">重置</el-button>
      </div>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="name" label="机构名"></el-table-column>
      <el-table-column prop="type" label="机构类型" :filters="types1" :filter-method="filterOrgType"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type === 1 ? 'warning' : ''" disable-transitions>{{ scope.row.type == 1 ? '学校' : '企业'
          }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="admin" label="管理员"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="createdAt" label="申请时间"></el-table-column>
      <el-table-column prop="approval_time" label="审核通过时间"></el-table-column>
      <!-- 操作列表 -->
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="lookDetail(scope.row)" type="text" size="small">查看简介</el-button>
          <el-button @click="showBanBtn(scope.row)" type="text" style="color: red;" size="small">封禁</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="total" @prev-click="handlePrevClick"
        @next-click="handleNextClick" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <!-- 查看简介对话框 -->
    <el-dialog :title="orgName" :visible.sync="showDesc" width="40%">
      <span>{{ desc }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDesc = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 展示封禁原因 -->
    <el-dialog title="封禁原因" :visible.sync="showBan" width="40%">
      <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="banReason">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmBan()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { organization } from '@/api';
import dayjs from 'dayjs';
export default {
  data() {
    return {
      keyWord: null,
      tableData: [],
      desc: null,
      orgName: null,
      total: 0,
      pageData: {
        offset: 0,
        limit: 10,
        is_pass: 1,
        is_delete: 0,
      },
      types1: [
        {
          text: '学校',
          value: 1,
        },
        {
          text: '企业',
          value: 2,
        }
      ],
      showDesc: false,
      showBan: false,
      banReason: null,
      currentItem: null,
    }
  },
  created() {
    this.initData();
  },
  methods: {
    searchOrganizationByKeyWord() {
      if (this.keyWord === '' || this.keyWord === null) {
        this.$confirm('请输入搜素关键词', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
        }).catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: '已取消删除'
          // });
        });
      } else {
        const data = {
          keyWord: this.keyWord,
          ...this.pageData,
        };
        organization.searchByKeyWord(data).then(res => {
          console.log(res);
          this.tableData = res.data.result.map(item => {
            item.approval_time = dayjs(item.approval_time).format('YYYY年MM月DD日 HH:MM:ss');
            item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日 HH:MM:ss');
            return item;
          });
          this.total = res.data.result.length;
        })
      }
    },

    filterOrgType(value, row) {
      return row.type == value;
    },
    initData() {
      this.showBan = false;
      this.showDesc = false;
      organization.getPassList(this.pageData).then(res => {
        console.log(res);
        this.tableData = res.data.result.rows.map(item => {
          item.approval_time = dayjs(item.approval_time).format('YYYY年MM月DD日 HH:MM:ss');
          item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日 HH:MM:ss');
          return item;
        });
        this.total = res.data.result.count;
      })
    },
    // 分页
    handleCurrentChange(value) {
      console.log(value);
      this.pageData.offset = (value - 1) * 10;
      this.initData();
    },

    handlePrevClick() {
      this.pageData.offset = this.pageData.offset - 10;
      console.log(this.pageData.offset);
      this.initData();
      this.initData();
    },

    handleNextClick() {
      this.pageData.offset = this.pageData.offset + 10;
      console.log(this.pageData.offset);
      this.initData();
    },

    resetData() {
      this.keyWord = null;
      this.pageData.offset = 0;
      this.initData();
    },

    // 查看简介
    lookDetail(row) {
      console.log(row);
      this.showDesc = true;
      this.desc = row.description;
      this.orgName = row.name + '简介';
    },

    // 封禁机构的使用
    showBanBtn(row) {
      this.showBan = true;
      this.currentItem = row;
    },

    confirmBan() {
      this.$confirm('此操作将封禁该机构的使用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: this.currentItem.id,
          is_delete: 1,
          phone: this.currentItem.phone,
          admin: this.$store.state.name,
          admin_phone: this.$store.state.phone,
          reason: this.banReason,
          ban_time: new Date(),
        }
        organization.del(data).then(res => {
          // console.log(res);
          this.$message({
            type: 'success',
            message: '操作成功!'
          });
          this.initData();
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消封禁'
        });
      });
    },
  }
}
</script>

<style></style>