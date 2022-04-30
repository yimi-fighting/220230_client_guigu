import React, { useEffect, useRef, useState } from 'react'
import { Card, Input, Button, Form, InputNumber, Upload, Cascader, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';

import PicturesWall from './PicturesWall'
// import RichTextEditor from './RichTextEditor'
import { reqCategorys, reqUpdateProduct, reqAddProduct } from '../../../api'
import { useLocation, useNavigate } from 'react-router-dom';

const { TextArea } = Input;

let isUpdate //判断点击的是修改按钮还是添加按钮
let product = {} //如果点击的是修改按钮，将参数保存到product中

export default function AddUpdate() {
  // 接收state参数
  const { state } = useLocation()
  // 编程式路由
  const navigate = useNavigate()
  // 定义card的左侧
  const title = (
    <span>
      <ArrowLeftOutlined style={{ color: '#1da57a', margin: '0 10px 0 0', fontSize: '20px' }} onClick={() => navigate(-1)} />
      <span>添加商品</span>
    </span>
  )
  // 将级联选择的数据源保存在state中
  const [options, setOptions] = React.useState([]);

  // 由于添加商品和修改使用的是同一个组件，通过判断是否传递porduct来判断是update还是add
  if (state) {
    // 更新product
    product = state
    // 判断是否是点击修改按钮进入的
    isUpdate = !!product
  } else {
    // 更新product
    product = {}
    // 判断是否是点击修改按钮进入的
    isUpdate = false
  }
  // 点击修改按钮时，判断是一级/二级
  const categoryIds = []
  if (isUpdate) {
    if (product.pCategoryId === '0') {
      categoryIds.push(product.categoryId)
    } else {
      categoryIds.push(product.pCategoryId)
      categoryIds.push(product.categoryId)
    }
  }

  // pictureWall的ref
  const pictureRef = useRef(null)

  // 重新定义options
  const getOptions = async (data) => {
    const options = data.map(c => {
      return (
        {
          value: c._id,
          label: c.name,
          isLeaf: false,
        }
      )
    })

    // TODO：点击的是修改按钮，生成二级分类列表
    const { pCategoryId, categoryId } = product
    if (isUpdate && pCategoryId !== '0') {
      //获取二级列表
      const subCategorys = await getCategorys(pCategoryId)//[{…}, {…}]
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => {
        return ({
          value: c._id,
          label: c.name,
          isLeaf: true
        })
      })
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联对应的一级option
      targetOption.children = childOptions
    }
    // 更新options
    setOptions(options)
  }

  // 获取一级/二级分类列表
  const getCategorys = async (parentId) => {
    // 定义result存放结果
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      // 判断是否为一级分类列表
      if (parentId === '0') {
        // 重新定义options
        getOptions(result.data)
      } else {
        // 返回二级分类列表==》当前async函数返回的promise就会成功且value为category
        return result.data
      }
    }
  }

  // 用于动态加载选项
  const loadData = async selectedOptions => {
    // console.log(selectedOptions)//0: {value: 'zhejiang', label: 'Zhejiang', isLeaf: false, loading: false, children: Array(2)}
    const targetOption = selectedOptions[selectedOptions.length - 1];
    // console.log(targetOption)//value: 'zhejiang', label: 'Zhejiang', isLeaf: false, loading: false, children: Array(2)

    // 设置loading为true,显示加载旋转
    targetOption.loading = true;

    // 发送获取二级分类列表的ajax请求
    const subCategorys = await getCategorys(targetOption.value)
    // ajax请求完成时将loading置为false
    targetOption.loading = false;
    if (subCategorys && subCategorys.length > 0) {
      // 得到二级列表的options
      const childOptions = subCategorys.map(c => {
        return (
          {
            value: c._id,
            label: c.name,
            isLeaf: true
          }
        )
      })
      // 将childoptions关联当前option
      targetOption.children = childOptions
      // 更新options
      setOptions([...options])
    } else {
      // 说明当前一级项并没有二级列表
      targetOption.isLeaf = true
    }
  };

  // 表单验证
  const onFinish = async (values: any) => {
    // 使用ref调用pictureWall子组件的getImages()函数
    const imgs = pictureRef.current.getImages()
    const { name, desc, price, categoryIds, detail} = values
    let products
    let result
    let pCategoryId
    let categoryId
    if (categoryIds.length === 1) {
      pCategoryId = '0'
      categoryId = categoryIds[0]
    } else {
      pCategoryId = categoryIds[0]
      categoryId = categoryIds[1]
    }

    if (isUpdate) {
      products = {
        _id: product._id,
        categoryId: categoryId,
        pCategoryId: pCategoryId,
        name:name,
        desc:desc,
        price:price,
        detail:detail,
        imgs:imgs
      }
      // 发送ajax请求，修改商品
      result = await reqUpdateProduct(products)
      if (result.status === 0) {
        message.success('商品修改成功')
      } else {
        message.error('商品修改失败')
      }
    } else {
      products = {
        categoryId: categoryId,
        pCategoryId: pCategoryId,
        name:name,
        desc:desc,
        price:price,
        detail:detail,
        imgs:imgs
      }
      // 发送ajax请求，添加商品
      result = await reqAddProduct(products)
      if (result.status === 0) {
        message.success('商品添加成功')
      } else {
        message.error('商品添加失败')
      }
    }

  };

  useEffect(() => {
    // 获取一级分类列表
    getCategorys('0')
  }, [])

  return (
    <Card title={title}>
      <Form
        labelCol={{ span: 3 }}//form左侧宽度
        wrapperCol={{ span: 10 }}//form右侧宽度
        onFinish={onFinish}//提交表单且数据验证成功后回调事件
        initialValues={{
          name: product.name,
          desc: product.desc,
          price: product.price,
          categoryIds: categoryIds,
        }}
      >
        {/* 商品名称 */}
        <Form.Item
          label="商品名称"
          name="name"
          rules={[{ required: true, message: 'Please input name!' }]}
        >
          <Input placeholder='请输入商品名称' />
        </Form.Item>
        {/* 商品描述 */}
        <Form.Item
          label="商品描述"
          name="desc"
          rules={[{ required: true, message: 'Please input desc!' }]}
        >
          <TextArea rows={2} />
        </Form.Item>
        {/* 商品价格 */}
        <Form.Item
          label="商品价格"
          name="price"
          rules={[{
            required: true,
            type: 'number',
            min: 1,
            message: 'Please input price >0 !'
          }]}
        >
          <InputNumber addonAfter="元" placeholder='请输入商品价格' />
        </Form.Item>
        {/* 商品分类 */}
        <Form.Item
          label="商品分类"
          name="categoryIds"
          rules={[{ required: true }]}
        >
          {/* 级联选择 */}
          <Cascader
            options={options} //可选择数据源
            loadData={loadData} //用于动态加载选项
            changeOnSelect //点选每集菜单选项值都会发生变化
          />
        </Form.Item>
        {/* 商品图片 */}
        <Form.Item
          label="商品图片"
          name="imgs"
          rules={[{ message: 'Please input name!' }]}
        >
          {/* 需要调用子组件函数getImages()函数 */}
          <PicturesWall ref={pictureRef} imgs={product.imgs} />
        </Form.Item>
        {/* 商品详情 */}
        <Form.Item
          label="商品详情"
          name="detail"
          rules={[{ message: 'Please input name!' }]}
        >
          {/* 引入富文本编辑器的组件 */}
          {/* <RichTextEditor /> */}
          <span>详情</span>
        </Form.Item>
        {/* button */}
        <Form.Item wrapperCol={{ offset: 6 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>

    </Card>
  )
}

/*
1.子组件调用父组件的方法：
        将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用

2.父组件调用子组件的方法：
        在父组件中通过ref得到子组件标签对象（也就是组件对象），调用其方法
*/
