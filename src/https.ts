// /**
//  * Created by superman on 17/2/16.
//  * http配置
//  */

import axios from "axios";
import { HttpHost } from "./common/api";
import { AxiosElasticService } from "./common/fromaxios";
import AuthServies from "./page/auth/auth.servies";
import store from "./store";
// import authServicer from './serves/auth.services'
// import { CONFIG } from './rconfig'
// import router from './router'

// axios 配置
let isTokenExpired = false;
// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    console.log("isTokenExpired1", isTokenExpired);
    // @ts-ignore
    console.log("isTokenExpired1 store.state", store.state.login.idtoken);
    // console.log(
    //   "https.ts",
    //   !(store.state === null) && isTokenExpired === false,store.state.login.idtoken,isTokenExpired
    // );
    // @ts-ignore
    if (!(store.state.login.idtoken == null) && isTokenExpired == false) {
      isTokenExpired = true;
      // console.log("isTokenExpired", isTokenExpired);
      // 判断token是否需要刷新;
      // @ts-ignore
      let _stoken = store.state.login.idtoken;
      let chicktokentime = AuthServies.chicktokenTime(_stoken);
      // let chicktokentime = 3;
      // console.log("http chicktokentime", chicktokentime);
      if (chicktokentime >= 12) {
        isTokenExpired = false;
        console.log("已经登录");
      } else if (chicktokentime < 12 && chicktokentime > 0) {
        console.log("进入刷新token的方法里面吗");
        // 就刷新token
        AuthServies.bytokengettoken().subscribe((success) => {
          console.log("https 刷新token成功", success);
        });
      } else {
        console.log("没登录");
        isTokenExpired = false;
      }
    } else {
      
      // TODO: 错误处理
      console.log("error1234");
    }

    // 判断请求是否加token
    if (AxiosElasticService.checkfuctionUrlIdtoken(config.url)) {
      // @ts-ignore
      console.log(store.state.login.idtoken);
      console.log("http 需要加token");
      // @ts-ignore
      config.headers.authorization = store.state.login.idtoken;
    } else {
      console.log("http 不需要加token");
    }
    console.log(config);
    return config;
  },
  (err) => {
    console.log("err", err);
  }
);

// // http response 拦截器
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("authervice error2  2", error["Error"]);
    if (error.response) {
      switch (error.response.status) {
        case 500:
          // 401 清除token信息并跳转到登录页面
          // store.commit(types.LOGOUT)
          console.log("htt______________________p", error.response);
        // if (error.response.data.message === 'token认证失败！') {
        //   console.log('token认证失败！')
        //   authServicer.logoutokenState()
        //   // window.location.reload()
        // }

        // 身份过期，要求用户从新登录
        // 只有在当前路由不是登录页面才跳转
        // router.currentRoute.path !== 'login' &&
        //   router.replace({
        //     path: 'login',
        //     query: { redirect: router.currentRoute.path }
        //   })
      }
    }
    return Promise.reject(error.response.data);
  }
);

export default axios;
