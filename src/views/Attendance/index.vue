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
          <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" style="color: #f56c6c;" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%">
      <el-form label-position="left" label-width="80px" :model="currentItem">
        <el-form-item label="上班时间">
          <el-time-picker v-model="start_work_time" :picker-options="{
              selectableRange: `00:00:00 - 23:59:59`
            }" placeholder="任意时间点" id="start_work_time" @blur="timePickerBlur">
            <!-- @blur="timePickerBlur" -->
          </el-time-picker>
        </el-form-item>
        <el-form-item label="下班时间">
          <el-time-picker v-model="end_work_time" :picker-options="{
              selectableRange: `00:00:00 - 23:59:59`
            }" placeholder="任意时间点"  id="end_work_time" @blur="timePickerBlur">
            <!-- @blur="timePickerBlur" -->
          </el-time-picker>
        </el-form-item>
        <el-form-item label="总工时">
          <!-- <span>{{ on_work_time }}</span> -->
          <el-input disabled v-model="currentItem.on_work_time"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="update()">更 新</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAllStaffAttendanceRecord, searchAttendanceInfoByKeyWord, delAttendance, updateStaffAttendanceInfo } from '@/api';
import { getExcel } from '../../utils/exportsExcel';

export default {
  name: 'attendance',
  data() {
    return {
      keyWord: null,
      staffAttendanceData: [],
      selectData: [],
      dialogVisible: false,
      currentObject: null,
      currentItem: {
        id: null,
        start_work_time: null,
        end_work_time: null,
        on_work_time: null,
        state: 1
      },
      start_work_time: null,  // 开始时间
      end_work_time: null,  // 结束时间
      start_limit: null,
      end_limit: null,
    }
  },
  created() {
    this.getTableData();
  },

  computed: {
    on_work_time() {
      // 计算总工时
      let on_work_time = this.currentItem.on_work_time;
      let end_work_time = this.currentItem.end_work_time;
      console.log(typeof end_work_time);
      let totalHour, totalMin;
      if (typeof end_work_time === 'string' && end_work_time !== null) {
        totalHour = end_work_time.split(":")[0] * 1 - start_work_time.split(":")[0] * 1;
        totalMin = end_work_time.split(":")[1] * 1 + (60 - start_work_time.split(":")[1] * 1);
        if (totalHour >= 1) {
          if (totalMin >= 60) {
            totalMin -= 60;
          } else {
            totalHour -= 1;
          }
        } else {
          totalMin = end_work_time.split(":")[1] * 1 - start_work_time.split(":")[1] * 1;
        }
        on_work_time = totalHour + "小时" + totalMin + "分钟";
      }
      return on_work_time;
    }
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

    // 编辑表格
    edit(item) {
      console.log(item);
      this.dialogVisible = true;
      this.currentObject = item;
      // 更改日期参数
      this.currentItem.id = item.id;
      this.currentItem.state = item.state;
      this.start_work_time = new Date(item.date.split('-')[0], item.date.split('-')[1], item.date.split('-')[2], item.start_work_time.split(':')[0], item.start_work_time.split(':')[1]);
      this.currentItem.start_work_time = this.timer(new Date(this.start_work_time).getHours()) + ':' + this.timer(new Date(this.start_work_time).getMinutes());
      if (item.end_work_time) {
        this.end_work_time = new Date(item.date.split('-')[0], item.date.split('-')[1], item.date.split('-')[2], item.end_work_time.split(':')[0], item.end_work_time.split(':')[1]);
        this.currentItem.end_work_time = this.timer(new Date(this.end_work_time).getHours()) + ':' + this.timer(new Date(this.end_work_time).getMinutes());
        // this.currentItem.end_work_time = this.end_work_time;
      } else {
        this.end_work_time = null;
      }
      this.currentItem.on_work_time = item.on_work_time;
      console.log(this.currentItem);
    },

    // 更新
    update() {
      console.log(this.currentItem);
      if (this.currentItem.on_work_time) {
        // state = 1
        this.currentItem.state = 2;
      }
      updateStaffAttendanceInfo(this.currentItem).then(res => {
        this.dialogVisible = false;
        console.log(res);
        this.getTableData();
      })
    },

    // 时间处理函数
    timer(time) {
      if (time < 10) {
        return '0' + time;
      } else {
        return time;
      }
    },

    // 时间发生改变时触发
    timePickerBlur(e) {
      console.log(e);
      const id = e.$options.propsData.id;
      console.log(e.$options.propsData.value);
      // let end_work_time = null;
      if (id === 'end_work_time') {
        // 更新下班时间
        this.currentItem.end_work_time = this.timer(new Date(e.$options.propsData.value).getHours()) + ':' + this.timer(new Date(e.$options.propsData.value).getMinutes());
        this.end_limit = this.currentItem.start_work_time + ':00';
      }

      // let start_work_time = null;
      if (id === 'start_work_time') {
        // 更新下班时间
        this.currentItem.start_work_time = this.timer(new Date(e.$options.propsData.value).getHours()) + ':' + this.timer(new Date(e.$options.propsData.value).getMinutes());
        if (this.currentItem.end_work_time) {
          this.start_limit = this.currentItem.end_work_time + ':00';
        } else {
          this.start_limit = '23:59:59';
        }
      }
      // 如果两个时间都不为 null，则计算总工时
      console.log(this.currentItem);
      let end_work_time = this.currentItem.end_work_time;
      let start_work_time = this.currentItem.start_work_time;
      let on_work_time = null;
      if (this.currentItem.start_work_time !== null && this.currentItem.end_work_time !== null) {
        on_work_time = this.currentItem.on_work_time;
        end_work_time = this.currentItem.end_work_time;
        // console.log(typeof end_work_time);
        let totalHour, totalMin;
        if (typeof end_work_time === 'string' && end_work_time !== null) {
          totalHour = end_work_time.split(":")[0] * 1 - start_work_time.split(":")[0] * 1;
          totalMin = end_work_time.split(":")[1] * 1 + (60 - start_work_time.split(":")[1] * 1);
          if (totalHour >= 1) {
            if (totalMin >= 60) {
              totalMin -= 60;
            } else {
              totalHour -= 1;
            }
          } else {
            totalMin = end_work_time.split(":")[1] * 1 - start_work_time.split(":")[1] * 1;
          }
          on_work_time = totalHour + "小时" + totalMin + "分钟";
          console.log(on_work_time);
          this.currentItem.on_work_time = on_work_time;
        }
      }
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