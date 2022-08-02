import axios from 'axios'
import store from '@/store'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net',
  timeout: 5000
})

request.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = store.state.tokenObj.token
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

export default request
