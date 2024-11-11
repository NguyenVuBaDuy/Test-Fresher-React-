import React, { useEffect, useState } from 'react';
import { Popconfirm, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { fetchUserWithPaginationAPI } from '../../services/api.service';

const columns = [
    {
        title: "Id",
        dataIndex: '_id'
    },
    {
        title: 'Full name',
        dataIndex: 'fullName',
        sorter: (a, b) => a.fullName.length - b.fullName.length,
    },
    {
        title: 'Email',
        dataIndex: 'email'
    },
    {
        title: 'Phone number',
        dataIndex: 'phone',
        // defaultSortOrder: 'descend',
        sorter: (a, b) => a.phone - b.phone
    },
    {
        title: 'Action',
        render: (_, record) => (
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
        )
    }
];



const UserTable = () => {

    const [dataUsers, setDataUsers] = useState([])

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(10)

    useEffect(() => {
        loadUser()
    }, [current, pageSize])

    const loadUser = async () => {
        const res = await fetchUserWithPaginationAPI(current, pageSize)
        if (res.data) {
            setDataUsers(res.data.result)
            setCurrent(+res.data.meta.current)
            setPageSize(+res.data.meta.pageSize)
            setTotal(+res.data.meta.total)
        }
    }

    const handleOnChange = (pagination) => {
        if (pagination && pagination.current) {
            if (+current != +pagination.current) {
                setCurrent(+pagination.current)
            }
        }

        if (pagination && pagination.pageSize) {
            if (+pageSize != +pagination.pageSize) {
                setPageSize(+pagination.pageSize)
            }
        }
    }


    return (
        <Table
            columns={columns}
            dataSource={dataUsers}
            rowKey={"_id"}
            pagination={{
                current: current,
                pageSize: pageSize,
                total: total,
                showSizeChanger: true,
                showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} out of {total}</div>) }
            }}
            onChange={handleOnChange}
        />
    )
}
export default UserTable;