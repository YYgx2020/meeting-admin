import axios from "../../utils/request";

export default {
  getMeetingList(data) {
    return axios({
      url: '/api/room/sys/getMeetingList',
      method: 'get',
      params: data,
    })
  },

  getUserList(data) {
    return axios({
      url: '/api/user/sys/getUserList',
      method: 'get',
      params: data,
    })
  }
}