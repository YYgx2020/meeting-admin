<template>
  <div id="department">
    <div class="top-panel">
      <div class="top-item">
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
      </div>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="doc_name" label="姓名">
      </el-table-column>
      <el-table-column prop="sex" label="性别">
      </el-table-column>
      <el-table-column prop="dept_name" label="科室">
      </el-table-column>
      <el-table-column prop="institute_name" label="医院">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleTreatmentApply(scope.row)" type="text" size="small">就诊申请</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { department } from '@/api';
export default {
  name: 'department',
  props: ['id'],
  data() {
    return {
      keyWord1: null,
      tableData: null,
      types: null,
    }
  },
  created() {
    console.log(this.id);
    this.getDataList();
  },
  methods: {

    getDataList() {
      department.getDepartmentInfo({
        institute_id: this.id,
        cur: 1,
      }).then(res => {
        console.log(res);
        this.tableData = res.data.data;
      })
    },

    resetData() {

    },

    searchDepartmentByKeyWord() {

    },

    handleTypeSelect(command) {

    },

    handleTreatmentApply() {

    },
  }
}
</script>

<style></style>