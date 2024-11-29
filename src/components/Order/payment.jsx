import { Col, Divider, Form, Input, InputNumber, message, notification, Radio, Row, Steps } from "antd"
import './order.scss'
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import ProductList from "./product.list"
import TextArea from "antd/es/input/TextArea"
import { doDeleteAllBookAction } from "../../redux/order/orderSlice"
import { orderAPI } from "../../services/api.service"
import { LoadingOutlined } from "@ant-design/icons"

const Payment = (props) => {

    const { current, setCurrent } = props

    const carts = useSelector(state => state.order.carts)
    const [total, setTotal] = useState(0)
    const [form] = Form.useForm()
    const user = useSelector(state => state.account.user)
    const [isSubmit, setIsSubmit] = useState(false)
    const dispatch = useDispatch()


    useEffect(() => {
        setTotal(carts?.reduce((acc, cur) => {
            acc += +cur.quantity * +cur.detail.price
            return acc
        }, 0))
    }, [carts])

    useEffect(() => {
        form.setFieldsValue({
            fullName: user.fullName,
            phone: user.phone
        })
    }, [])

    const handleOrder = async (values) => {
        if (values) {
            setCurrent(3)
            const detailOrder = carts.map(item => {
                return {
                    bookName: item.detail.mainText,
                    quantity: item.quantity,
                    _id: item._id
                }
            })

            const data = {
                name: values.fullName,
                address: values.address,
                phone: values.phone,
                totalPrice: total,
                detail: detailOrder
            }
            const res = await orderAPI(data)
            setIsSubmit(true)
            if (res.data) {
                dispatch(doDeleteAllBookAction())
                message.success("Order successfully!")
            } else {
                notification.success({
                    message: "Order failed!",
                    description: JSON.stringify(res.message)
                })
            }
            setIsSubmit(false)
        }
    }

    return (
        <div
            style={{
                minHeight: "calc(100vh - 123.4px)",
                backgroundColor: '#efefef',
                padding: "20px 0",
                boxSizing: 'border-box'
            }}>
            <div className="orderpage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Row>
                    <Col md={24}>
                        <div style={{ padding: "20px 15px", backgroundColor: 'white', borderRadius: "5px", marginBottom: "25px" }}>
                            <Steps
                                size="small"
                                current={current}
                                items={[
                                    {
                                        title: 'Order',
                                    },
                                    {
                                        title: 'Checkout',
                                    },
                                    {
                                        title: 'Done',
                                    },
                                ]}
                            />
                        </div>
                    </Col>
                </Row>
                <Row gutter={[20, 20]}>
                    <Col lg={18} md={0} sm={0} xs={0}>
                        <ProductList carts={carts} current={current} />
                    </Col>

                    <Col lg={6} md={24} sm={24} xs={24}>
                        <Col lg={0} md={24} sm={24} xs={24}>
                            <ProductList carts={carts} />
                        </Col>
                        <Col >
                            <div className='order-sum'>
                                <div className='info'>
                                    <Form
                                        form={form}
                                        onFinish={(values) => { handleOrder(values) }}
                                        layout="vertical"
                                    >
                                        <Form.Item
                                            name="fullName"
                                            label="Full name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Full name cannot be blank!"
                                                },
                                            ]}
                                        >
                                            <Input autoComplete="off" />
                                        </Form.Item>
                                        <Form.Item
                                            name="phone"
                                            label="Phone"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Phone cannot be blank!"
                                                },
                                            ]}
                                        >
                                            <InputNumber style={{ width: '100%' }} autoComplete="off" />
                                        </Form.Item>

                                        <Form.Item
                                            name="address"
                                            label="Address"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Address cannot be blank!"
                                                },
                                            ]}
                                        >
                                            <TextArea rows={4} />
                                        </Form.Item>
                                    </Form>
                                    <Divider style={{ margin: "10px 0" }} />
                                    <div className='method'>
                                        <div>Payment method</div>
                                        <Radio checked>Cash on delivery (COD)</Radio>
                                    </div>
                                </div>
                                <div className='calculate'>
                                    <span>Subtotal</span>
                                    <span>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                                    </span>
                                </div>
                                <Divider style={{ margin: "10px 0" }} />
                                <div className='calculate'>
                                    <span>Total</span>
                                    <span className='sum-final'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                                    </span>
                                </div>
                                <Divider style={{ margin: "10px 0" }} />
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <button onClick={() => { setCurrent(1) }}
                                        style={{
                                            boxSizing: "border-box",
                                            backgroundColor: "white",
                                            color: '#4096FF',
                                            border: '1px solid #4096FF',
                                            width: "calc(30% - 10px)"
                                        }}>Back</button>
                                    <button
                                        onClick={() => { form.submit() }}
                                        style={{ width: 'calc(70% - 10px)' }}
                                        disabled={isSubmit}
                                    >
                                        {isSubmit && <span><LoadingOutlined />&nbsp;</span>}
                                        Buy ({carts?.length ?? 0})</button>
                                </div>
                            </div>

                        </Col>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Payment