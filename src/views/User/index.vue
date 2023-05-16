<template>
  <div id="user">
    <div class="top-panel">
      <div class="top-item">
        <el-input placeholder="输入关键词查询" v-model="keyWord1"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchOrganizationByKeyWord()">查找用户</el-button>
      </div>
      <div class="top-item">
        <el-dropdown trigger="click" style="cursor: pointer;" @command="handleTypeSelect">
          <span class="el-dropdown-link">
            用户类型<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item.text" v-for="(item, index) in types" :key="index">{{ item.text }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="top-item">
        <el-button type="primary" plain @click="resetData()">重置</el-button>
      </div>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="用户名"></el-table-column>
      <el-table-column prop="number" label="学号"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="role" label="用户类型" width="100" :filters="types" :filter-method="filterType"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.role === 1 ? 'warning': ''" disable-transitions>{{ scope.row.role == 1 ? '学生': '老师' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="register_status" label="审核状态" width="100" :filters="types" :filter-method="filterIsPass"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.statusColor" disable-transitions>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="pass(scope.row)" type="text" size="small">通过</el-button>
          <el-button @click="noPass(scope.row)" style="color: #f56c6c;" type="text" size="small">不通过</el-button>
          <el-button @click="del(scope.row)" style="color: #f56c6c;" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import userList from '@/utils/data/user';

export default {
  name: 'user',
  data() {
    return {
      tableData: null,
    }
  },
  created() {
    this.initData();
  },

  methods: {
    initData() {
      this.tableData = userList.map(item => {
        if (item.register_status === 0) {
          item.statusColor = 'info';
          item.status = '待审核';
        } else if (item.isPass === 1) {
          item.statusColor = 'success';
          item.status = '审核通过';
        } else {
          item.statusColor = 'danger';
          item.status = '审核不通过';
        }
        return item;
      })
    },
  }
}
</script>

<style></style>