import { useState } from "react"
import ViewOrder from "../../components/Order/view.order"
import Payment from "../../components/Order/payment"
import OrderDone from "../../components/Order/order.done"


const OrderPage = () => {

    const [current, setCurrent] = useState(1)

    if (current === 1) {
        return (
            <ViewOrder
                current={current}
                setCurrent={setCurrent}
            />
        )
    } else if (current === 2) {
        return (
            <Payment
                current={current}
                setCurrent={setCurrent}
            />
        )
    } else if (current === 3) {
        return (
            <OrderDone
                current={current}
                setCurrent={setCurrent}
            />
        )
    }

}

export default OrderPage