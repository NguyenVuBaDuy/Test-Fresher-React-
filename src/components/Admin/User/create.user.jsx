import { Form, Input, message, Modal, notification } from "antd"
import { useForm } from "antd/es/form/Form"
import { createUserAPI } from "../../../services/api.service"

const CreateUser = (props) => {

    const { isCreateUserModal, setIsCreateUserModal, loadUser } = props

    const [form] = useForm()

    const handleCreateUser = async (values) => {

        const { fullName, password, email, phone } = values

        const res = await createUserAPI(fullName, password, email, phone)

        if (res.data) {
            message.success('Create User Successfully')
            resetAndCloseModal()
            await loadUser()
        } else {
            notification.error({
                message: "Error Create User",
                description: JSON.stringify(res.message)
            })
        }
    }

    const resetAndCloseModal = () => {
        form.resetFields()
        setIsCreateUserModal(false)
    }

    return (
        <Modal title="Create user"
            open={isCreateUserModal}
            onOk={() => { form.submit() }}
            onCancel={resetAndCloseModal}
            centered
            okText="Create"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateUser}
                autoComplete="off"
            >
                <Form.Item
                    label="Full name"
                    name="fullName"
                    rules={[
                        {
                            required: true,
                            message: "Full name cannot be left blank"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Password cannot be left blank"
                        },

                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: "Email cannot be left blank"
                        },
                        {
                            type: "email",
                            message: "Invalid email format"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Phone number"
                    name="phone"
                    rules={[
                        {
                            required: true,
                            message: "Phone number cannot be left blank"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal >
    )
}

export default CreateUser