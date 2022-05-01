import React, { useEffect, useState } from 'react'
import { useLocation ,useNavigate} from 'react-router-dom'
//引入对话框需要的组件
import { Modal, Button, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import LinkButton from '../LinkButton';//引入LinkButton代替a标签
import menuList from '../../config/menuConfig'//引入导航菜单配置项
import { reqWeather } from '../../api'//引入请求天气的api
import { formmateDate } from '../../util/dateUtils'//处理时间样式的模块
import memoryUtils from '../../util/memoryUtils'//内存模块
import storageUtils from '../../util/storageUtils'//进行数据存储管理模块
import './index.css'

export default function Header() {

  //得到当前的路径,通过location来获取
  const location = useLocation()
  //引入钩子useNavigate,解决编程式路由导航问题
  const navigate = useNavigate()
  //得到path
  const path = location.pathname
  //从memoryUtils中得到user
  const username = memoryUtils.user.username
  //定义头部的时间,存放在state中
  const [time, setTime] = useState(formmateDate(Date.now()))
  //定义头部的天气，存放在state中
  const [weather, setWeather] = useState('')
  //获取标题
  let title
  //定时器
  let timer
  //定义获取当前时间的函数
  function getTime() {
    //定义循环定时器
    timer=setInterval(() => {
      //每隔一秒更新state中的time值
      setTime(formmateDate(Date.now()))
    }, 1000);
  }

  //定义请求天气的函数,
  async function getWeather(city) {
    const data = await reqWeather(city)
    // console.log(data)//阴
    setWeather(data)
  }

  //定义title的更新显示
  function changeTitle() {
    menuList.find(item => {
      if (item.key === path) {
        title = item.title//返回路由的标题
      }
      else if (item.children) {//判断是否存在二级路由
        const CItem = item.children.find(citem => path.indexOf(citem.key)===0)//二级路由中是否有匹配成功的路由
        if (CItem) {//子路由中存在匹配成功的路由
          title = CItem.title//返回路由的标题
        } 
      } 
    })
  }

  //定义退出的函数
  function layout() {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: '确认退出吗？',
      okText: '确认',
      onOk() {
        // console.log('ok')
        //清除本地保存的数据
        storageUtils.removeUser()
        //清除内存保存的数据
        memoryUtils.user = {}

        //跳转到登录界面
        navigate('/login',{replace:true})
      },
      cancelText: '取消',
    });
  }

  useEffect(() => {
    //获取当前时间
    getTime()
    //获取当前天气，使用jsonp请求,需要参数：城市的编码，番禺区440113
    getWeather('440113')
    //清除定时器
    return () => {
      clearInterval(timer)
    }
  }, [])

  //调用更新title的函数
  changeTitle()
  return (
    <div className='header'>
      <div className='header-top'>
        <span>欢迎,{username}</span>
        {/* <a href="#" onClick={layout}>退出</a> */}
        <LinkButton onClick={layout} >退出</LinkButton>
      </div>
      <div className='header-bottom'>
        <div className='header-bottom-left'>
          {title}
        </div>
        <div className='header-bottom-right'>
          <span>{time}</span>
          <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fp7.itc.cn%2Fq_70%2Fimages03%2F20210905%2F10d09553131740f5997ed3d5df489f30.jpeg&refer=http%3A%2F%2Fp7.itc.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1653009353&t=70b38fbfe0c10d51ffabc70e2ba048c7" alt="weather" />
          <span>{weather}</span>
        </div>
      </div>
    </div>
  )
}
