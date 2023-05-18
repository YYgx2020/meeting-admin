import axios from "../../utils/request";

export default {
  getMeetingList(data) {
    return axios({
      url: '/api/room/sys/getMeetingList',
      method: 'get',
      params: data,
    })
  }
}