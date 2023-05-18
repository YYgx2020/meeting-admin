<template>
  <div class="page">
    <div v-if="false">
      <!-- 机构查看页面 -->
      <div class="top-panel">
        <div class="top-item">
          <el-input placeholder="输入关键词查询" v-model="keyWord"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="searchOrganizationByKeyWord()">查找机构</el-button>
        </div>
        <!-- <div class="top-item">
        <el-dropdown trigger="click" style="cursor: pointer;" @command="handleTypeSelect">
          <span class="el-dropdown-link">
            机构类型<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item.text" v-for="(item, index) in types" :key="index">{{ item.text }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div> -->
        <div class="top-item">
          <el-button type="primary" plain @click="resetData()">重置</el-button>
        </div>
        <div class="top-item">
          <el-button type="text" style="color: red;" @click="getDeleteList()">封禁列表</el-button>
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
        <!-- <el-table-column prop="email" label="邮箱"></el-table-column> -->
        <el-table-column prop="type" label="审核状态" :filters="types2" :filter-method="filterIsPass"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag :type="scope.row.statusColor" disable-transitions>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <!-- 操作列表 -->
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="lookDetail(scope.row)" type="text" size="small">查看简介</el-button>
            <el-button v-if="scope.row.is_pass == -1" @click="lookReason(scope.row)" type="text"
              size="small">查看原因</el-button>
            <el-button v-if="scope.row.is_pass === 0" @click="pass(scope.row)" type="text" size="small">通过</el-button>
            <el-button v-if="scope.row.is_pass === 0" @click="noPass(scope.row)" style="color: #f56c6c;" type="text"
              size="small">不通过</el-button>
            <el-button @click="del(scope.row)" style="color: #f56c6c;" type="text" size="small">删除</el-button>
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
      <!-- 不通过原因对话框 -->
      <el-dialog title="输入不通过原因" :visible.sync="showNoPassReasonInput" width="40%">
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="noPassReason">
        </el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showNoPassReasonInput = false">取 消</el-button>
          <el-button type="primary" @click="confirmNoPass()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 展示不通过原因对话框 -->
      <el-dialog title="不通过原因" :visible.sync="showReason" width="40%">
        <span>{{ noPassReason }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showReason = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { organization } from '@/api';

import orgList from '@/utils/data/organization.js';
import dayjs from 'dayjs';

export default {
  name: "Organization",
  components: {},
  data() {
    return {
      keyWord: null,
      keyWord2: null,
      tableData: null,
      showDesc: false,
      orgName: null,
      desc: null,
      showNoPassReasonInput: false,
      showReason: false,
      noPassReason: null,
      // 展示删除列表
      showDeleteTable: false,
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
      types2: [
        {
          text: '待审核',
          value: 0,
        },
        {
          text: '通过',
          value: 1,
        },
        {
          text: '不通过',
          value: -1,
        }
      ],
      searchType: false,
      offset: 0,
      limit: 10,
      total: 0,
      currentItem: null,
    }
  },
  created() {
    // console.log(organization.getDataList(data));
    // this.getDataList();
    this.initData();
  },

  methods: {
    searchOrganizationByKeyWord() {
      organization.search({ keyWord: this.keyWord }).then(res => {
        console.log(res);
        this.tableData = res.data.result;
        this.total = res.data.result.length;
      })
    },
    initData() {
      this.keyWord = null;
      this.showDesc = false;
      this.showNoPassReasonInput = false;
      this.showDeleteTable = false;
      // console.log(orgList);
      const data = {
        offset: this.offset,
        limit: this.limit,
      }
      organization.get(data).then(res => {
        console.log(res);
        this.tableData = res.data.result.rows.map(item => {
          if (item.is_pass === 0) {
            item.statusColor = 'info';
            item.status = '待审核';
          } else if (item.is_pass === 1) {
            item.statusColor = 'success';
            item.status = '通过';
          } else {
            item.statusColor = 'danger';
            item.status = '不通过';
          }
          item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日 HH:MM:ss');
          return item;
        })
        this.total = res.data.result.count;
      })
    },

    filterOrgType(value, row) {
      return value == row.type;
    },

    filterIsPass(value, row) {
      return value == row.is_pass;
    },

    lookDetail(row) {
      console.log(row);
      this.showDesc = true;
      this.desc = row.description;
      this.orgName = row.name + '简介';
    },

    // 查看原因
    lookReason(row) {
      this.showReason = true;
      this.noPassReason = row.no_pass_reason;
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
      // const data = {
      //   id: row.id,
      //   is_pass: -1,
      //   // no_pass_reason: 
      // }
    },

    // 确认不通过
    confirmNoPass() {
      const data = {
        id: this.currentItem.id,
        is_pass: -1,
        no_pass_reason: this.noPassReason,
        phone: this.currentItem.phone,
        admin: this.$store.state.userInfo.name,
        admin_phone: this.$store.state.userInfo.phone,
      }
      organization.noPass(data).then(res => {
        console.log(res);
        this.initData();
      })
    },

    // 分页
    handleCurrentChange(value) {
      console.log(value);
      this.offset = (value - 1) * 10;
      if (this.showDeleteTable) {
        this.getDeleteList();
      } else {
        this.initData();
      }
    },

    handlePrevClick() {
      this.offset = this.offset - 10;
      console.log(this.offset);
      this.initData();
      if (this.showDeleteTable) {
        this.getDeleteList();
      } else {
        this.initData();
      }
    },

    handleNextClick() {
      this.offset = this.offset + 10;
      console.log(this.offset);
      if (this.showDeleteTable) {
        this.getDeleteList();
      } else {
        this.initData();
      }
    },

    resetData() {
      this.initData();
    },

    // 删除 
    del(row) {
      console.log(row);
      this.$confirm('此操作将封禁该机构的使用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: row.id,
          is_delete: 1,
          phone: row.phone,
        }
        organization.del(data).then(res => {
          console.log(res);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.initData()
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    // 获取被删除列表
    getDeleteList() {
      const data = {
        offset: this.offset,
        limit: this.limit,
      }
      this.showDeleteTable = true;
      organization.getDeleteList(data).then(res => {
        console.log(res);
        this.tableData = res.data.result.rows.map(item => {
          if (item.is_pass === 0) {
            item.statusColor = 'info';
            item.status = '待审核';
          } else if (item.is_pass === 1) {
            item.statusColor = 'success';
            item.status = '通过';
          } else {
            item.statusColor = 'danger';
            item.status = '不通过';
          }
          item.createdAt = dayjs(item.createdAt).format('YYYY年MM月DD日 HH:MM:ss');
          return item;
        })
        this.total = res.data.result.count;
      })
    }

  },

}
</script>

<style lang="less">
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
</style>