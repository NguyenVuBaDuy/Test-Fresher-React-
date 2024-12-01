import { DownOutlined, HomeOutlined, SearchOutlined, SmileOutlined } from '@ant-design/icons';
import './header.scss'
import { Avatar, Badge, Divider, Drawer, Dropdown, Input, message, Popover, Space } from 'antd'
import { FiShoppingCart } from 'react-icons/fi';
import { FaReact } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logOutAPI } from '../../services/api.service';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { BsCart } from "react-icons/bs";
import AccountManagement from '../User/account.management';

const Header = (props) => {

    const { search, setSearch } = props

    const [openDrawer, setOpenDrawer] = useState(false)

    const isAuthenticated = useSelector(state => state.account.isAuthenticated)
    const [isModalChangeInfoOpen, setIsModalChangeInfoOpen] = useState(false)
    const user = useSelector(state => state.account.user)
    const carts = useSelector(state => state.order.carts)

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
        ...(user.role === 'ADMIN' ? [{
            label: <div onClick={() => { navigate('/admin') }} style={{ width: "100%" }}>
                <label style={{ cursor: "pointer" }}>Admin Dashboard</label></div>,
            key: 'admin',
        }] : []),
        {
            label: <div onClick={() => { setIsModalChangeInfoOpen(true) }} style={{ width: "100%" }}>
                <label style={{ cursor: "pointer" }}>Account management</label></div>,
            key: 'account',
        },
        {
            label: <div onClick={() => { navigate('/history') }} style={{ width: "100%" }}>
                <label style={{ cursor: "pointer" }}>Order history</label></div>,
            key: 'history',
        },
        {
            label: <div onClick={() => { handleLogOut() }} style={{ width: "100%" }}>
                <label style={{ cursor: "pointer" }}>Log out</label></div>,
            key: 'logout',
        },
    ];


    const content = (
        carts.length > 0 ?
            <div className="pop-cart">
                <div className="content-cart">
                    {carts?.map((item, index) => {
                        if (index >= 5) return
                        return (
                            <div className="book">
                                <img src={`${import.meta.env.VITE_URL_BACKEND}/images/book/${item?.detail?.thumbnail}`} />
                                <div className='mainText'>{item?.detail?.mainText}</div>
                                <div className="price">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item?.detail?.price)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="footer-cart">
                    <div style={{ color: '#757575' }}>{carts.length <= 5 ? '' : `${carts.length - 5} other product${carts.length != 6 ? 's' : ''}`}</div>
                    <button className="button-cart" onClick={() => { navigate('/order') }}>View cart</button>
                </div>
            </div>
            :
            <div style={{ padding: "35px 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <BsCart style={{ fontSize: "48px", color: "red", marginBottom: "10px" }} />
                <div style={{ color: '#757575' }}>There are no products yet</div>
            </div>
    )

    const handleOnChange = (value) => {
        setSearch(value)
    }
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
                                onChange={(event) => handleOnChange(event.target.value)}
                                value={search}
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item mobile hover">
                                <Space onClick={() => { navigate('/') }}>
                                    <HomeOutlined /> Home
                                </Space>
                            </li>
                            <li className="navigation__item mobile hover">
                                {!isAuthenticated ?
                                    <span onClick={() => { navigate('/login') }}> <SmileOutlined />  Account</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['hover']} placement="bottomRight">
                                        <a onClick={(e) => e.preventDefault()}>
                                            <Space>
                                                <Avatar size={35} src={`${import.meta.env.VITE_URL_BACKEND}/images/avatar/${user.avatar}`} />{user.fullName}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                }
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>

                            <li className="navigation__item">
                                <Popover
                                    placement={'bottomRight'}
                                    content={content}
                                    title={carts.length > 0 ? "New products added" : ''}
                                    rootClassName="popover-carts"
                                    className='popover-carts'
                                >
                                    <Badge
                                        count={carts.length}
                                        size={"small"}
                                        showZero
                                    >
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>
                                </Popover>

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
            <AccountManagement
                setIsModalChangeInfoOpen={setIsModalChangeInfoOpen}
                isModalChangeInfoOpen={isModalChangeInfoOpen}
            />
        </>
    )
}

export default Header
