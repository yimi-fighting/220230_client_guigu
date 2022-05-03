/**
 * 要求：能根据接口文档定义接口请求
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 */

//引入自定义的ajax模块
import ajax from './ajax'
//引入jsonp
import jsonp from 'jsonp'
import { message } from 'antd'
const BASE='http://localhost:3000'

//采用分别暴露的方式暴露多个请求函数模块

//登录
export const reqLogin = (username, password) => ajax(BASE+'/api1/login', { username, password }, 'POST')

//添加用户
export const reqAddUser=(user)=>ajax(BASE+'/api1/manage/user/add',user,'POST')

// 获取用户列表
export const reqUser=()=>ajax(BASE+'/api1/manage/user/list')

// 删除用户
export const reqDeleteUser = (userId) => ajax(BASE + '/api1/manage/user/delete', { userId }, 'POST')


//获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE+'/api1/manage/category/list', { parentId }, 'GET')

//添加分类
export const reqAddCategorys = (parentId,categoryName) => ajax(BASE+'/api1/manage/category/add', { parentId ,categoryName}, 'POST')

//更新分类
export const reqUpdateCategorys = (categoryId,categoryName) => ajax(BASE+'/api1/manage/category/update', { categoryId ,categoryName}, 'POST')

//请求天气
export const reqWeather = (city) => {
    return new Promise((resolve,reject) => {
        const url=`https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=2a438f2c8618786d5e04b42d4f857674`

        jsonp(url, {}, (err, data) => {
            if (!err && data.status === '1') {
                //成功
                const { weather } = data.lives[0]
                resolve(weather)
            }else {
             message.error('获取天气信息失败')   
            }
        })
    })
}

//获取商品分类列表
export const reqProducts=(pageNum,pageSize)=>ajax(BASE+'/api1/manage/product/list',{pageNum,pageSize},'GET')

//添加商品
export const reqAddProduct = (product) => ajax(BASE+'/api1/manage/product/add', product, 'POST')

// 更新商品
export const reqUpdateProduct = (product) => ajax(BASE+'/api1/manage/product/update', product, 'POST')

// 搜索产品分类列表
// searchType: 搜索的类型, productName/productDesc
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(BASE+'/api1/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]:searchName
}, 'GET')

// 根据分类ID获取分类
export const reqCategory=(categoryId)=>ajax(BASE+'/api1/manage/category/info',{categoryId},'GET')

// 对商品进行上架/下架处理
export const reqUpdateStatus=(productId,status)=>ajax(BASE+'/api1/manage/product/updateStatus',{productId,status},'POST')

// 删除图片
export const reqDeleteImg=(name)=>ajax(BASE+'/api1/manage/img/delete',{name},'POST')

// 获取角色列表
export const reqRoles = () => ajax(BASE + '/api1/manage/role/list')

// 添加角色
export const reqAddRole = (roleName) => ajax(BASE + '/api1/manage/role/add', { roleName }, 'POST')

// 更新角色（给角色设置权限)
export const reqUpdateRole = (role) => ajax(BASE + '/api1/manage/role/update', role, 'POST')

