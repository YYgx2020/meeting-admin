<template>
  <div class="performance-page">
    <div class="header-panel">
      <el-input placeholder="仅支持工号查找" v-model="code"></el-input>
      <!-- 按月查找 -->
      <el-date-picker v-model="date" type="month" placeholder="选择月">
      </el-date-picker>
      <el-button type="primary" icon="el-icon-search" @click="search()">查找</el-button>
      <el-button type="primary" plain @click="resetData()">重置</el-button>
    </div>
    <div class="table-data">
      <el-table border :data="rows">
        <el-table-column fixed prop="code" label="工号">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="department" label="部门">
        </el-table-column>
        <el-table-column prop="job" label="岗位">
        </el-table-column>
        <el-table-column prop="performance" label="绩效">
        </el-table-column>
        <el-table-column prop="reward" label="奖惩">
        </el-table-column>
        <el-table-column prop="basic_salary" label="基本工资">
        </el-table-column>
        <el-table-column prop="real_salary" label="实发工资">
        </el-table-column>
        <el-table-column label="月份">
          <template slot-scope="scope">
            <span>{{ scope.row.year }}-{{ scope.row.month }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改信息" :visible.sync="dialogVisible" width="60%">
        <el-form label-position="left" label-width="80px" :model="formLabelAlign">
          <el-form-item label="月份">
            <span>{{ item ? (item.year + '-' + item.month) : '' }}</span>
          </el-form-item>
          <el-form-item label="工号">
            <span>{{ item ? item.code : '' }}</span>
          </el-form-item>
          <el-form-item label="姓名">
            <span>{{ item ? item.name : '' }}</span>
          </el-form-item>
          <el-form-item label="部门">
            <span>{{ item ? item.department : '' }}</span>
          </el-form-item>
          <el-form-item label="岗位">
            <span>{{ item ? item.job : '' }}</span>
          </el-form-item>
          <el-form-item label="基本工资">
            <span>{{ item ? item.basic_salary : '' }}</span>
          </el-form-item>
          <el-form-item label="绩效">
            <el-radio v-model="formLabelAlign.performance" label="A">A</el-radio>
            <el-radio v-model="formLabelAlign.performance" label="B">B</el-radio>
            <el-radio v-model="formLabelAlign.performance" label="C">C</el-radio>
          </el-form-item>
          <el-form-item label="奖惩">
            <el-input type="textarea" placeholder="输入员工的奖励或者惩罚" v-model="formLabelAlign.reward"></el-input>
          </el-form-item>
          <el-form-item label="奖惩工资">
            <el-input type="number" placeholder="输入员工奖惩对应的工资，只能输入数字" v-model="formLabelAlign.reward_salary"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="sumbitChange()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getStaffPerformance, updateStaffPerformance, searchPerformance } from '@/api';

export default {
  name: 'performance',
  data() {
    return {
      rows: [],
      count: 0,
      code: null,
      date: null,
      dialogVisible: false,
      formLabelAlign: {
        performance: null,
        reward: null,
        reward_salary: null,
      },
      item: null,  // 标记当前选中的行
    }
  },
  created() {
    // 获取数据
    this.getStaffPerformance();
  },
  // watch: {
  //   'formLabelAlign.reward_salary'(item1, item2) {
  //     console.log(item1, item2);
  //     return item2 * 1;
  //   },
  //   deep:true
  // },
  methods: {

    // 查找员工数据
    search() {
      // if (this.code == null ||) {
      //   this.$message('请输入查找信息');
      //   return;
      // }
      console.log('日期：', new Date(this.date));
      let year = null, month = null;     
      if (this.date != null) {
        year = new Date(this.date + '').getFullYear();
        month = new Date(this.date + '').getMonth() + 1;
      }
      const data = {
        code: this.code,
        year,
        month,
      }
      searchPerformance(data).then(res => {
        console.log(res);
        this.count = res.data.result.count;
        this.rows = res.data.result.rows;
      })
    },
    // 重置数据
    resetData() {
      this.code = null;
      this.date = null;
      this.getStaffPerformance();
    },
    // 获取所有数据
    getStaffPerformance() {
      const data = {};
      getStaffPerformance(data).then(res => {
        // console.log(res);
        this.count = res.data.result.count;
        this.rows = res.data.result.rows;
      })
    },

    edit(item) {
      console.log(item);
      this.dialogVisible = true;
      this.item = JSON.parse(JSON.stringify(item));
    },

    // 提交修改
    sumbitChange() {
      const item = this.item;
      // const formLabelAlign = this.formLabelAlign;
      item.performance = this.formLabelAlign.performance;
      item.reward = this.formLabelAlign.reward;
      item.reward_salary = this.formLabelAlign.reward_salary * 1;
      switch (item.performance) {
        case 'A': {
          item.real_salary = item.basic_salary * 1 + 2500 + item.reward_salary;
          break;
        }
        case 'B': {
          item.real_salary = item.basic_salary * 1 + 1500 + item.reward_salary;
          break;
        }
        case 'C': {
          item.real_salary = item.basic_salary * 1 + item.reward_salary;
          break;
        }
      }
      console.log('员工绩效信息：', item);
      updateStaffPerformance(item).then(res => {
        // console.log(res);
        this.dialogVisible = false;
        this.getStaffPerformance()
      })
    },
  }
}
</script>

<style lang="less">
.header-panel {
  width: 100%;
  // height: 80px;
  line-height: 60px;

  .el-input {
    width: 180px;
    margin-right: 12px;
  }
}

input[type=number] {
  -moz-appearance: textfield;
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>