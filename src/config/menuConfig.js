//导航菜单的配置
import {
    PieChartOutlined,
  } from '@ant-design/icons';
const menuList = [
    {
        title: '首页',//菜单标题名称
        key: '/admin/home',//对应的path
        icon: <PieChartOutlined />,//图标名称
    },
    {
        title: '商品',
        key: '/products',
        icon: <PieChartOutlined />,
        children: [
            // 子菜单列表 
            {
                title: '品类管理',
                key: '/admin/category',
                icon: <PieChartOutlined />
            },
            {
                title: '商品管理',
                key: '/admin/product',
                icon: <PieChartOutlined />
            },
        ]
    },
    {
        title: '用户管理',
        key: '/admin/user',
        icon: <PieChartOutlined />
    },
    {
        title: '角色管理',
        key: '/admin/role',
        icon: <PieChartOutlined />
    },
    {
        title: '图形图表',
        key: '/charts',
        icon: <PieChartOutlined />,
        children: [
            {
                title: '柱形图',
                key: '/admin/charts/bar',
                icon: <PieChartOutlined />
            },
            {
                title: '折线图',
                key: '/admin/charts/line',
                icon: <PieChartOutlined />
            },
            {
                title: '饼图',
                key: '/admin/charts/pie',
                icon: <PieChartOutlined />
            },
        ]
    }
]

export default menuList