/* 
  将表格里面的数据生成 excel 数据然后导出
*/
// 将包导入
import FileSaver from "file-saver";
import * as XLSX from "xlsx/xlsx.mjs";

export function getExcel(dom, title) {
  // console.log('123');
  var excelTitle = title;
  let fix = document.querySelector(".el-table__fixed-right"); // 如果是只有右边有fixed样式
  // console.log(XLSX);
  let wb;
  if (fix) {
    //判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
    wb = XLSX.utils.table_to_book(
      document.querySelector(dom).removeChild(fix)
    );
    document.querySelector(dom).appendChild(fix);
  } else {
    wb = XLSX.utils.table_to_book(
      document.querySelector(dom)
    );
  }
  // var wb = XLSX.utils.table_to_book(document.querySelector(dom));
  //  获取二进制字符串作为输出
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: true,
    type: "array",
  });
  try {
    FileSaver.saveAs(
      new Blob([wbout], {
        type: "application/octet-stream",
      }),
      excelTitle + ".xlsx"
    );
  } catch (e) {
    if (typeof console !== "undefined") {
      console.log(e, wbout);
    }
  }
  return wbout;
}
