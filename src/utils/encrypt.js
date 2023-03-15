// 密码加密脚本

const md5 = require("js-md5");

export default function encrypt(password) {
  return md5(password);
}
