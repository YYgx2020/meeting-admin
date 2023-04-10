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
    redirect: "/home/databoard",
    component: () => import("@/views/Home"),
    meta: {
      title: "首页",
      index: 3,
    },
    children: [
      {
        path: "/home/databoard",
        name: "databoard",
        icon: "iconfont icon-shouye-shouye",
        component: () => import("@/views/Databoard"),
        meta: {
          title: "首页",
        },
      },
      {
        path: "/home/news",
        name: "news",
        icon: "iconfont icon-xinwenzixun",
        component: () => import("@/views/News"),
        meta: {
          title: "新闻管理",
        },
      },
      {
        path: "/home/attendance",
        name: "attendance",
        icon: "iconfont icon-xueshengkaoqin",
        component: () => import("@/views/Attendance"),
        meta: {
          title: "考勤管理",
        },
      },
      {
        path: "/home/recruitment",
        name: "recruitment",
        icon: "iconfont icon-qidongzhaopinshenpi",
        component: () => import("@/views/Recruitment"),
        meta: {
          title: "招聘管理",
        },
      },
      {
        path: "/home/performance",
        name: "performance",
        icon: "iconfont icon-xiaofeijiangli",
        component: () => import("@/views/Performance"),
        meta: {
          title: "绩效和奖惩管理",
        },
      },
      {
        path: "/home/approve",
        name: "approve",
        component: () => import("@/views/Approval"),
        meta: {
          title: "审批管理",
        },
        children: [
          {
            path: "/home/approve/vacate",
            name: "vacate",
            component: () => import("@/views/Vacate"),
            meta: {
              title: "请假审批",
            },
          },
          {
            path: "/home/approve/dormitory",
            name: "dormitory",
            component: () => import("@/views/Dormitory"),
            meta: {
              title: "宿舍调换审批",
            },
          },
          {
            path: "/home/approve/job",
            name: "job",
            component: () => import("@/views/Job"),
            meta: {
              title: "岗位调换审批",
            },
          },
          {
            path: "/home/approve/department",
            name: "department",
            component: () => import("@/views/Department"),
            meta: {
              title: "部门调换审批",
            },
          },
          {
            path: "/home/approve/leave",
            name: "leave",
            component: () => import("@/views/Leave"),
            meta: {
              title: "离职审批",
            },
          },
          {
            path: "/home/approve/employee",
            name: "employee",
            component: () => import("@/views/Employee"),
            meta: {
              title: "员工注册审批",
            },
          },
          {
            path: "/home/approve/admin",
            name: "admin",
            component: () => import("@/views/Admin"),
            meta: {
              title: "管理员审批",
            },
          },
        ],
      },
    ],
  },
  {
    path: '/home/news/editor',
    name: 'editor',
    component: () => import('@/views/Editor'),
    meta: {
      title: '新闻编辑',
      index: 4,
    }
  },
  {
    path: '/home/news/detail',
    name: 'detail',
    component: () => import('@/views/Detail'),
    meta: {
      // title: '',
      index: 5,
    }
  }
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
  const userInfo = Cookie.get('userInfo') ? JSON.parse(Cookie.get('userInfo')) : null;
  // console.log(to, from);
  // if (userInfo) {
  //   // 跳转到 home 页面
  //   next("home");
  //   // next();
  // } else 
  if (to.name === 'login' || to.name === 'register') {
    next();
  } else if (!userInfo) {
    console.log('跳转到登录页面');
    return next({
      name: 'login'
    });
  } else {
    if (to.name === 'admin' && userInfo.is_super !== 1) {
      next("home");
    }
    next();
  }
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
    document.title = "小型人资管理系统";
  }
});
export default router;
