import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination } from 'antd';
import './home.scss'
import { useEffect, useState } from 'react';
import { fetchBookWithPaginationAPI, fetchListCategoryBook } from '../../services/api.service';

const ItemBook = () => {
    return (
        <div className="column">
            <div className='wrapper'>
                <div className='thumbnail'>
                    <img src="http://localhost:8080/images/book/3-931186dd6dcd231da1032c8220332fea.jpg" alt="thumbnail book" />
                </div>
                <div className='text'>Tư Duy Về Tiền Bạc - Những Lựa Chọn Tài Chính Đúng Đắn Và Sáng Suốt Hơn</div>
                <div className='price'>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(70000)}
                </div>
                <div className='rating'>
                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                    <span>Sold 1k</span>
                </div>
            </div>
        </div>
    )
}

const HomePage = () => {

    const [form] = Form.useForm();

    const [category, setCategory] = useState([])

    const [dataBooks, setDataBooks] = useState([])

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(null)

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await fetchListCategoryBook();
            if (res.data) {
                setCategory(res.data)
            }
        }
        fetchCategory()
    }, [])

    useEffect(() => {
        loadBook()
    }, [current, pageSize])

    const loadBook = async () => {
        const res = await fetchBookWithPaginationAPI(current, pageSize)
        if (res.data) {
            setDataBooks(res.data.result)
            setCurrent(+res.data.meta.current)
            setPageSize(+res.data.meta.pageSize)
            setTotal(+res.data.meta.total)
        }
    }

    const items = [
        {
            key: '1',
            label: `Popular`,
            children: <></>,
        },
        {
            key: '2',
            label: `New`,
            children: <></>,
        },
        {
            key: '3',
            label: `Low to high`,
            children: <></>,
        },
        {
            key: '4',
            label: `High to low`,
            children: <></>,
        },
    ];

    const handleOnChange = (pagination) => {
        if (pagination) {
            if (current != +pagination.current) {
                setCurrent(+pagination.current)
            }

            if (pageSize != +pagination.pageSize) {
                setPageSize(+pagination.pageSize)
            }
        }
    }

    const handleFilterChange = (values) => {
        console.log(values)
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0}>
                        <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <span> <FilterTwoTone />
                                    <span style={{ fontWeight: 500 }}> Bộ lọc tìm kiếm</span>
                                </span>
                                <ReloadOutlined
                                    title="Reset"
                                    onClick={() => { form.resetFields() }}
                                />
                            </div>
                            <Divider />
                            <Form
                                onFinish={(values) => { }}
                                form={form}
                                onValuesChange={(_, values) => { handleFilterChange(values) }}
                            >
                                <Form.Item
                                    name="category"
                                    label="Category"
                                    labelCol={{ span: 24 }}
                                >
                                    <Checkbox.Group>
                                        <Row>

                                            {category?.map(item => {
                                                return (
                                                    <Col span={24} style={{ padding: '7px 0' }}>
                                                        <Checkbox value={item} >
                                                            {item}
                                                        </Checkbox>
                                                    </Col>
                                                )
                                            })}
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider />
                                <Form.Item
                                    label="Price"
                                    labelCol={{ span: 24 }}
                                >
                                    <Row gutter={[10, 10]} style={{ width: "100%" }}>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={["range", 'from']}>
                                                <InputNumber
                                                    name='from'
                                                    min={0}
                                                    placeholder="FROM"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col xl={2} md={0}>
                                            <div > - </div>
                                        </Col>
                                        <Col xl={11} md={24}>
                                            <Form.Item name={["range", 'to']}>
                                                <InputNumber
                                                    name='to'
                                                    min={0}
                                                    placeholder="TO"
                                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    style={{ width: '100%' }}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <div>
                                        <Button onClick={() => form.submit()}
                                            style={{ width: "100%" }} type='primary'>Apply</Button>
                                    </div>
                                </Form.Item>
                                <Divider />
                                <Form.Item
                                    label="Rating"
                                    labelCol={{ span: 24 }}
                                >
                                    <div>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                        <span className="ant-rate-text"></span>
                                    </div>
                                    <div>
                                        <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    </div>
                                    <div>
                                        <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    </div>
                                    <div>
                                        <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    </div>
                                    <div>
                                        <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    <Col md={20} xs={24} >
                        <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                            <Row>
                                <Tabs defaultActiveKey="1" items={items} onChange={() => { }} />
                            </Row>
                            <Row className='customize-row'>
                                {dataBooks?.map(item => {
                                    return (
                                        <div className="column">
                                            <div className='wrapper'>
                                                <div className='thumbnail'>
                                                    <img src={`${import.meta.env.VITE_URL_BACKEND}/images/book/${item.thumbnail}`} alt="thumbnail book" />
                                                </div>
                                                <div className='text'>{item.mainText}</div>
                                                <div className='price'>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                </div>
                                                <div className='rating'>
                                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                    <span>Sold {item.sold}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}

                            </Row>
                            <div style={{ marginTop: 30 }}></div>
                            <Row style={{ display: "flex", justifyContent: "center" }}>
                                <Pagination
                                    current={current}
                                    pageSize={pageSize}
                                    total={total}
                                    responsive
                                    onChange={(p, s) => { handleOnChange({ current: p, pageSize: s }) }}
                                />
                            </Row>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default HomePage;
