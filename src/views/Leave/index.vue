<template>
  <div class="leave-page">
    <div class="top-panel">
      <el-input placeholder="输入关键词查询" v-model="code"></el-input>
      <el-button type="primary" icon="el-icon-search" @click="searchStaffByCode()">查找</el-button>
      <el-button type="primary" plain @click="resetData()">重置</el-button>
      <el-button plain @click="exportToExcel()">导出</el-button>
    </div>
    <el-table id="selectTable" :data="staffLeaveData" border style="width: 100%">
      <el-table-column fixed prop="code" label="工号">
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="department" label="部门">
      </el-table-column>
      <el-table-column prop="job" label="岗位">
      </el-table-column>
      <el-table-column prop="short_text" label="申请原因">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" popper-class="reason-popper">
            <p>离职原因：</p>
            <p>{{ scope.row.reason }}</p>
            <div slot="reference" class="name-wrapper">
              <!-- <el-tag size="medium">{{ scope.row. }}</el-tag> -->
              <span>{{ scope.row.short_text }}</span>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="申请日期">
      </el-table-column>
      <el-table-column prop="status" label="申请状态"
        :filters="[{ text: '审核中', value: 0 }, { text: '待员工签字', value: 1 }, { text: '不通过', value: -2 }, { text: '已取消', value: -1 }, { text: '已通过', value: 3 }]"
        :filter-method="filterApplyStatus" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.statusClass" disable-transitions>{{
            scope.row.statusText }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
          <!-- <el-button type="text" size="small" v-if="scope.row.status === 0" @click="pass(scope.row)">通过</el-button> -->
          <!-- 预览离职协议书 -->
          <el-button v-if="scope.row.status === 0 || scope.row.status === 2 || scope.row.status === 3 || scope.row.status === 1" type="text"
            @click="preview(scope.row)">预览</el-button>
          <el-button type="text" size="small" v-if="scope.row.status === 0 || scope.row.status === 2"
            style="color: #f56c6c;" @click="noPass(scope.row)">不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 离职协议书预览表单 -->
    <el-dialog title="离职协议书预览" :visible.sync="dialogVisible" width="1020px">
      <!-- <span>这是一段信息</span> -->
      <div id="outer-box">
        <div id="preview-box">
          <div class="preview-title">
            <h1>离职协议书</h1>
          </div>
          <div class="preview-content">
            <p>甲方：XXX公司</p>
            <p>地址：XXX </p>
            <p>法定代表人（或负责人）：XXX</p>
            <p>联系电话：XXXXX</p>
            <p>乙方：{{ previewData.name }} </p>
            <p>身份证号码：{{ previewData.id_number }} </p>
            <p>联系电话：{{ previewData.phone }}</p>
            <p>根据《中华人民共和国劳动法》和双方协商，乙方自愿离开甲方公司，现甲、乙双方达成如下协议：</p>
            <p>一、离职日期：{{ previewData.createdAt }}</p>
            <p>二、离职原因：自愿离职</p>
            <!-- <p>{{ currentStaff.reason }}</p> -->
            <p>三、离职前乙方应当履行的职责和义务：</p>
            <p class="order">1.完成在职期间未完成的工作，并做好交接工作，保证公司的正常运营；</p>
            <p class="order">2.保护公司的机密和保密信息，不得泄露或用于个人利益；</p>
            <p class="order">3.在离职前归还公司的工作物品，包括但不限于公司钥匙、电脑、文件、资料等。</p>
            <p>四、离职后乙方应当履行的义务：</p>
            <p class="order">1.不得利用离职后掌握的公司机密和保密信息，从事与甲方公司业务相关的活动；</p>
            <p class="order">2.不得与甲方公司的客户、合作伙伴等进行商业活动；</p>
            <p class="order">3.离职后如有从事与甲方公司相同或类似业务的活动，应当保护甲方公司的商业利益，避免侵害甲方公司的合法权益。</p>
            <p>五、乙方与甲方之间的未尽事宜的处理方式：</p>
            <p class="order">1.在离职后一个月内，甲方应当向乙方支付离职工资及其它应当支付的费用；</p>
            <p class="order">2.乙方自离职之日起，不再享有甲方公司的任何福利待遇；</p>
            <p class="order">3.如双方在离职协议执行过程中发生争议，应当依法通过协商、调解、仲裁等方式解决。</p>
            <p id="last-p">本协议自双方签字之日起生效，甲、乙双方各执一份。</p>
            <div class="signature-show">
              <div class="party-A">
                <div class="party-text">
                  <p>甲方（签字/盖章）：</p>
                  <img v-if="currentStaff.signature_img_a" :src="currentStaff.signature_img_a" alt="">
                </div>
                <p>日期：{{ currentStaff.sign_date_a }}</p>
              </div>
              <div class="party-B">
                <div class="party-text">
                  <p>乙方（签字）：</p>
                  <img id="img-B" v-if="currentStaff.signature_img" :src="currentStaff.signature_img" alt="">
                </div>
                <p>日期：{{ currentStaff.sign_date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="signature-panel" v-if="currentStaff.status === 0">
        <div class="signature-btns">
          <el-button type="primary" plain @click="handleReset()">清空签名</el-button>
          <el-button type="primary" @click="handleGenerate()">完成签名</el-button>
        </div>
        <div class="signature-area">
          <vue-esign ref="esign" :width="980" :height="280" :isCrop="isCrop" :lineWidth="lineWidth" :lineColor="lineColor"
            :bgColor.sync="bgColor" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button v-if="currentStaff.signature_img_a && currentStaff.status === 0" type="primary"
          @click="sendToStaff()">发给员工</el-button>
        <el-button v-if="currentStaff.status === 2" type="primary" @click="pass()">通过</el-button>
        <el-button v-if="currentStaff.status === 2 || currentStaff.status === 3" type="primary" @click="exportPDF('pdf')">另存为 pdf</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStaffInfo, getAllStaffLeaveRecord, getStaffLeaveInfoByCode, updateStaffLeaveInfoByCode, passStaffLeave } from '@/api';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { getExcel } from '../../utils/exportsExcel';

pdfMake.vfs = pdfFonts.pdfMake.vfs
export default {
  name: 'leave',
  data() {
    return {
      code: null,
      staffLeaveData: [],
      dialogVisible: false, // 表单提交表单显示框的变量定义, 展示页面时显示提交表单
      currentStaff: {},
      lineColor: 'black',
      lineWidth: 6,
      isCrop: false,
      bgColor: '',
      signatureImg: '',
      previewData: {},
      staffSignatureImg: null,  // 乙方签字图片
      staff_signature_date: null,  // 乙方签字日期
    }
  },
  created() {
    this.getTableData();
  },

  // computed: {
  //   // 返回日期
  //   currentDate() {
  //     return new Date().getFullYear() + ' 年 ' + (new Date().getMonth() + 1) + ' 月 ' + new Date().getDate() + ' 日 ';
  //   }
  // },

  methods: {
    getTableData() {
      this.dialogVisible = false;
      getAllStaffLeaveRecord().then(res => {
        this.initData(res.data.result);
      })
    },

    initData(tableData) {
      this.staffLeaveData = tableData.map(item => {
        console.log(item.reason.length);
        if (item.reason.length <= 20) {
          item.short_text = item.reason;
        } else {
          item.short_text = item.reason.substring(0, 20) + '...';
        }
        item.createdAt = dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss");
        switch (item.status) {
          case 1: {
            item.statusClass = 'warning';
            item.statusText = '待员工签字';
            break;
          }
          case 2: {
            item.statusClass = 'warning';
            item.statusText = '待确认';
            break;
          }
          case -1: {
            item.statusClass = 'info';
            item.statusText = '已取消';
            break;
          }
          case 3: {
            item.statusClass = "success";
            item.statusText = '已通过';
            break;
          }
          case 0: {
            item.statusClass = 'warning';
            item.statusText = '审核中';
            break;
          }
          case -2: {
            item.statusClass = 'danger';
            item.statusText = '不通过';
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
        getStaffLeaveInfoByCode({ keyWord: this.code }).then(res => {
          this.staffLeaveData = [];
          if (res.data.result !== null) {
            this.initData(res.data.result);
            // this.staffJobData.push(res.data.result);
          }
        })
      }
    },

    lookMore(row) {
      console.log(row);
    },

    // 重置数据
    resetData() {
      this.code = null;
      this.getTableData();
    },

    // 通过审批
    async pass() {
      try {
        // console.log(row);
        // row = JSON.parse(JSON.stringify(row));
        // row.status = 3;
        // this.exportPDF('server').then(res => {
        //   console.log(res);
        // }).catch(err => {
        //   console.log(err);
        // })
        // console.log(await this.exportPDF('server'));
        // console.log(this.exportPDF('server'));
        const pdf_base64_string = await this.exportPDF('server');
        // console.log('aaaa', pdf_base64_string);
        // const base64String = 'Your base64 string here';
        // generatePDF(pdf_base64_string);
        // const binaryData = Buffer.from(pdf_base64_string, 'base64');

        const data = {
          code: this.currentStaff.code,
          status: 3,
          pdf_base64_string,
        }
        const loading = this.$loading({
          lock: true,
          text: '数据请求中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        passStaffLeave(data).then(res => {
          loading.close();
          this.getTableData();
        })
        /* 
          通过事件：
          传递参数：
            {
              code：员工工号
              status：审核状态 3
              pdf_base64_string：pdf 的 base64 字符串
            }
          后端逻辑：
            1. 以上参数，
            2. 根据工号获取员工的 email
            3. 将 base64 字符串生成文件，发送至员工邮箱
            4. 发送成功之后更新 Leave 表的 status 字段，以及员工的离职状态
            5. 返回成功信息给前端
        */
      } catch (error) {
        console.log(error);
      }
      // passStaffLeave(row).then(res => {
      //   this.getTableData();
      // })
    },

    // 不通过
    noPass(row) {
      row = JSON.parse(JSON.stringify(row));
      row.status = -2;
      updateStaffLeaveInfoByCode(row).then(res => {
        this.getTableData();
      })
    },

    // 预览离职协议书
    preview(item) {
      // 获取员工信息
      console.log(item);
      this.currentStaff = item;
      getStaffInfo({ code: item.code }).then(res => {
        console.log(res);
        this.previewData = {
          name: res.data.result.name,
          id_number: res.data.result.id_number,
          phone: res.data.result.phone,
          createdAt: dayjs(item.createdAt).format("YYYY年MM月DD日"),
        }
        console.log(this.previewData);
        // this.currentStaff = item;
        // 展示离职协议书预览页面，并发送请求去获取员工的手机号码和身份证号信息
        this.dialogVisible = true;
      })
    },

    // 导出为 pdf
    async exportPDF(str) {
      const element = document.getElementById('preview-box');
      console.log(1);
      const canvas = await html2canvas(element, {
        allowTaint: true,
        taintTest: false,
        useCORS: true,
        // y: 72, // 对Y轴进行裁切
        // width:1200,
        // height:5000,
        dpi: window.devicePixelRatio * 4, //将分辨率提高到特定的DPI 提高四倍
        scale: 4 //按比例增加分辨率 
      });
      console.log(2);
      let contentWidth = canvas.width
      let contentHeight = canvas.height
      let pageHeight = contentWidth / 592.28 * 841.89
      let leftHeight = contentHeight
      let position = 0
      let imgWidth = 595.28
      let imgHeight = 592.28 / contentWidth * contentHeight
      let pageData = canvas.toDataURL('image/jpeg', 1.0)
      let PDF = new jsPDF('', 'pt', 'a4')
      if (leftHeight < pageHeight) {
        PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
      } else {
        while (leftHeight > 0) {
          PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
          leftHeight -= pageHeight
          position -= 841.89
          if (leftHeight > 0) {
            PDF.addPage()
          }
        }
      }
      console.log(PDF);
      // 在这里决定导出还是发邮件
      if (str === 'pdf') {
        PDF.save(`工号${this.currentStaff.code}${this.currentStaff.name}-离职协议书.pdf`)
      } else {
        // 返回 base64 字符串
        console.log(3);

        return PDF.output('dataurlstring').split('base64,')[1];
        /* 
          踩坑记录：
          参考文档：http://t.csdn.cn/QQ0qj
          这里输出的字符串是一个 DATA URL，一般包含数据类型和数据本身，比如以下字符串中
          data:application/pdf;filename=generated.pdf;base64,JVBERi0xLjMKJbrfrOAKMyAwIG9iago8PC9UeXBlI
          base64,前面的字符串是数据的类型，后面的字符串才是真实的数据
          因此要将此数据传给后端生成pdf时，要将前面标识数据类型的字符串去掉
        */
      }
    },

    // 清空签名
    handleReset() {
      this.$refs.esign.reset()
    },
    // 完成签名
    handleGenerate() {
      this.$refs.esign.generate().then(res => {
        // console.log(res);
        this.currentStaff.signature_img_a = res;
        this.currentStaff.sign_date_a = new Date().getFullYear() + ' 年 ' + (new Date().getMonth() + 1) + ' 月 ' + new Date().getDate() + ' 日 ';
      }).catch(err => {
        alert(err) // 画布没有签字时会执行这里 'Not Signned'
      })
    },

    // 将签好字的离职协议书发给员工签字
    sendToStaff() {
      /* 
        创建一个新的字段，将员工的离职协议书预览表单发给员工
      */
      // if (!this.currentStaff.signature_img_a) {
      //   this.$confirm('请先签字！', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   })
      //   return;
      // }
      const previewNode = document.getElementById('outer-box').innerHTML;
      // console.log(typeof previewNode);
      this.currentStaff.leave_html = previewNode;
      // this.currentStaff.signature_img_a = this.signatureImg;
      this.currentStaff.status = 1;
      // console.log(this.currentStaff);
      updateStaffLeaveInfoByCode(this.currentStaff).then(res => {
        console.log(res);
        this.getTableData();
      })
    },

    // 导出为表格
    exportToExcel() {
      getExcel('#selectTable', '表格');
    },
  },
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

.reason-popper {
  width: 200px;
  height: auto;
}

#outer-box {
  border: 1px solid #8c8c8c;
  border-radius: 4px;

  #preview-box {

    .preview-title {
      width: 100%;
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 24px;
      color: red;
    }

    .preview-content {
      width: 100%;
      padding: 0px 80px;
      box-sizing: border-box;

      p {
        line-height: 36px;
        font-size: 18px;
      }

      .order {
        padding-left: 16px;
      }

      #last-p {
        margin-bottom: 100px;
      }

      .signature-show {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 200px;

        .party-A {
          // .party-A-text {
          //   display: flex;
          //   flex-direction: row;
          //   align-items: center;

          //   img {
          //     width: 120px;
          //     height: 34px;
          //   }
          // }
        }

        .party-B {
          padding-right: 180px;
          height: 72px;
          position: relative;
          // .party-B-text {
          //   display: flex;
          //   flex-direction: row;
          //   align-items: center;

          //   img {
          //     width: 120px;
          //     height: 34px;
          //   }
          // }
        }

        .party-text {
          display: flex;
          flex-direction: row;
          align-items: center;

          img {
            width: 120px;
            height: 34px;
          }

          #img-B {
            -webkit-transform: rotate(-90deg);
            width: 54.4px;
            height: 96.5px;
            left: 148px;
            position: absolute;
            top: -36px;
          }
        }
      }
    }
  }
}

.signature-panel {
  margin-top: 40px;

  .signature-btns {
    margin-bottom: 10px;
  }

  .signature-area {
    width: 980px;
    border: 1px solid #8c8c8c;
    border-radius: 4px;
  }
}
</style>

<!-- 
  导出 pdf 参考文档：
  http://t.csdn.cn/H09jd
  
  电子签名参考：
  https://juejin.cn/post/7062540451831611399
  https://www.npmjs.com/package/vue-esign

  添加印章：
  https://blog.csdn.net/weixin_40800926/article/details/102974318


 -->

 <!-- 
  离职办理流程：
  1. 员工提出离职申请
  2. 管理员预览离职协议书，并签字发给员工
  3. 员工签字，发给管理员，管理员收到后确认无误，审核通过，发送离职邮件给员工，员工收到邮件后将无法再登录小程序
  -->