import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin } from 'antd';
import './home.scss'
import { useEffect, useState } from 'react';
import { fetchBookWithPaginationAPI, fetchListCategoryBook } from '../../services/api.service';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false)

    const [category, setCategory] = useState([])

    const [dataBooks, setDataBooks] = useState([])

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(null)

    const [filterQuery, setFilterQuery] = useState(null)
    const [sortQuery, setSortQuery] = useState('&sort=-sold')

    const navigate = useNavigate()

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
            if (values?.category?.length) {
                const cate = values?.category?.join(',')
                filter += `&category=${cate}`
            }
            setFilterQuery(filter)
        }
    }

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const handleRedirectBook = (book) => {
        const slug = convertSlug(book.mainText);
        navigate(`/book/${slug}?id=${book._id}`)
    }


    return (
        <div style={{ background: '#efefef', padding: "20px 0", height: "100%" }}>
            <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row gutter={[20, 20]}>
                    <Col md={4} sm={0} xs={0}>
                        <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <span> <FilterTwoTone />
                                    <span style={{ fontWeight: 500 }}> Search filter</span>
                                </span>
                                <ReloadOutlined
                                    title="Reset"
                                    onClick={() => {
                                        form.resetFields()
                                        setFilterQuery('')
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
                                            <div className="column" key={item._id}
                                                onClick={() => { handleRedirectBook(item) }}>
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
