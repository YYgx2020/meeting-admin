<template>
  <div class="employee-page">
    <div class="top-panel">
      <el-input placeholder="输入关键词查询" v-model="keyWord"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchStaffInfoByKeyWord()">查找</el-button>
      <el-button type="primary" plain @click="resetData()">重置</el-button>
      <el-button plain @click="exportToExcel()">导出</el-button>
    </div>
    <el-table id="selectTable" :data="tableData" border style="width: 100%">
      <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="员工照片: ">
            <img width="128px" height="128px" :src="props.row.avatar" alt="">
          </el-form-item>
          <el-form-item label="劳动合同: ">
            <img width="128px" height="128px" :src="props.row.labor_contract" alt="">
          </el-form-item>
          <el-form-item label="邮箱: ">
            <span>{{ props.row.email }}</span>
          </el-form-item>
          <el-form-item label="基本薪资: ">
            <span>{{ props.row.basic_salary }}</span>
          </el-form-item>
          <el-form-item label="紧急联系人: ">
            <span>{{ props.row.emergency_contact_person }}</span>
          </el-form-item>
          <el-form-item label="紧急联系人电话: ">
            <span>{{ props.row.emergency_contact_phone }}</span>
          </el-form-item>
          <el-form-item label="生日: ">
            <span>{{ props.row.birthday }}</span>
          </el-form-item>
          <el-form-item label="家庭地址: ">
            <span>{{ props.row.home_address }}</span>
          </el-form-item>
          <el-form-item label="毕业院校: ">
            <span>{{ props.row.school }}</span>
          </el-form-item>
          <el-form-item label="毕业院校地址: ">
            <span>{{ props.row.school_address }}</span>
          </el-form-item>
          <el-form-item label="专业: ">
            <span>{{ props.row.major }}</span>
          </el-form-item>
          <el-form-item label="学历: ">
            <span>{{ props.row.edu_bg }}</span>
          </el-form-item>
          <el-form-item label="技能: ">
            <span>{{ props.row.pro_skills }}</span>
          </el-form-item>
          <el-form-item label="校园经历: ">
            <span>{{ props.row.campus_experience }}</span>
          </el-form-item>
          <el-form-item label="项目经历: ">
            <span>{{ props.row.project_experience }}</span>
          </el-form-item>
          <el-form-item label="工作经历: ">
            <span>{{ props.row.work_experience }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
      <el-table-column prop="code" label="工号">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="service_status" label="在职情况"
        :filters="[{ text: '离职', value: 0 }, { text: '在职', value: 1 }]" :filter-method="filterServiceStatus"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.service_status == 0 ? 'danger' : 'success'" disable-transitions>{{
            scope.row.service_status == 0 ? '离职' : '在职' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="apply_status" label="认证情况"
        :filters="[{ text: '未认证', value: 0 }, { text: '已认证', value: 1 }]" :filter-method="filterApplyStatus"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.apply_status === 1 ? 'success' : (scope.row.apply_status === -1 ? 'info' : 'danger')" disable-transitions>{{
            scope.row.apply_status === 1 ? '已认证' : (scope.row.apply_status === -1 ? '已冻结' : '未认证') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.gender === 0 ? '女' : '男' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="id_number" label="身份证号">
      </el-table-column>
      <el-table-column prop="phone" label="电话">
      </el-table-column>
      <!-- <el-table-column prop="email" label="邮箱" width="200">
      </el-table-column> -->
      <el-table-column prop="job" label="职位">
      </el-table-column>
      <el-table-column prop="department" label="部门">
      </el-table-column>
      <el-table-column prop="dormitory" label="宿舍">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
          <!-- <el-button type="text" size="small" @click="lookMoreStaffInfo(scope.row.id)">查看更多</el-button> -->
          <el-button type="text" size="small" v-if="scope.row.apply_status === 0" @click="pass(scope.row)">通过认证</el-button>
          <el-button type="text" size="small" v-if="scope.row.apply_status === -1" @click="pass(scope.row)">解冻</el-button>
          <el-button type="text" size="small" v-if="scope.row.apply_status === 1 && scope.row.service_status != 0" @click="freeze(scope.row)">冻结账号</el-button>
          <el-button type="text" size="small" style="color: #f56c6c;" @click="deleteStaff(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getStaffList, updateStaffInfo, searchStaffInfoByKeyWord  } from '@/api';
import { getExcel } from '../../utils/exportsExcel';
export default {
  name: 'employee',
  data() {
    return {
      keyWord: '',  // 查找时输入的员工工号
      tableData: [],
    }
  },
  created() {
    this.initData();
  },
  methods: {

    // 导出为表格
    exportToExcel() {
      getExcel('#selectTable', '表格');
    },
    
    searchStaffInfoByKeyWord() {
      if (this.keyWord === '' || this.keyWord === null) {
        return;
      } else {
        searchStaffInfoByKeyWord({ keyWord: this.keyWord }).then(res => {
          this.tableData = [];
          if (res.data.result !== null) {
            // this.initData(res.data.result);
            this.tableData = res.data.result;
            // this.staffJobData.push(res.data.result);
          }
        })
      }
    },

    initData() {
      getStaffList().then(res => {
        this.tableData = res.data.result;
      }).catch(err => {
        console.log(err);
      });
    },
    // 重置数据
    resetData() {
      this.keyWord = null;
      this.initData();
    },
    
    // 筛选当前表格的在职情况
    filterServiceStatus(value, row) {
      return row.service_status = value;
    },
    // 筛选当前表格的认证情况
    filterApplyStatus(value, row) {
      // console.log(value, row);
      return row.apply_status === value;
    },
    // 查看更多员工信息
    lookMoreStaffInfo(id) {
      console.log(id);
    },
    // 通过按钮
    pass(row) {
      row = JSON.parse(JSON.stringify(row));
      // console.log(row);
      row.apply_status = 1;
      updateStaffInfo(row).then(res => {
        // console.log(res);
        this.initData();
      })
    },
    // 冻结账号
    freeze(row) {
      row = JSON.parse(JSON.stringify(row));
      // console.log(row);
      row.apply_status = -1;
      updateStaffInfo(row).then(res => {
        // console.log(res);
        this.initData();
      })
    },
    // 删除员工账号
    deleteStaff(row) {
      
    }
  }
}
</script>

<style lang="less" scoped>
.employee-page {
  display: flex;
  flex-direction: column;

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .top-panel {
    width: 100%;
    // height: 80px;
    line-height: 60px;

    .el-input {
      width: 180px;
      margin-right: 12px;
    }
  }
}
</style>