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
    redirect: "/home/medicalRecord",
    component: () => import("@/views/Home"),
    meta: {
      title: "首页",
      index: 3,
    },
    children: [
      {
        path: "/home/medicalRecord",
        name: "MedicalRecord",
        icon: "iconfont icon-bingli",
        component: () => import("@/views/MedicalRecord"),
        meta: {
          title: "病历查看",
        },
      },
      {
        path: "/home/organization",
        name: "organization",
        icon: "iconfont icon-jigou",
        component: () => import("@/views/Organization"),
        meta: {
          title: "机构查看",
        },
      },
      {
        path: "/home/orgforadmin",
        props: true,
        name: "orgforadmin",
        icon: "iconfont icon-jigou",
        component: () => import("@/views/OrgforAdmin"),
        meta: {
          title: "机构查看（管理员）",
        },
      },
      {
        path: "/home/department/:id",
        props: true,
        name: "department",
        icon: "iconfont icon-jigou",
        component: () => import("@/views/Department"),
        meta: {
          title: "查看科室",
        },
      },
      // {
      //   path: "/home/organizationinfo",
      //   name: "organizationInfo",
      //   icon: "iconfont icon-jigou",
      //   component: () => import("@/views/OrganizationInfo"),
      //   meta: {
      //     title: "机构信息",
      //   },
      //   children: [
      //     {
      //       path: "/home/organization",
      //       name: "organization",
      //       icon: "iconfont icon-jigou",
      //       component: () => import("@/views/Organization"),
      //       meta: {
      //         title: "机构查看",
      //         show: true,
      //       },
      //     },
      //     {
      //       path: "/home/department",
      //       name: "department",
      //       icon: "iconfont icon-jigou",
      //       component: () => import("@/views/Department"),
      //       meta: {
      //         title: "查看科室",
      //         show: false,
      //       },
      //     },
      //   ],
      // },
    ],
  },
  {
    path: "/home/department",
    name: "department",
    icon: "iconfont icon-jigou",
    component: () => import("@/views/Department"),
    meta: {
      title: "查看科室",
    },
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
    document.title = "电子病历系统";
  }
});
export default router;
