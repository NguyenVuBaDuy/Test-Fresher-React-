import { Col, Divider, Row, Steps } from "antd"
import './order.scss'
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import ProductList from "./product.list"

const ViewOrder = (props) => {

    const { current, setCurrent } = props

    const carts = useSelector(state => state.order.carts)

    const [total, setTotal] = useState(0)


    useEffect(() => {
        setTotal(carts?.reduce((acc, cur) => {
            acc += +cur.quantity * +cur.detail.price
            return acc
        }, 0))
    }, [carts])

    const handleConfirm = () => {
        if (carts.length > 0) {
            setCurrent(2)
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
                            <ProductList carts={carts} current={current} />
                        </Col>
                        <Col >
                            <div className="bill">
                                <div className="subtotal">
                                    <div>Subtotal</div>
                                    <div className="price">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                                    </div>
                                </div>
                                <Divider />
                                <div className="total">
                                    <div>Total</div>
                                    <div className="price">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
                                    </div>
                                </div>
                                <Divider />
                                <div className="button-buy" onClick={() => { handleConfirm() }}>
                                    <button>Confirm ({carts?.length})</button>
                                </div>
                            </div>
                        </Col>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default ViewOrder