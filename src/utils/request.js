import axios from 'axios'
import store from '@/store'



//创建axios实例
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // 本地测试用
  // baseURL: "http://172.22.1.200:8084/api", // 远程部署用
  baseURL: "http://localhost:8885/api", // 远程部署用
  //baseURL: "http://82.157.31.212:8885/api",
})

// request 请求拦截，向请求头里面加数据，这个地方config就是request，是对request进行的配置
service.interceptors.request.use(
  config => {
    if (store.getters.getToken) {
      config.headers['token'] = window.sessionStorage.getItem("token")
    }
    return config
  },
  error => {
    // do something with request error
    console.log("错误问题",error) // for debug
    alert("do something with request error")
    return Promise.reject(error)
  }
)

//response响应拦截
axios.interceptors.response.use(response => {
    let res = response.data;
    if (res.retcode === 'ok' ||res.retcode === 'error') {
      return response
      //本地测试用example.docx  远程部署用complete_example.docx
      //未来不使用get('Content-Disposition')，通过其它方式拦截返回的文件流
    }
    // else if (response.headers.get('Content-Disposition') === 'attachment; filename="example.docx"'){
    // // } else if (response.headers.get('Content-Disposition') === 'attachment; filename="complete_example.docx"'){
    //   return response
    // }else if (response.headers.get('Content-Disposition') === 'attachment; filename="sbqd.xlsx"'){
    //   return response
    // }
    else if (response.headers.get('Content-Type') === 'application/octet-stream'){
      return response
    } else {
      console.log("到Promise:","ok")
      return Promise.reject(response.data.msg)
    }
  },
  error => {
   // console.log(error)
    if (error.response.data) {
      error.message = error.response.data.msg
    }
    if (error.response.data.retcode !== 'ok') {
      router.push("/")
    }
    return Promise.reject(error)
  }
)


export default service

