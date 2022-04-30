//定义路由表

import { Navigate } from 'react-router-dom'
import Admin from '../pages/Admin'
import Login from '../pages/Login'
import Category from '../pages/Category'
import Home from '../pages/Home'
import Product from '../pages/Product'
import Role from '../pages/Role'
import User from '../pages/User'
import Bar from '../pages/Charts/Bar'
import Line from '../pages/Charts/Line'
import Pie from '../pages/Charts/Pie'
import ProductHome from '../pages/Product/ProductHome'
import AddUpdate from '../pages/Product/AddUpdate'
import Detail from '../pages/Product/Detail'

export default [
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'admin',
        element: <Admin />,
        children: [
            {
                path: 'category',
                element: <Category />
            },
            {
                path: 'charts/bar',
                element: <Bar />
            },
            {
                path: 'charts/line',
                element: <Line />
            },
            {
                path: 'charts/pie',
                element: <Pie />
            },

            {
                path: 'home',
                element: <Home />
            },
            {
                path: 'product',
                element: <Product />,
                children: [
                    {
                        path: '',
                        element: <ProductHome/>
                    },
                    {
                        path: 'addupdate',
                        element: <AddUpdate/>
                    },
                    {
                        path: 'detail',
                        element: <Detail/>
                    },
                    {
                        path: '*',
                        element: <Navigate to='' />
                    }
                ]
            },
            {
                path: 'role',
                element: <Role />
            },
            {
                path: 'user',
                element: <User />
            },
            {
                path: '*',
                element: <Navigate to="home" />
            },
            {
                path: '',
                element: <Navigate to="home" />
            }
        ]
    },
    {
        path: '/',
        element: <Navigate to="/login" />
    },
]