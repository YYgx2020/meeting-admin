import axios from "../../utils/request";

export default {
  get(data) {
    return axios({
      url: '/api/organization/get',
      method: 'get',
      params: data,
    })
  },
  
  search(data) {
    return axios({
      url: '/api/organization/search',
      method: 'get',
      params: data,
    })
  },

  del(data) {
    return axios({
      url: '/api/organization/sys/del',
      method: 'post',
      data,
    })
  },

  pass(data) {
    return axios({
      url: '/api/organization/pass',
      method: 'post',
      data,
    })
  },

  noPass(data) {
    return axios({
      url: '/api/organization/del',
      method: 'post',
      data,
    })
  },

  getPassList(data) {
    return axios({
      url: '/api/organization/sys/getPassList',
      method: 'get',
      params: data,
    })
  },

  searchByKeyWord(data) {
    return axios({
      url: '/api/organization/sys/searchByKeyWord',
      method: 'get',
      params: data,
    })
  },

  // 解封
  unseal(data) {
    return axios({
      url: '/api/organization/sys/unseal',
      method: 'post',
      data,
    })
  }
  
}