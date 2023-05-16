import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";

import Cookie from "js-cookie";

// 使用路由
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/Login"),
    meta: {
      title: "登录",
      index: 1,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/Register"),
    meta: {
      title: "新管理员注册",
      index: 2,
    },
  },
  {
    path: "/home",
    name: "home",
    // redirect: "/home/databoard",
    redirect: "/home/organization",
    component: () => import("@/views/Home"),
    meta: {
      title: "首页",
      index: 3,
    },
    children: [
      {
        path: "/home/organization",
        name: "organization",
        icon: "iconfont icon-jigou",
        component: () => import("@/views/Organization"),
        meta: {
          title: "机构管理",
        },
      },
      {
        path: "/home/meeting",
        name: "meeting",
        icon: "iconfont icon-jigou",
        component: () => import("@/views/Meeting"),
        meta: {
          title: "会议室管理",
        },
      },
      {
        path: "/home/user",
        name: "user",
        icon: "iconfont icon-jigou",
        component: () => import("@/views/User"),
        meta: {
          title: "用户管理",
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

// 全局前置守卫
/* 
  作用;
  判断是否登录，如果未登录，则跳转到登录页面进行登录
  以及页面是否需要超级管理员权限
*/
router.beforeEach((to, from, next) => {
  // //to 目标路由
  // //from 来源
  // //next 放行
  // const userInfo = Cookie.get('userInfo') ? JSON.parse(Cookie.get('userInfo')) : null;
  // console.log(to, from);
  // if (userInfo) {
  //   // 跳转到 home 页面
  //   next("home");
  //   // next();
  // } else
  if (to.name === "login" || to.name === "register") {
    next();
  }
  next();
  // else if (!userInfo) {
  //   console.log('跳转到登录页面');
  //   return next({
  //     name: 'login'
  //   });
  // } else {
  //   // if (to.name === 'admin' && userInfo.is_super !== 1) {
  //   //   next("home");
  //   // }
  //   next();
  // }
});
// http://127.0.0.1:8085/home/approve/admin

// 全局后置守卫：初始化时执行、每次路由切换后执行
router.afterEach((to, from) => {
  // console.log("afterEach");
  // console.log("to: ", to);
  // console.log("from: ", from);
  if (to.meta.title) {
    document.title = to.meta.title; //修改网页的title
  } else {
    document.title = "会议室预约管理系统";
  }
});
export default router;
