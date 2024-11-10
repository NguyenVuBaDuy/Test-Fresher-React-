import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Col, Divider, Form, Input, message, notification, Row } from "antd"
import { useForm } from "antd/es/form/Form"
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import './login.css'
import { loginAPI } from "../../services/api.service"
import { useDispatch } from "react-redux"
import { doLoginAction } from "../../redux/account/accountSlice"

const LoginPage = () => {

    const [form] = useForm()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const passwordRef = useRef(null)

    const dispatch = useDispatch()

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

    const handleLogin = async (values) => {
        setLoading(true)
        const res = await loginAPI(values.email, values.password)
        if (res.data) {
            localStorage.setItem("access_token", res.data.access_token)
            dispatch(doLoginAction(res.data))
            message.success('Login successfully')
            form.resetFields()
            navigate("/")
        } else {
            notification.error({
                message: "Login failed",
                description: JSON.stringify(res.message)
            })
        }
        setLoading(false)
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
                                onFinish={(values) => { handleLogin(values) }}
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