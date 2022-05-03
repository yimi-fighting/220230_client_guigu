import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Menu } from 'antd';
import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from '@ant-design/icons';
import './index.css'

//引入logo图片
import logo from '../../assets/images/logo.png'
import { Link, useLocation } from 'react-router-dom';
//引入导航菜单
import menuConfig from '../../config/menuConfig'
import memoryUtils from '../../util/memoryUtils'

const { SubMenu } = Menu;
// 当前需要打开的子列表
let key

export default function LefNav() {

  //得到当前请求的路径链接，通过location获取
  const location = useLocation()
  // console.log(location)//{pathname: '/admin/category', search: '', hash: '', state: null, key: 'asmwnqez'}
  let path = location.pathname
  if (path.indexOf('/product') === 6) {
    path = '/admin/product'
  }
  // 判断item是否在menus中
  const hasAuth = (item) => {
    const { key, isPublic } = item
    const menus = memoryUtils.user.role.menus
    const username = memoryUtils.user.username
    /**
     * 1.如果当前用户是admin
     * 2.如果当前item是公开的
     * 3.当前用户有此item的权限，key有没有在menus中
     */
    if (username == 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) {
      // 当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }

  function getMenuNodes(menuConfig) {
    return menuConfig.reduce((pre, item) => {
      // 判断item是否在menus中
      if (hasAuth(item)) {
        if (!item.children) {
          pre.push((
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}> {item.title}</Link>
            </Menu.Item>
          ))
        } else {
          //查找一个与当前请求路径匹配的子Item
          // const cItem = item.children.find(citem => citem.key === path)
          let cItem = item.children.find(citem => path.indexOf(citem.key) === 0)
          //当发现点击的路由是某个的子路由时，说明当前item子列表需要打开
          // console.log(Object.prototype.toString.call(item.key))
          if (cItem) {
            key = item.key
            // console.log(Object.prototype.toString.call(openkey),openkey)
          }
          pre.push((
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {getMenuNodes(item.children)}
            </SubMenu>
          ))
        }
      }
      return pre
    }, [])
  }
  getMenuNodes(menuConfig)

  return (
    <div className='lef-nav'>
      <Link to="/" className='lef-nav-header'>
        <img src={logo} alt="logo" />
        <h1>硅谷后台</h1>
      </Link>
      <Menu
        mode="inline"
        theme="dark"
        // 当前选中的菜单项 key 数组
        selectedKeys={[path]}
        //设置需要打开的子列表
        defaultOpenKeys={[key]}
      >
        {getMenuNodes(menuConfig)}
      </Menu>
    </div>
  )
}
