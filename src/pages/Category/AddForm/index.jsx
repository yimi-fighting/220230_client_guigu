import React, { Fragment, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form';

const { Option } = Select;

export default function AddForm(props) {
    const { categorys, parentId } = props
    const [form] = Form.useForm()
    //将子组件的form传递给父组件，使得父组件可以取到子组件form中的categorieName的值
    props.setForm(form)
    // 动态更新parentId的值
    useEffect(() => {
        form.setFieldsValue({ parentId: parentId })
    }, [parentId])
    return (
        <Fragment>
            {/* initialValues不能被动态更新，需要使用form.setFieldsValues进行动态更新，将其放在useEffect中 */}
            <Form form={form}>
                <span>所属分类</span>
                <Form.Item
                    name="parentId"
                    rules={[
                        {
                            required: true,
                            message: 'Please select category!',
                        },
                    ]}
                >
                    {/* 表单中不能使用默认属性defaultValue，在form中使用initialValues{{}}代替 */}
                    <Select >
                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                        }
                    </Select>
                </Form.Item>
                <span>分类名称</span>
                <Form.Item
                    name="categoryName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your categoryName!'
                        }
                    ]}
                >
                    <Input placeholder="添加分类" />
                </Form.Item>
            </Form>
        </Fragment >
    )
}
