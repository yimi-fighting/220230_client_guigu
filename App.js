import React, { Fragment } from 'react'
import { Navigate, Route, Routes, useRoutes } from 'react-router-dom'
import Login from './pages/Login'//引入login路由
import Admin from './pages/Admin'//引入admin路由

import routes from './router'//引入路由表

export default function App() {
  //根据路由表生成对应路由规则
  const element = useRoutes(routes)
  return (
    <Fragment>
      {/* 注册路由 */}
      <Routes>
        <Route path='login' element={<Login />}></Route>
        <Route path='admin' element={<Admin />}></Route>  
        {/* 定义重定向路由 */}
        <Route path='/' element={<Navigate to="login" />}></Route>
      </Routes>
      {element}
    </Fragment>
  )
}
