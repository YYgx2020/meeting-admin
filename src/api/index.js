import axios from "../utils/request";

/* 
  get 请求的参数放在 params 中
  post 请求的参数放在 body 中
*/

// 查看管理员工号是否被注册
export function checkAdminCode(data) {
  return axios({
    url: "/api/admin/checkAdminCode",
    method: "get",
    params: data,
  });
}

// 获取邮箱验证码
export function getVerifyCode(data) {
  return axios({
    url: "/api/code",
    method: "get",
    params: data,
  });
}

// 注册接口
export function register(data) {
  return axios({
    url: "/api/register",
    method: "post",
    data,
  });
}

// 登录接口
export function login(data) {
  return axios({
    url: "/api/login",
    method: "post",
    data,
  });
}


// 获取管理员列表
export function getAdminList() {
  return axios({
    url: '/api/admin/getAll',
    method: 'get',
  })
}

// 根据管理员 id 去更新管理员数据
export function updateAdminInfoById(data) {
  return axios({
    url: '/api/admin/update',
    method: 'post',
    data,
  })
}

// 根据管理员 id 删除管理员
export function deleteAdminById(data) {
  return axios({
    url: '/api/admin/del',
    method: 'post',
    data,
  })
}

// 根据管理员工号获取管理员信息
export function getAdminInfoByCode(data) {
  return axios({
    url: '/api/admin/getInfoByCode',
    method: 'get',
    params: data,
  })
}

// 重置密码
export function changePassword(data) {
  return axios({
    url: '/api/admin/changePassword',
    method: 'post',
    data,
  })
}

// 获取员工信息
export function getStaffList(data) {
  return axios({
    url: '/api/staff/getAll',
    method: 'get',
    params: data,
  })
}

// 更新员工信息
export function updateStaffInfo(data) {
  return axios({
    url: '/api/staff/adminUpdate',
    method: 'post',
    data,
  })
}