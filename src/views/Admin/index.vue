<template>
  <div class="admin-page">
    <!-- 使用 element-ui 的表格 -->
    <!-- 
      主要功能：
      - 筛选功能，根据注册情况去筛选
      - 查找功能
      - 分页展示
      - 给超级管理员查看其他管理员的信息并审核，主要操作有，查看详情、删除
    -->
    <div class="top-panel">
      <el-input placeholder="支持工号查看" v-model="code"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchAdminByCode()">查找</el-button>
      <el-button type="primary" plain @click="resetData()">重置</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="code" label="工号" width="100">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="100">
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="100">
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="120">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200">
      </el-table-column>
      <el-table-column prop="department" label="部门" width="120">
      </el-table-column>
      <el-table-column prop="service_status" label="在职情况" width="100"
        :filters="[{ text: '离职', value: 0 }, { text: '在职', value: 1 }]" :filter-method="filterServiceStatus"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.service_status === 0 ? 'danger' : 'success'" disable-transitions>{{
            scope.row.service_status === 0 ? '离职' : '在职' }}</el-tag>
        </template>>
      </el-table-column>
      <el-table-column prop="apply_status" label="认证情况" width="100"
        :filters="[{ text: '未认证', value: 0 }, { text: '已认证', value: 1 }]" :filter-method="filterApplyStatus"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.apply_status === 0 ? 'danger' : 'success'" disable-transitions>{{
            scope.row.apply_status === 0 ? '未认证' : '已认证' }}</el-tag>
        </template>>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
          <el-button type="text" size="small" v-if="!scope.row.apply_status" @click="pass(scope.row)">通过认证</el-button>
          <el-button type="text" size="small" style="color: #f56c6c;" @click="deleteAdmin(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAdminList, updateAdminInfoById, deleteAdminById, getAdminInfoByCode } from '@/api';
export default {
  name: 'admin',
  data() {
    return {
      code: '',  // 查找时输入的员工工号
      tableData: [],
    }
  },
  created() {
    console.log(this.tableData);
    // 发请求获取管理员列表
    this.initData();
  },
  methods: {

    // 根据管理员工号查找
    searchAdminByCode() {
      // console.log(this.code !== null);
      if (this.code !== '') {
        getAdminInfoByCode({ code: this.code }).then(res => {
          console.log(res.data.result === null);
          this.tableData = [];
          if (res.data.result !== null) {
            this.tableData.push(res.data.result);
          }
          console.log(this.tableData);
        })
      }
    },

    // 重置（重新获取数据）
    resetData() {
      this.code = null;
      this.initData();
    },
    initData() {
      getAdminList().then(res => {
        // console.log(res);
        this.tableData = res.data.result;
      }).catch(err => {
        console.log(err);
      })
    },
    // 筛选当前表格的在职情况
    filterServiceStatus(value, row) {
      return row.service_status = value;
    },
    // 筛选当前表格的认证情况
    filterApplyStatus(value, row) {
      // console.log(value, row);
      return row.apply_status === value;
    },

    // 通过认证按钮
    pass(row) {
      row = JSON.parse(JSON.stringify(row));
      // console.log(row);
      row.apply_status = 1;
      updateAdminInfoById(row).then(res => {
        // console.log(res);
        this.initData();
      })
    },
    // 删除管理员按钮
    deleteAdmin(row) {
      // console.log(row);
      row = JSON.parse(JSON.stringify(row));
      this.$confirm('此操作将删除当前管理员账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdminById(row).then(res => {
          this.initData();
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style lang="less" scoped>
.admin-page {
  display: flex;
  flex-direction: column;

  .top-panel {
    width: 100%;
    // height: 80px;
    line-height: 60px;

    .el-input {
      width: 180px;
      margin-right: 12px;
    }
  }
}
</style>