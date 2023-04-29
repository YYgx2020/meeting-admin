<template>
  <div class="attendance-page">
    <div class="top-panel">
      <el-input placeholder="输入关键词查询" v-model="keyWord"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchAttendanceInfoByKeyWord()">查找</el-button>
      <el-button type="primary" plain @click="resetData()">重置</el-button>
      <el-button type="danger" plain @click="del(selectData)">批量删除</el-button>
      <el-button plain @click="exportToExcel()">导出</el-button>
    </div>
    <el-table id="selectTable" :data="staffAttendanceData" border style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
      </el-table-column>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #f56c6c;" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllStaffAttendanceRecord, searchAttendanceInfoByKeyWord, delAttendance } from '@/api';
import { getExcel } from '../../utils/exportsExcel';

export default {
  name: 'attendance',
  data() {
    return {
      keyWord: null,
      staffAttendanceData: [],
      selectData: [],
    }
  },
  created() {
    this.getTableData();
  },

  methods: {

    // 监听选中行事件
    handleSelectionChange(e) {
      console.log(e);
      this.selectData = e;
    },

    // 删除事件
    del(item) {
      if (item instanceof Array) {
        if (item.length == 0) return;
      }
      this.$confirm('此操作将永久删除该员工当天的考勤信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delAttendance(item).then(res => {
          console.log(res);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getTableData();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

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