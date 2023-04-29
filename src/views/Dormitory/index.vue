<template>
  <div class="dormitory-page">
    <div class="top-panel">
      <el-input placeholder="输入关键词查询" v-model="keyWord"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="search()">查找</el-button>
      <el-button type="primary" plain @click="resetData()">重置</el-button>
      <el-button type="danger" plain @click="del(selectData)">批量删除</el-button>
      <el-button plain @click="exportToExcel()">导出</el-button>
    </div>
    <el-table id="selectTable" :data="staffDormitoryData" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55">
        </el-table-column>
      <el-table-column fixed prop="code" label="工号">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="pre_dormitory" label="原宿舍">
      </el-table-column>
      <el-table-column prop="new_dormitory" label="新宿舍">
      </el-table-column>
      <el-table-column prop="reason" label="申请原因">
      </el-table-column>
      <el-table-column prop="createdAt" label="申请日期">
      </el-table-column>
      <el-table-column prop="status" label="申请状态"
        :filters="[{ text: '审核中', value: 0 }, { text: '已通过', value: 1 }, { text: '不通过', value: -1 }, { text: '已取消', value: 2 }]"
        :filter-method="filterApplyStatus" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.statusClass" disable-transitions>{{
            scope.row.statusText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
          <el-button type="text" size="small" v-if="scope.row.status === 0" @click="pass(scope.row)">通过</el-button>
          <el-button type="text" size="small" v-if="scope.row.status === 0" style="color: #f56c6c;"
            @click="noPass(scope.row)">不通过</el-button>
          <el-button type="text" style="color: #f56c6c;" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllStaffDormitoryRecord, getStaffDormitoryInfoByKeyWord, updateStaffDormitoryInfoByCode, dormitoryDel } from '@/api';
import { getExcel } from '../../utils/exportsExcel';
import dayjs from 'dayjs';
export default {
  name: 'dormitory',
  data() {
    return {
      keyWord: null,
      staffDormitoryData: [],
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
      this.$confirm('此操作将永久删除该员工的宿舍调换信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dormitoryDel(item).then(res => {
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
      getAllStaffDormitoryRecord().then(res => {
        console.log(res);
        // let tableData = JSON.parse(JSON.stringify(res.data.result));
        this.initData(res.data.result);
        // console.log(this.staffJobData);
      }).catch(err => {
        console.log(err);
      })
    },
    initData(tableData) {
      this.staffDormitoryData = tableData.map(item => {
        console.log(item);
        item.createdAt = dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
        switch (item.status) {
          case 1: {
            item.statusClass = 'success';
            item.statusText = '已通过';
            break;
          }
          case 2: {
            item.statusClass = 'info';
            item.statusText = '已取消';
            break;
          }
          case -1: {
            item.statusClass = 'danger';
            item.statusText = '不通过';
            break;
          }
          case 0: {
            item.statusClass = 'warning';
            item.statusText = '审核中';
            break;
          }
        }
        return item;
      });
    },
    // 通过员工申请状态筛选员工调岗信息
    filterApplyStatus(value, row) {
      // console.log(value, row);
      return row.status === value;
    },
    // 通过员工工号查找员工调岗信息
    search() {
      if (this.keyWord === '' || this.keyWord === null) {
        return;
      } else {
        getStaffDormitoryInfoByKeyWord({ keyWord: this.keyWord }).then(res => {
          this.staffDormitoryData = [];
          if (res.data.result !== null) {
            this.initData(res.data.result);
            // this.staffJobData.push(res.data.result);
          }
        })
      }
    },

    // 重置数据
    resetData() {
      this.keyWord = null;
      this.getTableData();
    },

    // 通过审批
    pass(row) {
      row = JSON.parse(JSON.stringify(row));
      row.status = 1;
      updateStaffDormitoryInfoByCode(row).then(res => {
        this.getTableData();
      })
    },

    // 不通过
    noPass(row) {
      row = JSON.parse(JSON.stringify(row));
      row.status = -1;
      updateStaffDormitoryInfoByCode(row).then(res => {
        this.getTableData();
      })
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