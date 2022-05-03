import React, { Fragment, useEffect, useState } from 'react'
import { Card, Table, Button, message, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import LinkButton from '../../component/LinkButton'
import { reqUser, reqDeleteUser, reqAddUser } from '../../api'
import { PAGE_SIZE } from '../../util/constants'
import UserForm from './UserForm'
import UpdateForm from './UpdateForm'
import { formmateDate } from '../../util/dateUtils'

let propsForm
let roleNames
export default function User() {
  // 存放所有的用户
  const [users, setUsers] = useState([])
  // 存放所有的role
  const [roles, setRoles] = useState([])
  // 是否显示创建用户的modal
  const [isShowAdd, setIsShowAdd] = useState(false)
  // 是否显示update用户的modal
  const [isShowUpdate, setIsShowUpdate] = useState(false)
  // 当前点击的user
  const [user,setUser]=useState({})
  // card左侧显示
  const title = (<Button type='primary' onClick={() => setIsShowAdd(true)}>创建用户</Button>)
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
      dataIndex: 'create_time',
      render: formmateDate
    },
    {
      title: '所属角色',
      dataIndex: 'role_id',
      render: (role_id) => roleNames[role_id]
    },
    {
      title: '操作',
      render: (user) => (
        <span>
          <LinkButton onClick={()=>onClickUpdate(user)}>修改</LinkButton>
          <LinkButton onClick={() => deleteUser(user)}>删除</LinkButton>
        </span>
      )
    },
  ]
  // 点击修改按钮
  const onClickUpdate = (user) => {
    // 显示对话框
    setIsShowUpdate(true)
    // 将点击的user对象存在state中
    setUser(user)
  }
  // 删除用户
  const deleteUser = (user) => {
    Modal.confirm({
      title: `确认删除${user.username}吗?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功')
          // 重新加载页面
          getUsers()
        } else {
          message.error('删除用户失败')
        }
      }
    });
  }
  // 根据role_id得到role.name 
  const initRoleNames = (roles) => {
    const roleName = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
    roleNames = roleName
  }
  // 获取用户列表
  const getUsers = async () => {
    const result = await reqUser()
    if (result.status === 0) {
      const { users, roles } = result.data
      initRoleNames(roles)
      setUsers(users)
      setRoles(roles)
    } else {
      message.error('获取用户列表失败')
    }
  }
  // 添加用户modal
  const addUser = () => {
    propsForm.validateFields().then(async value => {
      const result = await reqAddUser(value)
      if (result.status === 0) {
        message.success('添加用户成功')
        // 隐藏对话框
        setIsShowAdd(false)
        // 将文本框页面置空
        propsForm.setFieldsValue({ username: '', password: '', phone: '', email: '' })
        // 更新页面
        setUsers([...users, result.data])
      } else {
        message.error('添加用户失败')
      }
    })
  }
  // 更新用户modal
  const updateUser = () => {

  }

  useEffect(() => {
    getUsers()
  }, [])
  return (
    <Fragment>
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
      <Modal
        title='添加用户'
        visible={isShowAdd}
        onOk={addUser}
        onCancel={() => setIsShowAdd(false)}
      >
        <UserForm setForm={form => (propsForm = form)} roles={roles} />
      </Modal>
      <Modal
        title='更改用户'
        visible={isShowUpdate}
        onOk={updateUser}
        onCancel={() => setIsShowUpdate(false)}
      >
        <UpdateForm setForm={form => (propsForm = form)} roles={roles} user={user}/>
      </Modal>
    </Fragment>
  )
}
