import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { fetchOrderAPI } from "../../../services/api.service";
import moment from "moment";
import ViewOrderDetail from "./view.order.detail";

const OrderTable = () => {

    const [dataOrders, setDataOrders] = useState([])

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState()

    const [sortQuery, setSortQuery] = useState('&sort=-updatedAt')

    const [isViewOrderDetail, setIsViewOrderDetail] = useState(false)
    const [dataViewOrderDetail, setDataViewOrderDetail] = useState([])

    useEffect(() => {
        loadOrder()
    }, [current, pageSize, sortQuery])

    const loadOrder = async () => {
        const res = await fetchOrderAPI(current, pageSize, sortQuery)
        if (res.data) {
            setDataOrders(res.data.result)
            setCurrent(+res.data.meta.current)
            setPageSize(+res.data.meta.pageSize)
            setTotal(+res.data.meta.total)
        }
    }

    const renderHeaderTable = () => {

        return (
            <div style={{
                display: "flex",
                justifyContent: 'flex-start'
            }} >
                <div style={{ fontSize: "18px", fontWeight: "bold" }}>List Orders</div>
            </div >
        )
    }


    const columns = [
        {
            title: 'Id',
            key: '_id',
            render: (_, record) => (
                <a href="#"
                    onClick={() => {
                        setIsViewOrderDetail(true)
                        setDataViewOrderDetail(record)
                    }}>{record._id}</a>
            )
        },
        {
            title: 'Total price',
            key: 'totalPrice',
            dataIndex: 'totalPrice',
            render: (_, record) => {
                return <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}</>
            },
            sorter: true,
            sortOrder: sortQuery?.includes('totalPrice') ? (sortQuery.includes('-') ? 'descend' : 'ascend') : null,
        },
        {
            title: 'Name',
            key: 'name',
            dataIndex: 'name'
        },
        {
            title: "Address",
            key: 'address',
            dataIndex: 'address'
        },
        {
            title: "Phone",
            key: "phone",
            dataIndex: 'phone'
        },
        {
            title: "Order date",
            key: 'updatedAt',
            dataIndex: 'updatedAt',
            render: (_, record) => {
                return <div>{moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</div>
            },
            sorter: true,
            sortOrder: sortQuery?.includes('updatedAt') ? (sortQuery.includes('-') ? 'descend' : 'ascend') : null,
        },
        {
            title: "Payment method",
            key: 'type',
            render: (_, record) => (
                <Tag color="cyan">{record.type}</Tag>
            )
        }
    ];

    const handleOnChange = (pagination, filters, sorter) => {
        if (pagination) {
            if (current !== +pagination.current) {
                setCurrent(+pagination.current)
            }
            if (pageSize !== +pagination.pageSize) {
                setPageSize(+pagination.pageSize)
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


    return (
        <>
            <Table
                title={renderHeaderTable}
                dataSource={dataOrders}
                columns={columns}
                rowKey={'_id'}
                bordered
                pagination={{
                    current: current,
                    pageSize: pageSize,
                    total: total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50'],
                    showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} out of {total}</div>) }
                }}
                onChange={handleOnChange}
            />
            <ViewOrderDetail
                dataViewOrderDetail={dataViewOrderDetail}
                isViewOrderDetail={isViewOrderDetail}
                setDataViewOrderDetail={setDataViewOrderDetail}
                setIsViewOrderDetail={setIsViewOrderDetail}
            />
        </>
    )
}

export default OrderTable