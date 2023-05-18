import axios from "../../utils/request";

export default {
  login(data) {
    return axios({
      url: '/api/user/login',
      method: 'post',
      data,
    })
  },

  // 获取验证码
  getVerifyCode(data) {
    return axios({
      url: '/api/code/',
      method: 'get',
      params: data,
    })
  }
}