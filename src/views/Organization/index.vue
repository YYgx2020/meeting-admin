<template>
  <div id="organization">
    <!-- 机构查看页面 -->
    <div class="top-panel">
      <div class="top-item">
        <el-input placeholder="输入关键词查询" v-model="keyWord1"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchOrganizationByKeyWord()">查找机构</el-button>
      </div>
      <div class="top-item">
        <el-input placeholder="输入关键词查询" v-model="keyWord2"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchAddressByKeyWord()">查找地址</el-button>
      </div>
      <div class="top-item">
        <el-dropdown trigger="click" style="cursor: pointer;" @command="handleTypeSelect">
          <span class="el-dropdown-link">
            机构类型<i class="el-icon-arrow-down el-icon--right"></i>
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
      <el-table-column prop="institute_name" label="机构名">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column prop="institute_type" label="机构类型" width="100" :filters="types" :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag type="success" disable-transitions>{{ scope.row.institute_type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleCheckDepartment(scope.row)" type="text" size="small">查看科室</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { organization } from '@/api';

export default {
  name: "Organization",
  components: {},
  data() {
    return {
      keyWord1: null,
      keyWord2: null,
      tableData: null,
      types: null,
      searchType: false,
      data: {
        cur: 1,
        institute_name: null,
        institute_type: null,
        address: null,
      }
    }
  },
  created() {
    // console.log(organization.getDataList(data));
    this.getDataList();

    organization.getOrganizationType().then(res => {
      // console.log('机构类型：', res);
      this.types = res.data.data;
      this.types = this.types.map((item, index) => {
        // console.log(item, index);
        return {
          text: item,
          value: item
        }
      })
    })
  },

  methods: {

    filterTag(value, row) {
      console.log(value, row);
      return row.institute_type === value;
      // if (value === '民办') {

      //   console.log(value);
      //   return;
      // }
      // console.log(this.searchType);
      // if (!this.searchType) {
      //   const res = await organization.getDataList({
      //     cur: this.cur,
      //     institute_type: value,
      //   })
      //   console.log(res);
      //   this.searchType = true;
      //   console.log(this.searchType);
      // }

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