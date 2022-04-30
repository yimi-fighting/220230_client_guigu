import React, { useEffect, useState } from 'react'
import { Card, List } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

import { BASE_IMG_URL } from '../../../util/constants';
import { reqCategory } from '../../../api';
import './index.css'


const Item = List.Item
export default function Detail() {
  // 编程式路由导航
  const navigate = useNavigate()
  // 接收state参数，使用uselocation
  const { state } = useLocation()
  // 存放一级分类的名称
  const [cName1, setCName1] = useState('')
  // 存放二级分类的名称
  const [cName2, setCName2] = useState('')
  // 设置card的左侧
  const title = (
    <span>
      <ArrowLeftOutlined className='title-detail-icon' onClick={() => { navigate(-1) }} />
      <span>商品详情</span>
    </span>
  )

  // 获取商品分类函数
  async function getSort() {
    if (state.pCategoryId === '0') {//一级分类
      const result = await reqCategory(state.categoryId)
      setCName1(result.data.name)
    } else {//二级分类
      const results = await Promise.all([reqCategory(state.pCategoryId), reqCategory(state.categoryId)])
      setCName1(results[0].data.name)
      setCName2(results[1].data.name)
    }
  }

  useEffect(() => {
    getSort()
  },[])

  return (
    <Card title={title}>
      <List
        // 是否展示分割线
        split
      >
        <Item>
          <span className='left'>商品名称：</span>
          <span>{state.name}</span>
        </Item>
        <Item>
          <span className='left'>商品描述：</span>
          <span>{state.desc}</span>
        </Item>
        <Item>
          <span className='left'>商品价格：</span>
          <span>{state.price}元</span>
        </Item>
        <Item>
          <span className='left'>所属分类：</span>
          <span>{cName1}{cName2 ? '-->' + cName2 : ''}</span>
        </Item>
        <Item>
          <span className='left'>商品图片：</span>
          {
            state.imgs.map(img => {
              if (img !== '') {
                return(
                  <img
                    key={img}
                    className='detail-img'
                    src={BASE_IMG_URL+img}
                    alt="img"
                  />)  
              }      
            })
          }
        </Item>
        <Item>
          <span className='left'>商品详情：</span>
          <span dangerouslySetInnerHTML={{ __html: state.detail }}></span>
        </Item>
      </List>
    </Card>
  )
}
