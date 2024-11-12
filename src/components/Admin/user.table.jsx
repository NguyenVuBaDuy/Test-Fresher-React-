import React, { useEffect, useState } from 'react';
import { Button, Col, Popconfirm, Row, Table } from 'antd';
import { DeleteOutlined, ExportOutlined, ImportOutlined, ReloadOutlined, UserAddOutlined } from '@ant-design/icons';
import { fetchUserWithPaginationAPI } from '../../services/api.service';
import InputFilterUser from './input.filter.user';

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

    const [query, setQuery] = useState(null);

    useEffect(() => {
        loadUser()
    }, [current, pageSize, query])

    const loadUser = async () => {

        const res = await fetchUserWithPaginationAPI(current, pageSize, query)
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
        <Row>
            <Col span={24}>
                <InputFilterUser
                    setQuery={setQuery}
                    setCurrent={setCurrent}
                    setPageSize={setPageSize} />
            </Col>

            <Col span={24}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "white",
                    padding: "20px 25px",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px"
                }}>
                    <div style={{ fontSize: "18px", fontWeight: "bold" }}>List Users</div>
                    <div>
                        <Button type='primary' style={{ marginRight: "15px" }}><ExportOutlined /> Export</Button>
                        <Button type='primary' style={{ marginRight: "15px" }}><ImportOutlined /> Import</Button>
                        <Button type='primary' style={{ marginRight: "25px" }}><UserAddOutlined /> Add new</Button>
                        <ReloadOutlined style={{ cursor: "pointer" }} />
                    </div>
                </div>
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
            </Col>
        </Row>
    )
}
export default UserTable;