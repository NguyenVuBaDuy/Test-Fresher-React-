import React, { useEffect, useState } from 'react';
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
import { Avatar, Button, Dropdown, Layout, Menu, message, Space, theme } from 'antd';
import { FaUserGroup, FaBook } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOutAPI } from '../../../services/api.service';
import { doLogoutAction } from '../../../redux/account/accountSlice';
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

    const [selectedKey, setSelectedKey] = useState('dashboard')

    const handleLogOut = async () => {
        const res = await logOutAPI()
        if (res.data) {
            message.success('Logout Successfully')
            dispatch(doLogoutAction())
            navigate('/')
        }
    }

    useEffect(() => {
        const key = window.location.pathname.split('/').at(-1)
        setSelectedKey(key)
    }, [])

    const items = [
        getItem(<Link to={'/admin'}>Dashboard</Link>, 'admin', <WindowsOutlined />),
        getItem('Manage Users', 'manageUsers', <UserOutlined />, [
            getItem(<Link to={'/admin/user'}>CRUD</Link>, 'user', <FaUserGroup />),
        ]),
        getItem(<Link to={'/admin/book'}>Manage Book</Link>, 'book', <FaBook />),
        getItem(<Link to={'/admin/order'}>Manage Order</Link>, 'order', <DollarOutlined />)

    ];

    const itemsAccount = [
        getItem(<div style={{ width: "100%" }}>
            <label style={{ cursor: "pointer" }}>Account management</label>
        </div>, "manage"),

        getItem(<div style={{ width: "100%" }} onClick={() => { navigate('/') }}>
            <label style={{ cursor: "pointer" }}>Home page</label>
        </div>, "homePage"),

        getItem(<div
            onClick={() => { handleLogOut() }}
            style={{ width: "100%" }}>
            <label style={{ cursor: "pointer" }}>Log out</label>
        </div>, "logout"),
    ]

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();



    const handleSelect = (event) => {
        setSelectedKey(event.key)
    }
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
                        onSelect={(event) => { handleSelect(event) }}
                        selectedKeys={selectedKey}
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
                                    <Avatar size='large' src={`${import.meta.env.VITE_URL_BACKEND}/images/avatar/${user.avatar}`} />{user.fullName}
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
                            borderRadius: borderRadiusLG,
                            backgroundColor: "#F5F5F5"
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