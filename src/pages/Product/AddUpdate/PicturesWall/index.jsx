import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { reqDeleteImg } from '../../../../api'
import { BASE_IMG_URL } from '../../../../util/constants'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class App extends React.Component {
    state = {
        previewVisible: false, // 标识是否显示大图预览modal
        previewImage: '', //大图的url
        previewTitle: '',
        fileList: [],
    };

    // 构造函数，点击修改按钮时，根据传递过来的imgs初始化state中的fileList
    constructor(props) {
        super(props)
        let fileList = []
        // 如果传入了imgs属性
        const { imgs } = props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => {
                return {
                    uid: -index,
                    name: img,
                    status: 'done',
                    url: BASE_IMG_URL + img
                }

            })
        }
        this.state={
            previewVisible: false, // 标识是否显示大图预览modal
            previewImage: '', //大图的url
            previewTitle: '',
            fileList:fileList
        }
    }

    // 得到添加请求的imgs
    getImages = () => {
        const imgs = this.state.fileList.map(file => file.name)
        return imgs
    }

    // 取消图片回调
    handleCancel = () => this.setState({ previewVisible: false });

    // 点击文件链接或预览图标时的回调
    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    // 上传文件改变时的状态
    // file:是当前操作的file
    // file List：是全部的file
    handleChange = async ({ file, fileList }) => {
        // 得到请求成功返回的结果
        if (file.status === 'done') {
            const result = file.response
            // 修改fileList中的最后一个元素
            /**
             * {
                uid: '-1', //每个file都有自己唯一的id，自定义一般为负数
                name: 'image.png', //图片的文件名
                status: 'done',// done,uploading,error
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', //图片地址
            }
             */
            if (result.status === 0) {
                message.success('上传图片成功')
                file = fileList[fileList.length - 1]
                file.name = result.data.name
                file.url = result.data.url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') {
            //删除图片，调用ajax请求，删除图片
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('图片删除成功')
            } else {
                message.error('图片删除失败')
            }
        }
        this.setState({ fileList })
    };

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div>Upload</div>
            </div>
        );
        return (
            <>
                <Upload
                    accept='image/*' //接受上传的文件类型
                    action="/api1/manage/img/upload" //上传图片的接口地址
                    name='image' //请求参数名字
                    listType="picture-card" //样式，text，picture，picture-card
                    fileList={fileList} //所有已上传图片文件对象的数组
                    onPreview={this.handlePreview} //点击文件链接或预览图标时的回调
                    onChange={this.handleChange} //上传文件改变时的状态
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </>
        );
    }
}

export default App;