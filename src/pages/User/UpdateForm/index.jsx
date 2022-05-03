import React from 'react'
import { Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'

const { Option } = Select;
export default function UserForm(props) {

    const { roles ,user } = props
    const [form] = useForm()
    //将子组件的form传递给父组件，使得父组件可以取到子组件form中的categorieName的值
    props.setForm(form)
    return (
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            form={form}
            initialValues={{
                username: user.username,
                phone: user.phone,
                email: user.email,
                role_id:user.role_id
            }}
        >
            <Form.Item
                label="用户名"
                name='username'
                rules={[{ required: true, message: '请输入用户名' }]}
            >
                <Input placeholder='请输入用户名' disabled></Input>
            </Form.Item>
            <Form.Item
                label="手机号"
                name='phone'
                rules={[{ len: 11, message: '请输入手机号' }]}
            >
                <Input placeholder='请输入11位手机号'></Input>
            </Form.Item>
            <Form.Item
                label="邮箱"
                name='email'
                rules={[{ type: 'email', message: '请输入邮箱' }]}
            >
                <Input placeholder='请输入邮箱'></Input>
            </Form.Item>
            <Form.Item
                label='角色'
                name='role_id'
            >
                <Select>
                    {
                        roles.map(r => <Option key={r._id} value={r._id}>{r.name}</Option>)
                   }
                </Select>
            </Form.Item>
        </Form>
    )
}
