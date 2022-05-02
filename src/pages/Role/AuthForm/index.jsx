import React, { Fragment, useEffect, useState } from 'react'
import { Tree, Input } from 'antd';
import menuList from '../../../config/menuConfig';

const AuthForm = (props) => {

    // menus存放在state中
    const [menus, setMenus] = useState([])
    //点击复选框触发
    const onCheck = (checkedKeys, e) => {
        // console.log('checkedKeys', checkedKeys)
        setMenus(checkedKeys)
    }
    // 将menus传递给父组件
    props.setmenus(menus)
    
    useEffect(() => {
        setMenus(props.role.menus)
    },[props.role._id])
    return (
        <Fragment>
            <Input placeholder={props.role.name}></Input>
            <br />
            <br />
            <Tree
                checkable//节点前添加 Checkbox 复选框
                onCheck={onCheck}//点击复选框触发
                defaultExpandAll//默认展开所有树节点
                treeData={menuList}
                checkedKeys={menus}
            />
        </Fragment>
    );
};

export default AuthForm;