import { Button, Col, Form, Input, message, notification, Row } from "antd"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import image from './pass.png'
import { changePasswordAPI } from "../../services/api.service"

const ChangePassword = () => {

    const [form] = Form.useForm()
    const email = useSelector(state => state.account.user.email)

    useEffect(() => {
        form.setFieldsValue({
            email: email
        })
    }, [])

    const handleChangePassword = async (values) => {
        if (values && values.email) {
            const res = await changePasswordAPI(values.email, values.oldpass, values.newpass)
            if (res.data) {
                message.success('Changed password successfully!')
                if (values.oldpass) {
                    form.setFieldsValue({
                        oldpass: '',
                        newpass: ''
                    })
                }
            } else {
                notification.success({
                    message: 'Changed password failed!',
                    description: res.message
                })
            }
        }
    }

    return (
        <Row >
            <Col md={14} style={{ padding: "0 30px" }}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={(values) => { handleChangePassword(values) }}
                >
                    <Form.Item
                        name="email"
                        label='Email'
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        name="oldpass"
                        label='Old password'
                        rules={[
                            {
                                required: "true",
                                message: "Cannot be left blank!"
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="newpass"
                        label='New password'
                        rules={[
                            {
                                required: "true",
                                message: "Cannot be left blank!"
                            }
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button type="primary"
                        style={{ margin: '20px 0 40px 0' }}
                        onClick={() => { form.submit() }}
                    >Save</Button>
                </Form>
            </Col>
            <Col md={10}>
                <img src={image} style={{ width: "100%", height: "auto" }} />
            </Col>
        </Row>
    )
}

export default ChangePassword