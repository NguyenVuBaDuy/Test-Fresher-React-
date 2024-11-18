import React, { useEffect, useState } from 'react';
import './css/index.css';
import { Button, Col, Form, Input, InputNumber, message, notification, Popconfirm, Row, Table, Typography } from 'antd';
import moment from 'moment';
import { DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined, ReloadOutlined, UserAddOutlined } from '@ant-design/icons';
import { fetchUserWithPaginationAPI, updateUserAPI } from '../../../services/api.service';
import InputFilterUser from './input.filter.user';
import ViewUserDetail from './view.user.detail';
import CreateUser from './create.user';
import ImportUser from './data/import.file.user';
import * as XLSX from 'xlsx'

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const UserTable = () => {
    const [form] = Form.useForm();

    const [dataUsers, setDataUsers] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(10)

    const [query, setQuery] = useState(null);
    const [sortQuery, setSortQuery] = useState(null)

    const [isViewUserDetail, setIsViewUserDetail] = useState(false)
    const [dataViewUserDetail, setDataViewUserDetail] = useState('')

    const [isCreateUserModal, setIsCreateUserModal] = useState(false)

    const [isImportDataUser, setIsImportDataUser] = useState(false)

    const [editingKey, setEditingKey] = useState('');

    useEffect(() => {
        loadUser()
    }, [current, pageSize, query, sortQuery])

    const isEditing = (record) => record._id === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record._id);
    };
    const cancel = () => {
        setEditingKey('');
    };

    const loadUser = async () => {

        const res = await fetchUserWithPaginationAPI(current, pageSize, query, sortQuery)
        if (res.data) {
            setDataUsers(res.data.result)
            setCurrent(+res.data.meta.current)
            setPageSize(+res.data.meta.pageSize)
            setTotal(+res.data.meta.total)
        }
    }

    const save = async (id) => {
        const data = await form.validateFields();
        const res = await updateUserAPI(id, data.fullName, data.phone)

        if (res.data) {
            message.success('Update user successfully')
            await loadUser()
        } else {
            notification.error({
                message: "Error Update User",
                description: JSON.stringify(res.message)
            })
        }
        setEditingKey('');
    };

    const handleExport = () => {
        if (dataUsers && dataUsers.length > 0) {
            const worksheet = XLSX.utils.json_to_sheet(dataUsers);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "ExportUser.xlsx");
        }
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            editable: false,
            render: (_, record) => (
                <a href='#' onClick={() => {
                    setIsViewUserDetail(true)
                    setDataViewUserDetail(record)
                }}>{record._id}</a>
            )
        },
        {
            title: 'Full name',
            dataIndex: 'fullName',
            editable: true,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            editable: false,
        },
        {
            title: 'Phone number',
            dataIndex: 'phone',
            editable: true,
        },
        {
            title: 'Last Updated',
            dataIndex: 'updatedAt',
            sorter: true,
            editable: false,
            render: (_, record) => (
                <div>{moment(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</div>
            ),
        },
        {
            title: 'Action',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ?
                    (
                        <span style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
                            <Typography.Link
                                onClick={() =>
                                    save(record._id)
                                }
                                style={{
                                    marginInlineEnd: 8,
                                }}
                            >
                                Save
                            </Typography.Link>
                            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                                <a>Cancel</a>
                            </Popconfirm>
                        </span>
                    )
                    :
                    (
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-around",
                        }
                        } >
                            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                <EditOutlined
                                    style={{ cursor: "pointer", color: "orange" }}
                                />
                            </Typography.Link>

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
                        </div >
                    )
            }
        }
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'number' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

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
                    <Button type='primary'
                        onClick={() => { handleExport() }}><ExportOutlined /> Export</Button>

                    <Button type='primary'
                        onClick={() => { setIsImportDataUser(true) }}
                    ><ImportOutlined /> Import</Button>

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
                    <InputFilterUser
                        setQuery={setQuery}
                        setCurrent={setCurrent}
                        setPageSize={setPageSize}
                        setSortQuery={setSortQuery} />
                </Col>

                <Col span={24}>
                    <Form form={form} component={false}>
                        <Table
                            title={renderHeaderTable}
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            bordered
                            dataSource={dataUsers}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            rowKey={'_id'}
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
                    </Form>
                </Col>
            </Row>

            <ViewUserDetail
                isViewUserDetail={isViewUserDetail}
                setIsViewUserDetail={setIsViewUserDetail}
                dataViewUserDetail={dataViewUserDetail}
                setDataViewUserDetail={setDataViewUserDetail} />

            <CreateUser
                setIsCreateUserModal={setIsCreateUserModal}
                isCreateUserModal={isCreateUserModal}
                loadUser={loadUser} />

            <ImportUser
                setIsImportDataUser={setIsImportDataUser}
                isImportDataUser={isImportDataUser}
                loadUser={loadUser} />
        </>
    );
};
export default UserTable;