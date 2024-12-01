import { Modal, Tabs } from "antd"
import { useSelector } from "react-redux"
import ChangeInfo from "./change.info"
import ChangePassword from "./change.password"

const AccountManagement = (props) => {

    const { isModalChangeInfoOpen, setIsModalChangeInfoOpen } = props


    const items = [
        {
            key: 'changeInfo',
            label: 'Change information',
            children: <ChangeInfo />,
        },
        {
            key: 'changePassword',
            label: 'Change password',
            children: <ChangePassword />,
        }
    ];

    return (
        <Modal
            title="Update information"
            open={isModalChangeInfoOpen}
            onOk={() => { }}
            onCancel={() => { setIsModalChangeInfoOpen(false) }}
            maskClosable={false}
            okText="Save"
            width={"50vw"}
            footer={null}
        >
            <Tabs defaultActiveKey="1" items={items} onChange={() => { }} />
        </Modal>
    )
}

export default AccountManagement