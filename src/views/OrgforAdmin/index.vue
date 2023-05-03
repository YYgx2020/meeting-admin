<template>
  <div id="Org-for-admin">
    <div class="top-panel" >
      <!-- <div class="top-item">
        <el-input placeholder="输入关键词查询" v-model="keyWord1"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchDepartmentByKeyWord()">查找科室</el-button>
      </div>
      <div class="top-item">
        <el-dropdown trigger="click" style="cursor: pointer;" @command="handleTypeSelect">
          <span class="el-dropdown-link">
            科室类型<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item.text" v-for="(item, index) in types" :key="index">{{ item.text
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="top-item">
        <el-button type="primary" plain @click="resetData()">重置</el-button>
      </div> -->
      <div class="top-item" v-if="!table1">
        <el-button type="text" @click="back()">返回</el-button>
      </div>
    </div>

    <!-- 表格1 -->
    <el-table v-if="table1" :data="tableData" border style="width: 100%">
      <el-table-column prop="institute_name" label="机构名称">
      </el-table-column>
      <el-table-column prop="dept_name" label="科室名称">
      </el-table-column>
      <el-table-column prop="dept_root_name" label="科室主任">
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" @click="del(scope.row)" style="color: #f56c6c;">删除</el-button>
          <el-button type="text" @click="look(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表格2 -->
    <el-table v-if="!table1" :data="tableData" border style="width: 100%">
      <el-table-column prop="id_card" label="身份证"></el-table-column>
      <el-table-column prop="name" label="医生姓名"></el-table-column>
      <el-table-column prop="nation" label="民族"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="dept_name" label="科室"></el-table-column>
      <el-table-column prop="institution_name" label="机构"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="tel" label="电话"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row)">修改</el-button>
          <el-button type="text" @click="del(scope.row)" style="color: #f56c6c;">删除</el-button>
          <el-button type="text" @click="look(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { department } from '@/api';
export default {
  data() {
    return {
      tableData: null,
      keyWord1: null,
      data: {
        cur: 1,
        institute_id: 1,
        name: null,
      },
      tableData: null,
      table1: true,
    }
  },
  created() {
    this.getDataList();
  },

  methods: {
    getDataList() {
      department.dSearch(this.data).then(res => {
        console.log(res);
        this.tableData = res.data.data;
      })
    },

    searchDepartmentByKeyWord() {

    },

    edit(item) {
      
    },

    del(item) {

    },

    look(item) {
      console.log(item);
      const data = {
        curIndex: this.data.cur,
        institute_id: this.data.institute_id,
        dept_id: item.dept_id,
      }
      department.getInstituteUserInfo(data).then(res => {
        this.table1 = !this.table1;
        console.log(res);
        this.tableData = res.data.data;
      })
    },

    back() {
      this.table1 = !this.table1;
      this.getDataList();
    },
  }
}
</script>

<style></style>