<template>
  <div id="organization">
    <!-- 机构查看页面 -->
    <div class="top-panel">
      <div class="top-item">
        <el-input placeholder="输入关键词查询" v-model="keyWord1"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchOrganizationByKeyWord()">查找机构</el-button>
      </div>
      <div class="top-item">
        <el-dropdown trigger="click" style="cursor: pointer;" @command="handleTypeSelect">
          <span class="el-dropdown-link">
            机构类型<i class="el-icon-arrow-down el-icon--right"></i>
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
      <el-table-column prop="name" label="机构名"></el-table-column>
      <el-table-column prop="type" label="机构类型" width="100" :filters="types" :filter-method="filterType"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type === 1 ? 'warning': ''" disable-transitions>{{ scope.row.type == 1 ? '学校': '企业' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="admin" label="申请人" width="80"></el-table-column>
      <el-table-column prop="phone" label="电话" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="type" label="审核状态" width="100" :filters="types" :filter-method="filterIsPass"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.statusColor" disable-transitions>{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="lookDetail(scope.row)" type="text" size="small">查看简介</el-button>
          <el-button @click="pass(scope.row)" type="text" size="small">通过</el-button>
          <el-button @click="noPass(scope.row)" style="color: #f56c6c;" type="text" size="small">不通过</el-button>
          <el-button @click="del(scope.row)" style="color: #f56c6c;" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { organization } from '@/api';

import orgList from '@/utils/data/organization.js';

export default {
  name: "Organization",
  components: {},
  data() {
    return {
      keyWord1: null,
      keyWord2: null,
      tableData: null,
      types: [
        {
          text: '学校',
          value: 1,
        },
        {
          text: '企业',
          value: 2,
        }
      ],
      searchType: false,
    }
  },
  created() {
    // console.log(organization.getDataList(data));
    // this.getDataList();
    this.initData();
  },

  methods: {

    initData() {
      console.log(orgList);
      this.tableData = orgList.map(item => {
        if (item.isPass === 0) {
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

    filterType(value, row) {
      console.log(value, row);
      return row.institute_type === value;
    },

    filterIsPass(value, row) {
      console.log(value, row);
      return row.institute_type === value;
    },

    resetData() {
      this.data = {
        cur: 1,
        institute_name: null,
        institute_type: null,
        address: null,
      }
      this.getDataList();
    },

    getDataList() {
      organization.getDataList(this.data).then(res => {
        this.tableData = res.data.data.records;
      })
    },

    searchOrganizationByKeyWord() {
      this.data.institute_name = this.keyWord1;
      this.getDataList();
    },

    searchAddressByKeyWord() {
      this.data.address = this.keyWord2;
      this.getDataList();
    },

    // 类型选择
    handleTypeSelect(command) {
      console.log(command);
      this.data.institute_type = command;
      this.getDataList()
    },

    handleCheckDepartment(item) {
      // console.log(item);
      this.$router.push({
        name: 'department',
        params: {
          id: item.id
        }
      })
    },
  },

}
</script>

<style></style>