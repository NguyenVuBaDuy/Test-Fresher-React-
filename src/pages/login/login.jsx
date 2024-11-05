import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Col, Divider, Form, Input, Row } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import './login.css'

const LoginPage = () => {

    const [form] = useForm()
    const [loading, setLoading] = useState(false)

    const passwordRef = useRef(null)


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
        <>
            <div className="login-page" >
                <Row className="row" >
                    <Col md={16} xs={24} lg={12} xl={8}>
                        <fieldset>
                            <legend><h2>Login</h2></legend>
                            <Form
                                autoComplete="off"
                                form={form}
                                onFinish={(values) => { }}
                                layout="vertical"
                            >

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
                                            message: "Invalid email"
                                        }
                                    ]}
                                >
                                    <Input
                                        placeholder="Enter your email"
                                        className="input"
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
                                        onKeyDown={(event) => { handleOnKeyDown(event, null) }}
                                        placeholder="Enter your password"
                                        className="input" />
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
                                            Login </Button>
                                    </div>
                                </Form.Item>
                                <Divider />
                                <div className="ifHadAccount">Don't have an account? <Link to={"/register"}>Register here</Link></div>
                            </Form>
                        </fieldset >
                    </Col>
                </Row>
            </div >
            <script src="./fix.js"></script>
        </>
    )
}
export default LoginPage