import axios from "../../utils/request";

export default {
  getDepartmentInfo(data) {
    return axios({
      url: '/dev-api/dept/selectAll',
      method: 'get',
      params: data,
    })
  },

  dSearch(data) {
    return axios({
      url: '/dev-api/dept/dSearch',
      method: 'get',
      params: data,
    })
  },

  getInstituteUserInfo(data) {
    return axios({
      url: '/dev-api/instituteUser/selectAll',
      method: 'get',
      params: data,
    })
  }
}