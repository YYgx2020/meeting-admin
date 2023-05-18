<template>
  <div class="page">
    <div class="top-panel">
      <div class="top-item">
        <el-input placeholder="输入关键词查询" v-model="keyWord1"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="searchOrganizationByKeyWord()">查找会议室</el-button>
      </div>
      <div class="top-item" v-if="false">
        <el-dropdown trigger="click" style="cursor: pointer;" @command="handleTypeSelect">
          <span class="el-dropdown-link">
            机构类型<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="item.text" v-for="(item, index) in types" :key="index">{{ item.text }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="top-item">
        <el-button type="primary" plain @click="resetData()">重置</el-button>
      </div>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="code" label="会议室编号"></el-table-column>
      <el-table-column prop="code" label="会议室概况">
        <template slot-scope="scope">
          <el-image style="width: 40px; height: 40px" :src="scope.row.cover" :preview-src-list="[scope.row.cover]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="会议室名称"></el-table-column>
      <el-table-column prop="contact" label="管理员"></el-table-column>
      <el-table-column prop="phone" label="联系方式"></el-table-column>
      <!-- <el-table-column prop="email" label="邮箱"></el-table-column> -->
      <el-table-column prop="number" label="可容纳人数"></el-table-column>
      <el-table-column fixed="right" label="操作" width="240">
        <template slot-scope="scope">
          <el-button @click="lookDetail(scope.row)" type="text" size="small">查看简介</el-button>
          <el-button @click="lookDetail(scope.row)" type="text" size="small">查看预约</el-button>
          <el-button @click="lookDetail(scope.row)" type="text" size="small">修改信息</el-button>
          <el-button @click="del(scope.row)" style="color: #f56c6c;" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background layout="prev, pager, next" :total="total" @prev-click="handlePrevClick"
        @next-click="handleNextClick" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/* 
  平台管理员可以获取所有机构的会议室信息
*/
import { meetingList } from '@/utils/data/meeting';
import { meeting } from '@/api';
export default {
  name: 'meeting',
  data() {
    return {
      tableData: null,
      total: 0,
      queryData: {
        offset: 0,
        limit: 10,
        is_system_admin: this.$store.state.userInfo.is_system_admin,
        is_delete: 0,
      }
    }
  },
  created() {
    // console.log(this.$store.state);
    this.tableData = meetingList;
    this.initData();
  },

  methods: {
    initData() {
      meeting.getMeetingList(this.queryData).then(res => {
        console.log(res);
        this.tableData = res.data.result.rows;
        this.total = res.data.result.count;
      })
    },
    // 分页
    handleCurrentChange(value) {
      console.log(value);
      this.offset = (value - 1) * 10;
      this.initData();
    },

    handlePrevClick() {
      this.offset = this.offset - 10;
      console.log(this.offset);
      this.initData();
      this.initData();
    },

    handleNextClick() {
      this.offset = this.offset + 10;
      console.log(this.offset);
      this.initData();
    },

    resetData() {
      this.initData();
    },
  }
}
</script>

<style></style>