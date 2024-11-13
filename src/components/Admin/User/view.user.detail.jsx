import React from 'react';

import { Badge, Descriptions, Drawer } from 'antd';
import moment from 'moment';

const ViewUserDetail = (props) => {

    const { setIsViewUserDetail, isViewUserDetail, dataViewUserDetail, setDataViewUserDetail } = props


    return (
        <Drawer
            width={"50vw"}
            title="User Detail"
            onClose={() => {
                setIsViewUserDetail(false)
                setDataViewUserDetail('')
            }}
            open={isViewUserDetail}>
            {dataViewUserDetail ?
                <Descriptions bordered title="User Info" >
                    <Descriptions.Item label="Id" span={2}>
                        {dataViewUserDetail._id}
                    </Descriptions.Item>

                    <Descriptions.Item label="Full name" span={2}>
                        {dataViewUserDetail.fullName}
                    </Descriptions.Item>

                    <Descriptions.Item label="Email" span={2}>
                        {dataViewUserDetail.email}
                    </Descriptions.Item>

                    <Descriptions.Item label="Phone" span={2}>
                        {dataViewUserDetail.phone}
                    </Descriptions.Item>

                    <Descriptions.Item label="Role" span={3}>
                        <Badge status="processing" text={dataViewUserDetail.role} />
                    </Descriptions.Item>

                    <Descriptions.Item label="Created At" span={3}>
                        {moment(dataViewUserDetail.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated At" span={3}>
                        {moment(dataViewUserDetail.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                    </Descriptions.Item>
                </Descriptions>
                :
                <div>Don't have data user</div>
            }
        </Drawer>
    )
}

export default ViewUserDetail