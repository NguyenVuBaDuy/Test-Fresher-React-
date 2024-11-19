import { DeleteOutlined, EditOutlined, ExportOutlined, ReloadOutlined, UserAddOutlined } from "@ant-design/icons"
import { Button, Col, Popconfirm, Row, Table } from "antd"
import { useEffect, useState } from "react";
import InputFilterBook from "../../../pages/book/input.filter.book";
import { fetchBookWithPaginationAPI } from "../../../services/api.service";
import moment from "moment";

const BookTable = () => {

    const [dataBooks, setDataBooks] = useState([])

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState()

    const [query, setQuery] = useState('')
    const [sortQuery, setSortQuery] = useState('')

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: 'id',
        },
        {
            title: 'Book title',
            dataIndex: 'mainText',
            key: 'mainText',
            sorter: true,
            sortOrder: sortQuery?.includes('mainText') ? (sortQuery.includes('-') ? 'descend' : 'ascend') : null,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: true,
            sortOrder: sortQuery?.includes('category') ? (sortQuery.includes('-') ? 'descend' : 'ascend') : null,
        },
        {
            title: 'Author',
            key: 'author',
            dataIndex: 'author',
            sorter: true,
            sortOrder: sortQuery?.includes('author') ? (sortQuery.includes('-') ? 'descend' : 'ascend') : null,
        },
        {
            title: 'Price',
            key: 'price',
            dataIndex: 'price',
            sorter: true,
            sortOrder: sortQuery?.includes('price') ? (sortQuery.includes('-') ? 'descend' : 'ascend') : null,
            render: (_, record) => {
                return <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price)}</>
            }
        },
        {
            title: 'Last updated',
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            sorter: true,
            sortOrder: sortQuery?.includes('updatedAt') ? (sortQuery.includes('-') ? 'descend' : 'ascend') : null,
            render: (_, record) => {
                return <div>{moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</div>
            }
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div style={{
                    display: "flex",
                    gap: "15px"
                }}>
                    <EditOutlined
                        style={{ cursor: "pointer", color: "orange" }}
                        onClick={() => {

                        }} />

                    <Popconfirm
                        title="Delete the user"
                        description="Are you sure to delete this user?"
                        onConfirm={() => { }}
                        onCancel={() => { }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
                    </Popconfirm>
                </div>
            )
        },
    ];

    useEffect(() => {
        loadBook()
    }, [current, pageSize, query, sortQuery])

    const loadBook = async () => {
        const res = await fetchBookWithPaginationAPI(current, pageSize, query, sortQuery)
        if (res.data) {
            setDataBooks(res.data.result)
            setCurrent(+res.data.meta.current)
            setPageSize(+res.data.meta.pageSize)
            setTotal(+res.data.meta.total)
        }
    }

    const handleOnchange = (pagination, filters, sorter) => {
        if (pagination) {
            if (pagination.current) {
                if (+current != +pagination.current) {
                    setCurrent(+pagination.current)
                }
            }

            if (pagination.pageSize) {
                if (+pageSize != +pagination.pageSize) {
                    setPageSize(+pagination.pageSize)
                }
            }

            let sort = ''

            if (sorter.order === 'ascend') {
                sort = `&sort=${sorter.field}`
            } else if (sorter.order === 'descend') {
                sort = `&sort=-${sorter.field}`
            }
            setSortQuery(sort)
        }

    }

    const renderHeaderTable = () => {

        return (
            <div style={{
                display: "flex",
                justifyContent: "space-between",

            }} >
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>List Users</div>
                <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                    <Button type='primary'
                        onClick={() => { handleExport() }}><ExportOutlined /> Export</Button>

                    <Button type='primary'
                        onClick={() => { setIsCreateUserModal(true) }}
                    ><UserAddOutlined /> Add new</Button>
                    <ReloadOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setSortQuery('')
                            setQuery('')
                            setCurrent(1)
                            setPageSize(5)
                        }}
                    />
                </div>
            </div >
        )
    }


    return (
        <>
            <Row>
                <Col span={24}>
                    <InputFilterBook
                        setQuery={setQuery}
                        setCurrent={setCurrent}
                        setPageSize={setPageSize}
                        setSortQuery={setSortQuery}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        title={renderHeaderTable}
                        columns={columns}
                        bordered
                        dataSource={dataBooks}
                        rowKey={'_id'}
                        pagination={{
                            current: current,
                            pageSize: pageSize,
                            total: total,
                            showSizeChanger: true,
                            pageSizeOptions: ['5', '10', '20', '50'],
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} out of {total}</div>) }
                        }}
                        onChange={handleOnchange}
                    />
                </Col>
            </Row>
        </>
    )
}

export default BookTable