import React, { Fragment, useEffect, useState } from 'react'
import { Card, Select, Input, Button, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';

import LinkButton from '../../../component/LinkButton'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../../api';
import { PAGE_SIZE } from '../../../util/constants';//引入常量
import './index.css'
import { useNavigate } from 'react-router-dom';

let pagenum //用于保存当前页码
export default function ProductHome() {
  // 编程式路由导航
  const navigate = useNavigate()
  // 将获取的product存储在state中
  const [products, setProducts] = useState([])
  // 选择的类型
  const [searchType, setSearchType] = useState('productName')
  // input框中的值
  const [searchName, setSearchName] = useState('')
  // 数据总数
  const [total, setTotal] = useState(0)
  // loading
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      title: '商品名称',
      width: 200,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '商品描述',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '价格',
      width: 150,
      dataIndex: 'price',
      render: (price) => '￥' + price
    },
    {
      title: '状态',
      width: 100,
      render: (product) => {
        const { _id, status } = product
        const newStatus = status === 1 ? 0 : 1
        return (
          <span>
            <Button
              type='primary'
              // 调用更改status的函数
              onClick={() => updateStatus(_id, newStatus)}
            >
              {status === 1 ? '下架' : '上架'}
            </Button>
            <br />
            <span>{status === 1 ? '已下架' : '在售'}</span>
          </span>
        )
      }
    },
    {
      title: '操作',
      width: 100,
      render: (product) => {
        return (
          <span>
            {/* 点击详情，跳转到detail路由,传递state参数 */}
            <LinkButton
              onClick={() => {
                navigate('detail', {
                  state: product
                })
              }}
            >
              详情
            </LinkButton>
            <br />
            <LinkButton
              onClick={() => {
                navigate('addupdate', {
                  state:product
                })
            }}
            >修改</LinkButton>
          </span>
        )
      }
    },
  ];

  // card左侧
  const title = (
    <span>
      <Select value={searchType} onChange={value => setSearchType(value)}>
        <Select.Option value='productName'>按名称搜索</Select.Option>
        <Select.Option value='productDesc'>按描述搜索</Select.Option>
      </Select>
      <Input className='title-input' placeholder='关键字' onChange={event => setSearchName(event.target.value)} ></Input>
      <Button type='primary' onClick={() => getProducts(1)}>搜索</Button>
    </span>
  )
  // card右侧
  const extra = (
    // 当点击添加商品按钮，进行路由跳转
    <Button type='primary' icon={<PlusOutlined />} onClick={()=>{navigate('addupdate')}}>添加商品</Button>
  )

  // 更改status的函数,处理商品上架下架问题
  async function updateStatus(_id, status) {
    const result = await reqUpdateStatus(_id, status)
    if (result.status === 0) {
      message.success('商品状态更新成功')
      // 重新渲染页面，调用获取商品列表函数getProducts
      getProducts(pagenum)
    } else {
      message.error('商品更新失败')
    }
  }

  // 获取商品列表函数
  async function getProducts(pageNum) {
    pagenum=pageNum//保存当前页码
    // 显示loading
    setLoading(true)
    let result
    // 判断发送的是一般的分页请求还是，搜索分页
    if (searchName) {
      // 发送搜索产品分类列表的ajax请求
      result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
    } else {
      // 发送获取商品列表的ajax请求
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    if (result.status === 0) {
      // 隐藏loading
      setLoading(false)
      // 更新products,total
      setProducts(result.data.list)
      setTotal(result.data.total)
    } else {
      message.error('商品列表获取失败')
    }
  }


  // 当界面第一次渲染时调用
  useEffect(() => {
    // 调用获取商品列表函数
    getProducts(1)
  }, [])

  return (
    <div>
      <Card title={title} extra={extra}>
        <Table
          // loading
          loading={loading}
          // 分页
          pagination={{
            // 数据总数
            total,
            // 默认每页条数
            defaultPageSize: PAGE_SIZE,
            // 是否快速跳转
            showQuickJumper: true,
            //当页码改变时触发
            onChange: (pageNum) => getProducts(pageNum)
          }}
          // 边框
          bordered
          // 表格行 key 的取值，可以是字符串或一个函数
          rowKey='_id'
          // 数据数组
          dataSource={products}
          // 列的描述数组
          columns={columns} />;
      </Card>
    </div>
  )
}
