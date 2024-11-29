import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { fetchHistoryAPI } from "../../services/api.service";
import ReactJson from "react-json-view";
import moment from "moment";

const ViewHistory = () => {

    const [dataOrder, setDataOrder] = useState([])

    useEffect(() => {
        getOrder()
    }, [])

    const getOrder = async () => {
        const res = await fetchHistoryAPI()
        if (res.data) {
            setDataOrder(res.data)
        }
    }

    const columns = [
        {
            title: 'No.',
            render: (_, item, index) => (
                <div>{index + 1}</div>
            )
        },
        {
            title: 'Order time',
            key: 'createdAt',
            render: (_, record) => (
                <div>{moment(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</div>
            )
        },
        {
            title: 'Total price',
            key: 'totalPrice',
            render: (_, record) => (
                <div>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}</div>
            )
        },
        {
            title: "Status",
            key: "status",
            render: (_, record) => (
                <Tag color="green">Success</Tag>
            )
        },
        {
            title: "Detail",
            key: 'detail',
            render: (_, record) => (
                <ReactJson
                    src={record.detail}
                    name="Order detail"
                    collapsed={true}
                    enableClipboard={false}
                    displayDataTypes={false}
                    displayObjectSize={false}
                />
            )
        }
    ];

    return (
        <div style={{
            minHeight: "calc(100vh - 123.4px)",
            backgroundColor: 'white',
            padding: "20px 30px",
            boxSizing: 'border-box'
        }}>

            <Table
                dataSource={dataOrder}
                columns={columns}
                pagination={false}
            />

        </div>
    )
}

export default ViewHistory