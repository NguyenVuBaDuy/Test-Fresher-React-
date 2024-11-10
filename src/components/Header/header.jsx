import { DownOutlined, HomeOutlined, SearchOutlined, SmileOutlined } from '@ant-design/icons';
import './header.scss'
import { Badge, Divider, Drawer, Dropdown, Input, Space } from 'antd'
import { FiShoppingCart } from 'react-icons/fi';
import { FaReact } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';


const Header = () => {

    const [openDrawer, setOpenDrawer] = useState(false);
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const navigate = useNavigate();


    const items = [
        {
            label: <label>Account information</label>,
            key: 'account',
        },
        {
            label: <label >Log out</label>,
            key: 'logout',
        },

    ];

    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => { setOpenDrawer(true) }}>☰</div>
                        <div className='page-header__logo'>
                            <span className='logo'>
                                <FaReact className='rotate icon-react' />
                                <SearchOutlined className='icon-search' />
                            </span>
                            <input
                                className="input-search" type={'text'}
                                placeholder="What are you looking for today?"
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item mobile hover">
                                <Space >
                                    <HomeOutlined /> Home
                                </Space>
                            </li>
                            <li className="navigation__item mobile hover">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> <SmileOutlined />  Account</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['hover']} placement="bottomRight">
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <SmileOutlined />{user.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                }
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>

                            <li className="navigation__item">
                                <Badge
                                    count={5}
                                    size={"small"}
                                >
                                    <FiShoppingCart className='icon-cart' />
                                </Badge>
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title={user.fullName}
                placement="left"
                onClose={() => { setOpenDrawer(false) }}
                open={openDrawer}
            >
                <p>Account management</p>
                <Divider />

                <p>Logout</p>
                <Divider />
            </Drawer>
        </>
    )
}

export default Header