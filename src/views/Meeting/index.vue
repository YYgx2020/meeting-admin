<template>
  <div id="meeting">
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
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="code" label="会议室编号"></el-table-column>
      <el-table-column prop="name" label="会议室名称"></el-table-column>
      <el-table-column prop="admin" label="管理员" width="80"></el-table-column>
      <el-table-column prop="phone" label="联系方式" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
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

    
  </div>
</template>

<script>
import { meetingList } from '@/utils/data/meeting';
export default {
  name: 'meeting',
  data() {
    return {
      tableData: null,
    }
  },
  created() {
    this.tableData = meetingList;
  },
}
</script>

<style></style>