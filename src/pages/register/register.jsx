import { Button, Col, Divider, Form, Input, message, notification, Row } from "antd"
import { useForm } from "antd/es/form/Form"
import "./register.css"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"
import { useRef, useState } from "react"
import { registerAPI } from "../../services/api.service"

const RegisterPage = () => {

    const [form] = useForm()

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)

    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const phoneRef = useRef(null)

    const handleRegisterUser = async (values) => {
        setLoading(true)
        const { fullName, email, password, phone } = values
        const res = await registerAPI(fullName, email, password, phone)
        if (res.data) {
            message.success("Account registration successful")
            form.resetFields()
            navigate("/login")
        } else {
            notification.error({
                message: "Account registration failed",
                description: JSON.stringify(res.message)
            })
        }
        setLoading(false)
    }

    const handleOnKeyDown = (event, nextRef) => {
        if (event.key === "Enter") {
            event.preventDefault()
            if (nextRef !== null) {
                nextRef.current.focus()
            } else {
                form.submit()
            }
        }
    }

    return (
        <div className="register-page" >
            <Row className="row" >
                <Col md={16} xs={24} lg={12} xl={8}>
                    <fieldset>
                        <legend><h2>Register</h2></legend>
                        <Form
                            autoComplete="off"
                            form={form}
                            onFinish={(values) => { handleRegisterUser(values) }}
                            layout="vertical"
                        >
                            <Form.Item
                                className="register-item"
                                name="fullName"
                                label="Full name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your full name"
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Enter your full name"
                                    className="input"
                                    onKeyDown={(event) => { handleOnKeyDown(event, emailRef) }} />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your email"
                                    },
                                    {
                                        type: "email",
                                        message: "Email is not in correct format"
                                    }
                                ]}
                            >
                                <Input
                                    placeholder="Enter your email"
                                    className="input"
                                    ref={emailRef}
                                    onKeyDown={(event) => { handleOnKeyDown(event, passwordRef) }} />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your password"
                                    },
                                ]}
                            >
                                <Input.Password
                                    ref={passwordRef}
                                    onKeyDown={(event) => { handleOnKeyDown(event, phoneRef) }}
                                    placeholder="Enter your password"
                                    className="input" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Phone number"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your phone number"
                                    },
                                ]}
                            >
                                <Input
                                    ref={phoneRef}
                                    className="input"
                                    placeholder="Enter your phone number"
                                    onKeyDown={(event) => { handleOnKeyDown(event, null) }} />
                            </Form.Item>
                            <Form.Item>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}>
                                    <Link to={"/"}><ArrowLeftOutlined /> Go to home page</Link>
                                    <Button
                                        type="primary"
                                        onClick={() => form.submit()}
                                        loading={loading}
                                    >
                                        Register </Button>
                                </div>
                            </Form.Item>
                            <Divider />
                            <div className="ifHadAccount">Already have an account? <Link to={"/login"}>Login here</Link></div>
                        </Form>
                    </fieldset >
                </Col>
            </Row>
        </div >
    )
}

export default RegisterPage