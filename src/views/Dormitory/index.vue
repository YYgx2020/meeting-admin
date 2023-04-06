<template>
  <div class="dormitory-page">
    <div class="top-panel">
      <el-input placeholder="仅支持工号查询" v-model="code"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchStaffByCode()">查找</el-button>
      <el-button type="primary" plain @click="resetData()">重置</el-button>
    </div>
    <el-table :data="staffDormitoryData" border style="width: 100%">
      <el-table-column fixed prop="code" label="工号" width="100">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="pre_dormitory" label="原宿舍" width="100">
      </el-table-column>
      <el-table-column prop="new_dormitory" label="新宿舍" width="120">
      </el-table-column>
      <el-table-column prop="reason" label="申请原因" width="200">
      </el-table-column>
      <el-table-column prop="createdAt" label="申请日期" width="200">
      </el-table-column>
      <el-table-column prop="status" label="申请状态" width="100"
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
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllStaffDormitoryRecord, getStaffDormitoryInfoByCode, updateStaffDormitoryInfoByCode } from '@/api';
import dayjs from 'dayjs';
export default {
  name: 'dormitory',
  data() {
    return {
      code: null,
      staffDormitoryData: [],
    }
  },
  created() {
    this.getTableData();
  },

  methods: {
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
    searchStaffByCode() {
      if (this.code === '' || this.code === null) {
        return;
      } else {
        getStaffDormitoryInfoByCode({ code: this.code }).then(res => {
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
      this.code = null;
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