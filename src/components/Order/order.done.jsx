import { Button, Col, Result, Row, Steps } from "antd"
import './order.scss'
import { SmileOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"

const OrderDone = (props) => {

    const { current } = props

    const navigate = useNavigate()

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
                <Row>
                    <Col sm={24}>
                        <Result
                            icon={<SmileOutlined />}
                            title="Your order has been successfully placed!"
                            extra={<Button type="primary"
                                onClick={() => { navigate('/history') }}
                            >View order history</Button>}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default OrderDone