import React, { useState } from 'react';
import {
    DollarOutlined,
    FileOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    WindowsOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { FaUserGroup, FaBook } from "react-icons/fa6";
import { Link, Outlet } from 'react-router-dom';
const { Header, Content, Sider } = Layout;


const getItem = (label, key, icon, children) => {
    return {
        key,
        icon,
        children,
        label,
    };
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
const LayoutAdmin = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <>
            <Layout style={{
                minHeight: '100vh',
            }}>
                <Sider trigger={null} collapsible isOpen={isOpen}>
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