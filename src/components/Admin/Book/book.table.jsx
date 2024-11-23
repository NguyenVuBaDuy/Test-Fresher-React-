import { DeleteOutlined, EditOutlined, ExportOutlined, ReloadOutlined, UserAddOutlined } from "@ant-design/icons"
import { Button, Col, message, notification, Popconfirm, Row, Table } from "antd"
import { useEffect, useState } from "react"
import InputFilterBook from "./input.filter.book"
import { deleteBookAPI, fetchBookWithPaginationAPI } from "../../../services/api.service"
import moment from "moment"
import ViewBookDetail from "./view.book.detail"
import CreateBook from "./create.book"
import UpdateBook from "./update.book"
import * as XLSX from 'xlsx'

const BookTable = () => {

    const [dataBooks, setDataBooks] = useState([])

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState()

    const [query, setQuery] = useState('')
    const [sortQuery, setSortQuery] = useState('&sort=-updatedAt')

    const [isViewBookDetail, setIsViewBookDetail] = useState('')
    const [dataViewBookDetail, setDataViewBookDetail] = useState('')

    const [isModalCreateBookOpen, setIsModalCreateBookOpen] = useState(false)

    const [isModalUpdateBookOpen, setIsModalUpdateBookOpen] = useState(false)
    const [dataUpdateBook, setDataUpdateBook] = useState(null)

    useEffect(() => {
        loadBook()
    }, [current, pageSize, query, sortQuery])

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            key: 'id',
            render: (_, record) => (
                <a href="#"
                    onClick={() => {
                        setIsViewBookDetail(true)
                        setDataViewBookDetail(record)
                    }}>{record._id}</a>
            )
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
                            setIsModalUpdateBookOpen(true)
                            setDataUpdateBook(record)
                        }} />

                    <Popconfirm
                        title="Delete the book"
                        description="Are you sure to delete this book?"
                        onConfirm={() => { handleDeleteBook(record._id) }}
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

    const handleExport = () => {
        if (dataBooks && dataBooks.length) {
            const worksheet = XLSX.utils.json_to_sheet(dataBooks)
            const workbook = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
            XLSX.writeFile(workbook, "Books.xlsx")
        }
    }

    const renderHeaderTable = () => {

        return (
            <div style={{
                display: "flex",
                justifyContent: "space-between",

            }} >
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>List Books</div>
                <div style={{ display: "flex", gap: 15, alignItems: "center" }}>
                    <Button type='primary'
                        onClick={() => { handleExport() }}><ExportOutlined /> Export</Button>

                    <Button type='primary'
                        onClick={() => {
                            setIsModalCreateBookOpen(true)
                        }}
                    ><UserAddOutlined /> Add new</Button>
                    <ReloadOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setSortQuery('&sort=-updatedAt')
                            setQuery('')
                            setCurrent(1)
                            setPageSize(5)
                        }}
                    />
                </div>
            </div >
        )
    }

    const handleDeleteBook = async (id) => {
        const res = await deleteBookAPI(id)
        if (res.data) {
            message.success('Delete book successfully')
            await loadBook()
        } else {
            notification.error({
                message: "Delete book failed",
                description: res.message
            })
        }
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

            <ViewBookDetail
                isViewBookDetail={isViewBookDetail}
                setIsViewBookDetail={setIsViewBookDetail}
                dataViewBookDetail={dataViewBookDetail}
                setDataViewBookDetail={setDataViewBookDetail}
            />

            <CreateBook
                isModalCreateBookOpen={isModalCreateBookOpen}
                setIsModalCreateBookOpen={setIsModalCreateBookOpen}
                loadBook={loadBook}
            />

            <UpdateBook
                setIsModalUpdateBookOpen={setIsModalUpdateBookOpen}
                setDataUpdateBook={setDataUpdateBook}
                dataUpdateBook={dataUpdateBook}
                isModalUpdateBookOpen={isModalUpdateBookOpen}
                loadBook={loadBook} />
        </>
    )
}

export default BookTable