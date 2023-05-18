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
      <el-table-column prop="admin" label="申请人"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="createdAt" label="申请时间"></el-table-column>
      <el-table-column prop="ban_time" label="封禁时间"></el-table-column>
      <!-- 操作列表 -->
      <el-table-column fixed="right" label="操作" width="250">
        <template slot-scope="scope">
          <el-button @click="lookDetail(scope.row)" type="text" size="small">查看简介</el-button>
          <el-button @click="lookReason(scope.row)" type="text" size="small">查看封禁原因</el-button>
          <el-button @click="unseal(scope.row)" type="text" size="small">解封</el-button>
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
    <!-- 被封禁原因对话框 -->
    <el-dialog :title="orgNameReason" :visible.sync="showReason" width="40%">
      <span>{{ ban_reason }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showReason = false">确 定</el-button>
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
        is_delete: 1,
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
      showReason: false,
      noPassReason: null,
      banReason: null,
      currentItem: null,
      ban_reason: null,
      orgNameReason: null,
    }
  },
  created() {
    this.initData();
  },
  methods: {

    // 解封
    unseal(row) {
      const data = {
        id: row.id,
        is_delete: 0,
        phone: row.phone,
        admin: this.$store.state.name,
        admin_phone: this.$store.state.phone,
      }
      organization.unseal(data).then(res => {
        console.log(res);
        this.initData();
      })
    },

    lookReason(row) {
      this.currentItem = row;
      this.showReason = true;
      this.orgNameReason = row.name + '被封禁原因';
      this.ban_reason = row.ban_reason;
    },
    searchOrganizationByKeyWord() {
      if (this.keyWord === '' || this.keyWord === null) {
        this.$confirm('请输入搜素关键词', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        }).catch(() => {
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
            item.ban_time = dayjs(item.ban_time).format('YYYY年MM月DD日 HH:MM:ss');
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
      this.showReason = false;
      this.showDesc = false;
      organization.getPassList(this.pageData).then(res => {
        console.log(res);
        this.tableData = res.data.result.rows.map(item => {
          item.approval_time = dayjs(item.approval_time).format('YYYY年MM月DD日 HH:MM:ss');
          item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日 HH:MM:ss');
          item.ban_time = dayjs(item.ban_time).format('YYYY年MM月DD日 HH:MM:ss');
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

    // 通过事件
    pass(row) {
      const data = {
        id: row.id,
        is_pass: 1,
        no_pass_reason: null,
        phone: row.phone,
        admin: this.$store.state.userInfo.name,
        admin_phone: this.$store.state.userInfo.phone,
      }
      organization.pass(data).then(res => {
        console.log(res);
        this.initData();
      })
    },

    // 不通过
    noPass(row) {
      this.currentItem = row;
      this.showNoPassReasonInput = true;
    },
    // 确认不通过
    confirmNoPass() {
      const data = {
        id: this.currentItem.id,
        is_pass: -1,
        reason: this.noPassReason,
        phone: this.currentItem.phone,
        admin: this.$store.state.userInfo.name,
        admin_phone: this.$store.state.userInfo.phone,
      }
      organization.noPass(data).then(res => {
        console.log(res);
        this.initData();
      })
    },
  }
}
</script>

<style></style>