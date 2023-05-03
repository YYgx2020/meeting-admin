import axios from "../../utils/request";

export default {
  getDataList(data) {
    return axios({
      url: '/dev-api/institute/search',
      method: 'get',
      params: data,
    })
  },

  getOrganizationType() {
    return axios({
      url: '/dev-api/institute/search/type',
      method: 'get',
    })
  },
}