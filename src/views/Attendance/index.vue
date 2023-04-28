<template>
  <div class="attendance-page">
    <div class="top-panel">
      <el-input placeholder="输入关键词查询" v-model="keyWord"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchAttendanceInfoByKeyWord()">查找</el-button>
      <el-button type="primary" plain @click="resetData()">重置</el-button>
      <el-button plain @click="exportToExcel()">导出</el-button>
    </div>
    <el-table id="selectTable" :data="staffAttendanceData" border style="width: 100%">
      <el-table-column prop="code" label="工号">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="department" label="部门">
      </el-table-column>
      <el-table-column prop="job" label="岗位">
      </el-table-column>
      <el-table-column prop="date" label="日期">
      </el-table-column>
      <el-table-column prop="start_work_time" label="上班时间">
      </el-table-column>
      <el-table-column prop="end_work_time" label="下班时间">
      </el-table-column>
      <el-table-column prop="on_work_time" label="总工时">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllStaffAttendanceRecord, searchAttendanceInfoByKeyWord } from '@/api';
import { getExcel } from '../../utils/exportsExcel';

export default {
  name: 'attendance',
  data() {
    return {
      keyWord: null,
      staffAttendanceData: [],
    }
  },
  created() {
    this.getTableData();
  },

  methods: {
    getTableData() {
      getAllStaffAttendanceRecord().then(res => {
        console.log(res);
        this.staffAttendanceData = res.data.result;
      });
    },

    // 通过员工工号查找员工调岗信息
    searchAttendanceInfoByKeyWord() {
      if (this.keyWord === '' || this.keyWord === null) {
        return;
      } else {
        searchAttendanceInfoByKeyWord({ keyWord: this.keyWord }).then(res => {
          this.staffAttendanceData = [];
          if (res.data.result !== null) {
            this.staffAttendanceData = res.data.result;
          }
        })
      }
    },

    // 重置数据
    resetData() {
      this.keyWord = null;
      this.getTableData();
    },

    // 导出为表格
    exportToExcel() {
      getExcel('#selectTable', '表格');
    },
  }
}
</script>

<style lang="less">
.top-panel {
  width: 100%;
  // height: 80px;
  line-height: 60px;

  .el-input {
    width: 180px;
    margin-right: 12px;
  }
}
</style>