import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin } from 'antd';
import './home.scss'
import { useEffect, useState } from 'react';
import { fetchBookWithPaginationAPI, fetchListCategoryBook } from '../../services/api.service';


const HomePage = () => {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false)

    const [category, setCategory] = useState([])

    const [dataBooks, setDataBooks] = useState([])

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(null)

    const [filterQuery, setFilterQuery] = useState(null)
    const [sortQuery, setSortQuery] = useState('&sort=-sold')

    const [priceFrom, setPriceFrom] = useState(0)
    const [priceTo, setPriceTo] = useState(null)

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
    }, [current, pageSize, filterQuery, sortQuery])

    const loadBook = async () => {
        setLoading(true)
        const res = await fetchBookWithPaginationAPI(current, pageSize, filterQuery, sortQuery)
        if (res.data) {
            setDataBooks(res.data.result)
            setCurrent(+res.data.meta.current)
            setPageSize(+res.data.meta.pageSize)
            setTotal(+res.data.meta.total)
        }
        setLoading(false)
    }

    const items = [
        {
            key: '-sold',
            label: `Popular`,
            children: <></>,
        },
        {
            key: '-updatedAt',
            label: `New`,
            children: <></>,
        },
        {
            key: 'price',
            label: `Low to high`,
            children: <></>,
        },
        {
            key: '-price',
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

    const handleFilterChange = (changedValues, { category, range }) => {
        if (changedValues.category) {
            let filter = ''
            if (category && category.length) {
                filter += `&category=` + category.join(',')
            }

            if (range?.from >= 0) {
                filter += `&price>=${range.from}`
            }
            if (range?.to >= 0) {
                filter += `&price<=${range.to}`
            }

            setFilterQuery(filter)

        }
    }

    const handleSortChange = (values) => {
        if (values) {
            setSortQuery(`&sort=${values}`)
        }
    }

    const handleFinish = (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let filter = `&price>=${values?.range?.from}&price<=${values?.range?.to}`
            setPriceFrom(values?.range?.from)
            setPriceTo(values?.range?.to)
            if (values?.category?.length) {
                const cate = values?.category?.join(',')
                filter += `&category=${cate}`
            }
            setFilterQuery(filter)
        }
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
                                    onClick={() => {
                                        form.resetFields()
                                        setFilterQuery('')
                                        setPriceFrom(0)
                                        setPriceTo(null)
                                    }}
                                />
                            </div>
                            <Divider />
                            <Form
                                onFinish={(values) => { handleFinish(values) }}
                                form={form}
                                onValuesChange={(changedValues, values) => { handleFilterChange(changedValues, values) }}
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
                        <Spin spinning={loading} tip='Loading...'>
                            <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                                <Row>
                                    <Tabs defaultActiveKey="-sold"
                                        items={items}
                                        onChange={(values) => { handleSortChange(values) }} />
                                </Row>
                                <Row className='customize-row'>
                                    {dataBooks?.map(item => {
                                        return (
                                            <div className="column" key={item._id} >
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
                        </Spin>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default HomePage;
