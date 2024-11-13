import React, { useEffect, useState } from 'react';
import { Button, Col, Popconfirm, Row, Table } from 'antd';
import { DeleteOutlined, ExportOutlined, ImportOutlined, ReloadOutlined, UserAddOutlined } from '@ant-design/icons';
import { fetchUserWithPaginationAPI } from '../../../services/api.service';
import InputFilterUser from './input.filter.user';
import ViewUserDetail from './view.user.detail';





const UserTable = () => {

    const [dataUsers, setDataUsers] = useState([])

    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(10)

    const [query, setQuery] = useState(null);
    const [sortQuery, setSortQuery] = useState(null)

    const [isViewUserDetail, setIsViewUserDetail] = useState(false)
    const [dataViewUserDetail, setDataViewUserDetail] = useState('')


    useEffect(() => {
        loadUser()
    }, [current, pageSize, query, sortQuery])

    const columns = [
        {
            title: "Id",
            dataIndex: '_id',
            render: (_, record) => (
                <a href='#'
                    onClick={() => {
                        setDataViewUserDetail(record)
                        setIsViewUserDetail(true)
                    }}>{record._id}</a>
            )
        },
        {
            title: 'Full name',
            dataIndex: 'fullName',
            sorter: true
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true
        },
        {
            title: 'Phone number',
            dataIndex: 'phone',
            sorter: true
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

    const loadUser = async () => {

        const res = await fetchUserWithPaginationAPI(current, pageSize, query, sortQuery)
        if (res.data) {
            setDataUsers(res.data.result)
            setCurrent(+res.data.meta.current)
            setPageSize(+res.data.meta.pageSize)
            setTotal(+res.data.meta.total)
        }
    }

    const handleOnChange = (pagination, filters, sorter, extra) => {
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

        if (sorter && sorter.field) {

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
                    <Button type='primary' ><ExportOutlined /> Export</Button>
                    <Button type='primary' ><ImportOutlined /> Import</Button>
                    <Button type='primary' ><UserAddOutlined /> Add new</Button>
                    <ReloadOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setSortQuery('')
                            setQuery('')
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
                    <InputFilterUser
                        setQuery={setQuery}
                        setCurrent={setCurrent}
                        setPageSize={setPageSize}
                        setSortQuery={setSortQuery} />
                </Col>

                <Col span={24}>
                    <Table
                        title={renderHeaderTable}
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

            <ViewUserDetail
                isViewUserDetail={isViewUserDetail}
                setIsViewUserDetail={setIsViewUserDetail}
                dataViewUserDetail={dataViewUserDetail}
                setDataViewUserDetail={setDataViewUserDetail} />
        </>
    )
}
export default UserTable;