import React, { useEffect, useState } from 'react'
import { Card, Table, Button, message } from 'antd'

import LinkButton from '../../component/LinkButton'
import { reqUser } from '../../api'
import { PAGE_SIZE } from '../../util/constants'

export default function User() {

  // 存放所有的用户
  const [users, setUsers] = useState([])
  // card左侧显示
  const title = (<Button type='primary'>创建用户</Button>)
  // table columns
  const columns = [
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '邮箱',
      dataIndex: 'email'
    },
    {
      title: '电话',
      dataIndex: 'phone'
    },
    {
      title: '注册时间',
      dataIndex: 'create_time'
    },
    {
      title: '所属角色',
      dataIndex: 'auth_name'
    },
    {
      title: '操作',
      render: () => (
        <span>
          <LinkButton>修改</LinkButton>
          <LinkButton>删除</LinkButton>
        </span>
      )
    },
  ]
  // 获取用户列表
  const getUsers = async () => {
    const result = await reqUser()
    if (result.status === 0) {
      setUsers(result.data.users)
    } else {
      message.error('获取用户列表失败')
    }
  }
  useEffect(() => {
    getUsers()
  }, [])
  return (
    <Card title={title}>
      <Table
        rowKey='_id'
        dataSource={users}
        columns={columns}
        bordered// 显示表格边框
        pagination={{
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true
        }}
      >
      </Table>
    </Card>
  )
}
