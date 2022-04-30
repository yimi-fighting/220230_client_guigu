/**
 * 能发送异步Ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是promise对象
 * 
 * 优化：统一处理请求异常
 *      在外层包裹一个自己创建的promise对象
 *      在请求出错时不reject（error），而是显示错误提示
 * 
 * 优化2：在请求成功后不想得到response，而是得到response.data
 *      直接在请求成功时，resolve（response.data）
 *
 */

import axios from 'axios'
//引入antd中的message
import { message } from 'antd'

//ajax需要返回的是一个promise对象
export default function ajax(url, data = {}, type = 'GET') {

    return new Promise((resolve, reject) => {
        //1.执行异步Ajax请求e
        let promise
        if (type === 'GET') {//发送get请求
            // axios返回的是promise对象
            promise =axios.get(url,{params:data})//配置对象，并指定请求参数
        } else {//发送post请求
            promise= axios.post(url,data)
        }
        //2.执行成功回调
        promise.then(response => {
            // 请求成功后返回response
            // resolve(response)
            // 请求成功后返回response.data
            resolve(response.data)
        }).catch(error => {
            //3.执行错误回调,不调用reject而是提示错误
            // reject(error)
            message.error('请求出错了：'+error.message)
        })
        
    })

}