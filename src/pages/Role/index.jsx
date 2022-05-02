import React, { useEffect, useState } from 'react'
import { Button, Card, message, Table, Modal } from 'antd'

import { PAGE_SIZE } from '../../util/constants'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import AddForm from './AddForm'
import AuthForm from './AuthForm'
import storageUtils from '../../util/storageUtils'

let addRoleForm // 保存添加角色modal中传递过来的form
let menus // 保存修改角色权限modal中传递过来的menus
export default function Role() {
  // 所有roles数组
  const [roles, setRoles] = useState([])
  // 点击的role
  const [role, setRole] = useState({})
  // 是否显示创建角色对话框
  const [isShowCreate, setIsShowCreate] = useState(false)
  // 是否显示设置用户权限对话框
  const [isShowAuth, setIsShowAuth] = useState(false)
  // card的左侧
  const title = (
    <span>
      <Button type='primary' onClick={() => setIsShowCreate(true)}>创建角色</Button> &nbsp;&nbsp;
      <Button type='primary' disabled={!role._id} onClick={() => setIsShowAuth(true)}>设置角色权限</Button>
    </span>
  )
  // table的columns
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name'
    },
    {
      title: '创建时间',
      dataIndex: 'create_time'
    },
    {
      title: '授权时间',
      dataIndex: 'auth_time'
    },
    {
      title: '授权人',
      dataIndex: 'auth_name'
    },
  ]
  // 设置行属性,调用onRow函数
  const onRow = (record) => {
    // 接收参数为点击的行
    return {
      onClick: event => {
        // 将点击的role保存到state中
        setRole(record)
      }
    }
  }
  // 获取roles列表函数
  const getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      setRoles(result.data)
    } else {
      message.error('获取用户列表失败')
    }
  }
  // 添加角色
  const addRole =() => {
    addRoleForm.validateFields().then(async value => {
      // console.log(value)//{roleName: 'asda'}
      const result = await reqAddRole(value.roleName)
      if (result.status === 0) {
        message.success('添加用户成功')
        // 将文本框置空
        addRoleForm.setFieldsValue({roleName:''})
        // 将创建角色对话框隐藏
        setIsShowCreate(false)
        // 刷新页面
        const role=result.data
        setRoles([...roles,role])
      } else {
        message.error('添加用户失败')
      }
    })
  }
  // 更新角色
  const updateRole =async () => {
    const _id = role._id
    const user = storageUtils.getUser()
    const auth_name = user.username
    const time=new Date()
    const auth_time = time.getTime()
    const result =await reqUpdateRole({_id,menus,auth_time,auth_name})
    if (result.status === 0) {
      message.success('权限添加成功')
      // 对话框隐藏
      setIsShowAuth(false)
      // 更新页面
      getRoles()
    } else {
      message.error('权限添加失败')
    }
  }

  useEffect(() => {
    // 获得roles例表
    getRoles()
  }, [])
  return (
    <Card title={title}>
      <Table
        rowKey='_id'
        bordered
        // 设置行属性,调用onRow函数
        onRow={onRow}
        //分页器
        pagination={{
          defaultPageSize: PAGE_SIZE,//默认每页条数
          showQuickJumper: true//快速跳转
        }}
        // 表格行是否可选择，单选多选
        rowSelection={{
          type: 'radio',//设置单选
          selectedRowKeys: [role._id],//指定选中项的key数组
          //选中项发生变化时的回调
          onChange: (selectedRowKeys, selectedRows) => setRole(selectedRows[0])
        }}
        dataSource={roles}
        columns={columns}>
      </Table>
      {/* 渲染添加分类对话框 */}
      <Modal
        title="添加角色"
        visible={isShowCreate}
        // 调用添加分类函数
        onOk={addRole}
        //点击取消按钮，调用函数 ,将isModalVisible设置为0
        onCancel={() => setIsShowCreate(false)}
      >
        {/* 添加分类的form */}
        {/* 参数1：一级分类所有categories；参数2：用来表示是一级列表还是二级列表 */}
        <AddForm setForm={form =>addRoleForm=form} />
      </Modal>
      <Modal
        title="设置角色权限"
        visible={isShowAuth}
        // 调用更新分类函数
        onOk={updateRole}
        //点击取消按钮，调用函数 ,将isModalVisible设置为0
        onCancel={() => setIsShowAuth(false)}
      >
        {/* 添加分类的form */}
        {/* 参数1：一级分类所有categories；参数2：用来表示是一级列表还是二级列表 */}
        <AuthForm role={role} setmenus={m=>menus=m} />
      </Modal>
    </Card>
  )
}
