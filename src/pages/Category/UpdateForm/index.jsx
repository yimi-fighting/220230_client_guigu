import React, { useEffect } from 'react'
import { Form, Input, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form';

export default function UpdateForm(props) {
    const [form] = Form.useForm()
    const { categoryName } = props
    //将子组件的form传递给父组件，使得父组件可以取到子组件form,并form.setFieldsValue({ categoryName })
    props.setForm(form)
    // console.log(form.getFieldValue('categoryName'))
    useEffect(() => {
        form.setFieldsValue({ categoryName: categoryName })
    }, [categoryName])

    return (
        <Form form={form}>
            {/* form.item 的name为categoryname，当点击“修改分类”按钮时，
          调用form.setFieldsValue({ categoryName: categoryName })，同步修改文本框中的内容 */}
            <Form.Item
                name='categoryName'
                rules={[
                    {
                        required: true,
                        message: 'Please select categoryName!',
                    }
                ]}
            >
                <Input placeholder="更新分类"></Input>
            </Form.Item>
        </Form >
    )
}
