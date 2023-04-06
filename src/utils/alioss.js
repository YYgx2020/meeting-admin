const OSS = require('ali-oss');

const client = new OSS({
  region: 'oss-cn-guangzhou',
  accessKeyId: 'LTAI5tRUSMEuLtafGBhrcqAi',
  accessKeySecret: '0DiPjUxmBaDX1G7MMOZDhbdZnCBAsF',
  bucket: 'hrms-gan'
})  //后端提供数据

/**
 *  上传文件，大小不能超过5GB
 * @param {string} ObjName OSS的储存路径和文件名字
 * @param {string} fileUrl 本地文件
 *
 * @retruns Promise
 */
export const put = async (ObjName, fileUrl) => {
  try {
    let result = await client.put(`uploads/file/${ObjName}.jpeg`, fileUrl)
    // AAA为文件夹， ObjName为文件名字,可以只写名字，就直接储存在 bucket 的根路径
    console.log(result)
    // loading.close();
    return result
  } catch (e) {
    console.log(e)
    // loading.close();
  }
}
/* 
  AccessKey ID
LTAI5tRUSMEuLtafGBhrcqAi

AccessKey Secret
0DiPjUxmBaDX1G7MMOZDhbdZnCBAsF
*/
