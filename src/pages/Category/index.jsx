import React, { Fragment, useEffect, useState } from 'react'
import { Form, Input, Card, Button, Table, Pagination, Modal, message } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid'

import AddForm from './AddForm';//引入添加分类的form
import UpdateForm from './UpdateForm';//引入更新分类的form
import { reqCategorys, reqUpdateCategorys,reqAddCategorys } from '../../api'//引入查询一二级分类列表方法
import LinkButton from '../../component/LinkButton'
import './index.css'

let categoryName //更新分类，传递的参数
let categoryId //更新分类，传递的参数
let propsForm //从form,UpdateForm中传递过来的form
export default function Category() {
  // const [form] = Form.useForm()
  //存放一级分类列表查询结果数组
  const [categorys, setCategorys] = useState([])
  //存放二级分类列表查询结果数组
  const [subCategorys, setSubCategorys] = useState([])
  //存放loading,发送ajax请求时，当请求还未返回时显示loading
  const [loading, setLoading] = useState(false)
  //存放parentId,用来表示是一级列表还是二级列表,默认是一级列表
  const [parentId, setParentId] = useState('0')
  //存放二级列表的名称
  const [parentName, setParentName] = useState('')
  //设置title
  const title = parentId === '0' ? '一级分类列表' : (
    <span>
      <LinkButton onClick={showCategorys}>一级分类列表</LinkButton>
      {/* icon：右箭头 */}
      <ArrowRightOutlined style={{ marginRight: "5px" }} />
      {/* 二级标题的名称 */}
      <span>{parentName}</span>
    </span>
  )
  const extra = (
    <Button type='primary' icon={<PlusOutlined />} onClick={()=>setIsModalVisible('1') }>添加</Button>
  )
  // 设置是否显示添加分类和更新分类的对话框，0表示不显示，1表示显示添加，2表示显示更新
  const [isModalVisible, setIsModalVisible] = useState('0')
  //定义数据在table中的显示
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      dataIndex: '',
      // render会将每一行的对象作为参数传递进来
      render: (category) => (
        <div>
          <LinkButton onClick={() => showUpdate(category)}>修改分类</LinkButton>
          {/* 点击显示二级分类列表 */}
          {parentId === '0' ? <LinkButton onClick={() => showSubCategorys(category)}>查看子分类</LinkButton> : null}

        </div>
      ),
      width: '30%',
    },
  ];

  //点击显示二级分类列表函数,更新parentId和parentName
  function showSubCategorys(category) {
    setParentId(category._id)
    setParentName(category.name)
  }

  // 点击一级分类的linkbutton，更新parentId,parentName,subCategorys
  function showCategorys() {
    setParentId('0')
    setParentName('')
    setSubCategorys([])
  }

  //获取一级/二级分类列表显示函数
  async function getCategorys(parentId1) {
    //发送异步请求前显示loading
    setLoading(true)
    // 如果有传递parentId就用传递过来的，没有则使用状态中的
    parentId1=parentId1||parentId
    //返回一个promise对象，处理异步请求
    const result = await reqCategorys(parentId1)
    if (result.status === 0) {
      //异步请求成功后，隐藏loading
      setLoading(false)
      //请求成功,更新state中的categorys
      //TODO：判断是一级列表还是二级列表
      if (parentId === '0') {
        setCategorys(result.data)//一级
      } else {
        setSubCategorys(result.data)//二级
        console.log(result.data)
      }
    } else {
      //请求失败
      console.log('获取分类列表失败')
    }
  }

  //添加分类函数
  function addCategory() {
    // 1.得到从form子组件传递过来的form
    // TODO：表单验证是否通过
    propsForm.validateFields().then(async values => {
      //表单验证通过
      // 2.获取子组件中输入的categoryName,以及parentId
    const categoryName1 = values.categoryName
    const parentId1=values.parentId
    // 3.隐藏添加对话框
    setIsModalVisible('0')
    // 4.调用reqAddCategorys，添加分类
    const result=await reqAddCategorys(parentId1,categoryName1)
    if (result.status === 0) {
      // 添加分类成功
      message.success('添加成功')
      if (parentId1 === parentId) {
        //添加分类就是当前分类表下的分类
        getCategorys()
      } else if (parentId1 === 0) {
        //在二级列表下添加一级分类，重新获取以及分类列表，但不需要显示一级分类列表
        getCategorys('0')
      }
      // 6.将添加分类的文本框置空
      propsForm.setFieldsValue({categoryName:''})
    } else {
      // 添加分类失败
      message.error('添加失败')
    }
    })
      .catch(errorInfo => {
        message.error(errorInfo.errorFields[0].errors)
    })
    
  }

  //显示修改分类按钮函数
  function showUpdate(category) {
    setIsModalVisible('2')
    categoryName = category.name
    categoryId = category._id
  }

  //更新分类函数
  function updateCategory() {
    //TODO：判断表单验证是否通过
    propsForm.validateFields().then(async values => {
      // console.log(values)//{categoryName: '电脑'}

      // 0.将modal对话框隐藏
      setIsModalVisible('0')
      // 1.得到文本框输入的值
      const updateCategoryName =values.categoryName
      // 2.更新分类(需要categoryId，categoryName)
      const result = await reqUpdateCategorys(categoryId, updateCategoryName)
      if (result.status === 0) {
        // 更新界面,调用显示列表函数
        getCategorys()
        message.success('修改成功')
      } else {
        message.error('修改失败')
      }
    })
      .catch(errorInfo => {
        message.error(errorInfo.errorFields[0].errors)
    })
        
  }

  //当parentId以改变就调用函数，代替类似组件中的this.setState()中的回调函数
  //相当于componentdidmount+componentupdatemount
  useEffect(() => {
    //获取二级分类列表显示
    getCategorys()
  }, [parentId])

  //componentdidmount
  useEffect(() => {
    //在页面首次渲染后，获取一级分类列表显示
    getCategorys()
  }, [])

  return (
    <Fragment>
      {/*  渲染卡片 */}
      <Card title={title} extra={extra}>
        <Table
          rowKey='_id'
          // 判断数据选用一级列表数据还是二级列表数据
          dataSource={parentId === '0' ? categorys : subCategorys}
          // 定义显示规则
          columns={columns}
          // 显示表格边框
          bordered
          // 是否显示loading
          loading={loading}
          // 配置分页器
          pagination={{
            // 设置一页显示五条数据
            defaultPageSize: 5,
            // 是否显示直接跳转页面
            showQuickJumper: true
          }}
        />
      </Card>
      {/* 渲染添加分类对话框 */}
      <Modal
        title="添加分类"
        visible={isModalVisible === '1' ? true : false}
        // 调用添加分类函数
        onOk={addCategory}
        //点击取消按钮，调用函数 ,将isModalVisible设置为0
        onCancel={() => setIsModalVisible('0')}
      >
        {/* 添加分类的form */}
        {/* 参数1：一级分类所有categories；参数2：用来表示是一级列表还是二级列表 */}
        <AddForm categorys={categorys} parentId={parentId} setForm={(form)=>{propsForm=form}}/>
      </Modal>
      {/* 渲染更新分类对话框 */}
      <Modal
        title="更新分类"
        visible={isModalVisible === '2' ? true : false}
        // 调用更新分类函数
        onOk={updateCategory}
        onCancel={() => setIsModalVisible('0')}
      >
        {/* 更新分类的form组件 */}
        <UpdateForm categoryName={categoryName} setForm={(form)=>{propsForm=form}}/>
        
      </Modal>
    </Fragment>
  )
}
