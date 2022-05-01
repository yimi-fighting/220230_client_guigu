import React, { Fragment, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form';

const { Option } = Select;

export default function AddForm(props) {
    // const { categorys, parentId } = props
    const [form] = Form.useForm()
    //将子组件的form传递给父组件，使得父组件可以取到子组件form中的categorieName的值
    props.setForm(form)
    // // 动态更新parentId的值
    // useEffect(() => {
    //     form.setFieldsValue({ parentId: parentId })
    // }, [parentId])
    return (
        <Fragment>
            {/* initialValues不能被动态更新，需要使用form.setFieldsValues进行动态更新，将其放在useEffect中 */}
            <Form form={form}>
                <Form.Item
                    label="添加角色"
                    name="roleName"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your roleName!'
                        }
                    ]}
                >
                    <Input placeholder="添加角色" />
                </Form.Item>
            </Form>
        </Fragment >
    )
}
