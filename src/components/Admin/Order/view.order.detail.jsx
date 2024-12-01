import { Badge, Descriptions, Divider, Drawer } from "antd"
import moment from "moment"
import ReactJson from "react-json-view"

const ViewOrderDetail = (props) => {

    const { dataViewOrderDetail, isViewOrderDetail, setIsViewOrderDetail, setDataViewOrderDetail } = props

    return (
        <>
            <Drawer
                title={'View order'}
                width={'50vw'}
                onClose={() => {
                    setIsViewOrderDetail(false)
                    setDataViewOrderDetail('')
                }}
                open={isViewOrderDetail}
            >
                {dataViewOrderDetail ?
                    <>
                        <Divider orientation="left">Order information</Divider>

                        <Descriptions bordered >
                            <Descriptions.Item label="Name" span={2}>
                                {dataViewOrderDetail.name}
                            </Descriptions.Item>

                            <Descriptions.Item label="Phone" span={2}>
                                {dataViewOrderDetail.phone}
                            </Descriptions.Item>

                            <Descriptions.Item label="Address" span={3}>
                                {dataViewOrderDetail.address}
                            </Descriptions.Item>

                            <Descriptions.Item label="Payment method" span={3}>
                                <Badge status="processing" text={dataViewOrderDetail.type} />
                            </Descriptions.Item>

                            <Descriptions.Item label="Total price" span={2}>
                                <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewOrderDetail.totalPrice)}</>
                            </Descriptions.Item>

                            <Descriptions.Item label="Created at" span={2}>
                                {moment(dataViewOrderDetail.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Order detail</Divider>
                        <ReactJson
                            src={dataViewOrderDetail.detail}
                            name="Order detail"
                            collapsed={true}
                            enableClipboard={false}
                            displayDataTypes={false}
                            displayObjectSize={false}
                        />
                    </>
                    :
                    <div>Don't have data user</div>
                }
            </Drawer>
        </>
    )
}

export default ViewOrderDetail