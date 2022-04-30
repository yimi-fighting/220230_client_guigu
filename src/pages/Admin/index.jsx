import React from 'react'
import { Navigate, Outlet, useNavigate, useRoutes, Route, Routes } from 'react-router-dom'
import memoryUtils from '../../util/memoryUtils'
import { Layout } from 'antd';
import LefNav from '../../component/LefNav';
import Header from '../../component/Header';
// import Category from '../Category'
// import Bar from '../Charts/Bar'
// import Line from '../Charts/Line'
// import Pie from '../Charts/Pie'
// import Home from '../Home'
// import Product from '../Product'
// import Role from '../Role'
// import User from '../User'


const { Footer, Sider, Content } = Layout;


export default function Admin() {
  //编程式路由导航
  const navigate = useNavigate()
  //获取内存中的user
  const user = memoryUtils.user
  //判断内存中是否由user，从而判断用户是否登录
  if (!user || !user._id) {
    //用户未登录，跳转到登录页面
    return (
      <Navigate to="/login" />
    )
  } else {
    return (
      <Layout style={{ minHeight: '100%' }}>
        <Sider>
          <LefNav />
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content style={{ margin: '20px' , backgroundColor:'#fff'}}>
            {/* <Routes>
              <Route path='category' element={<Category />}></Route>
              <Route path='charts/bar' element={<Bar />}></Route>
              <Route path='charts/line' element={<Line />}></Route>
              <Route path='charts/pie' element={<Pie />}></Route>
              <Route path='home' element={<Home />}></Route>
              <Route path='product' element={<Product />}></Route>
              <Route path='role' element={<Role />}></Route>
              <Route path='user' element={<User />}></Route>
              <Route peth='/' element={<Navigate to="/home" />}></Route>
            </Routes> */}
            <Outlet/>
          </Content>
          <Footer style={{ color: '#cccccc', textAlign: 'center' }}>推荐使用谷歌浏览器,可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}

