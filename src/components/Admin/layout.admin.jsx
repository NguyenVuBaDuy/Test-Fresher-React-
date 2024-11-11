import React, { useState } from 'react';
import {
    DollarOutlined,
    DownOutlined,
    FileOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SmileOutlined,
    UserOutlined,
    WindowsOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, message, Space, theme } from 'antd';
import { FaUserGroup, FaBook } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOutAPI } from '../../services/api.service';
import { doLogoutAction } from '../../redux/account/accountSlice';
const { Header, Content, Sider } = Layout;


const getItem = (label, key, icon, children) => {
    return {
        key,
        icon,
        children,
        label,
    };
}

const LayoutAdmin = () => {

    const [isOpen, setIsOpen] = useState(false);

    const user = useSelector(state => state.account.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        const res = await logOutAPI()
        if (res.data) {
            message.success('Logout Successfully')
            dispatch(doLogoutAction())
            navigate('/')
        }
    }

    const items = [
        getItem(<Link to={'/admin'}>Dashboard</Link>, 1, <WindowsOutlined />),
        getItem('Manage Users', 2, <UserOutlined />, [
            getItem(<Link to={'/admin/user'}>CRUD</Link>, 3, <FaUserGroup />),
            getItem("File", 4, <FileOutlined />)
        ]),
        getItem(<Link to={'/admin/book'}>Manage Book</Link>, 5, <FaBook />),
        getItem(<Link to={'/admin/order'}>Order</Link>, 6, <DollarOutlined />)

    ];

    const itemsAccount = [
        getItem(<div onClick={() => { handleLogOut() }} style={{ width: "100%" }}>
            <label style={{ cursor: "pointer" }}>Log out</label></div>, "logout"),
    ]

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <>
            <Layout style={{
                minHeight: '100vh',
            }}>
                <Sider trigger={null} collapsible collapsed={isOpen}>
                    <div className="demo-logo-vertical" style={{
                        color: "#61dafb",
                        margin: "15px 0",
                        textAlign: "center",
                        fontSize: !isOpen ? "32px" : "15px"
                    }}>
                        ADMIN
                    </div>
                    <Menu
                        theme="dark"
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        items={items}
                    />
                </Sider >
                <Layout>
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                            display: "flex",
                            justifyContent: "space-between"

                        }}
                    >
                        <Button
                            type="text"
                            icon={isOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setIsOpen(!isOpen)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Dropdown menu={{ items: itemsAccount }} trigger={['hover']} placement="bottomRight">
                            <a onClick={(e) => e.preventDefault()}>
                                <Space style={{ marginRight: "15px" }}>
                                    <SmileOutlined />Welcome {user.fullName}
                                    <DownOutlined />
                                </Space>
                            </a>
                        </Dropdown>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout >
        </>
    )
}

export default LayoutAdmin