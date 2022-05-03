import React from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Navigate, useNavigate } from 'react-router-dom'

import './login.css'
import logo from '../../assets/images/logo.png'
//引入ajax请求函数
import { reqLogin } from '../../api';
import memoryUtils from '../../util/memoryUtils';
import storageUtils from '../../util/storageUtils';


export default function Login() {
  //引入钩子useNavigate,解决编程式路由导航问题
  const navigate = useNavigate()
  const [form] = Form.useForm();

  function onFinish() {
    // 对所有表单字段进行检验
    form.validateFields().then(async (values) => {
      const { username, password } = values
      // 请求成功返回的结果由response变为response.data
      const result = await reqLogin(username, password)
      // console.log('请求成功',result)

      // TODO：判断登录是否成功,通过result中的states属性进行判断
      if (result.status === 0) {
        //将用户信息保存到内存中，
        memoryUtils.user = result.data
        //将user保存到local本地
        storageUtils.saveUser(result.data)

        //登录成功,进行路由跳转，使用编程式路由跳转完成
        message.success('登录成功')
        navigate('/admin/home', { replace: true })
      } else {
        //登录失败
        message.error(result.msg)
      }
    })

  }


  //TODO:判断用户是否已登录，自动跳转到管理界面
  const user = memoryUtils.user
  if (user._id) {
    //用户已登录，跳转页面
    return <Navigate to="/admin/home" />
  }
  return (
    <div className='login'>
      <header className='login-header'>
        <img src={logo} alt="logo" />
        <h1>尚硅谷</h1>
      </header>
      <section className='login-content'>
        <h2>用户登录</h2>
        <Form
          name="normal_login"
          className="login-form"
          // 表单提交，用onFinish代替onSubmit
          onFinish={onFinish}
          form={form}
        // onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            name="username"
            // 声明式表单验证
            rules={[
              { required: true, message: '用户名不能为空!' },
              // { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须由数字,字符,下划线组成!' }
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '密码不能为空!' },
              { min: 4, message: '密码不能小于4位!' },
              { max: 12, message: '密码不能大于12位!' },
              { pattern: /^[a-zA-Z0-9_]+$/, message: '密码必须由数字,字符,下划线组成!' }
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  )
}


// 已弃用
// /*
// 包装form组件，生成一个新的组件Form(Login)
// 新组件会向Form组件传递一个强大的对象属性：form
// */
// const WrapLogin = Form.create()(Login)
// export default WrapLogin
