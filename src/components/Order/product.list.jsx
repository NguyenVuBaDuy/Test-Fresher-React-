import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { Empty, Popconfirm } from "antd"
import { useDispatch } from "react-redux"
import { doDeleteBookAction, doUpdateBookAction } from "../../redux/order/orderSlice"

const ProductList = (props) => {

    const { carts, current } = props

    const dispatch = useDispatch()

    const handleChangeQuantityButton = (item, type) => {
        if (type === 'plus') {
            if (item.quantity + 1 <= item.detail.quantity) {
                dispatch(doUpdateBookAction({ quantity: item.quantity + 1, _id: item._id, detail: item.detail }))
            }
        } else if (type === 'minus') {
            if (item.quantity - 1 >= 1) {
                dispatch(doUpdateBookAction({ quantity: item.quantity - 1, _id: item._id, detail: item.detail }))
            }
        }
    }

    const handleChangeQuantityInput = (value, item) => {
        if (value === '') {
            console.log()
            dispatch(doUpdateBookAction({ quantity: 'empty', _id: item._id, detail: item.detail }))
        } else if (value <= item.detail.quantityz && value >= 1) {
            dispatch(doUpdateBookAction({ quantity: value, _id: item._id, detail: item.detail }))
        } else if (value < 1) {
            dispatch(doUpdateBookAction({ quantity: 1, _id: item._id, detail: item.detail }))
        } else if (value > item.detail.quantity) {
            dispatch(doUpdateBookAction({ quantity: item.detail.quantity, _id: item._id, detail: item.detail }))
        }
    }

    const handleBlur = (event, item) => {
        if (event.target.value === '') {
            dispatch(doUpdateBookAction({ quantity: 1, _id: item._id, detail: item.detail }))
        }
    }

    const handleDeleteItem = (item) => {
        dispatch(doDeleteBookAction(item._id))
    }

    return (
        <>
            {carts.length ?
                <div className="order-list">
                    {carts?.map(item => {
                        return (
                            <div className="item">
                                <div style={{ display: "flex", alignItems: 'center' }}>
                                    <img src={`${import.meta.env.VITE_URL_BACKEND}/images/book/${item.detail.thumbnail}`} />
                                    <div style={{ marginLeft: "15px", width: '200px', wordWrap: 'break-word' }}>{item.detail.mainText}</div>
                                </div>

                                <div style={{ display: "flex", alignItems: 'center' }}>
                                    <div className="price">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price)}
                                    </div>

                                    <span className='right-side'>
                                        {current === 1 && <button onClick={() => { handleChangeQuantityButton(item, 'minus') }} ><MinusOutlined /></button>}
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(event) => { handleChangeQuantityInput(event.target.value, item) }}
                                            onBlur={(event) => { handleBlur(event, item) }}
                                            readOnly={current === 1 ? false : true}
                                        />
                                        {current === 1 && <button onClick={() => { handleChangeQuantityButton(item, 'plus') }}><PlusOutlined /></button>}
                                    </span>
                                </div>

                                <div className="total">
                                    Sum: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.quantity !== '' ? item.quantity * item.detail.price : 0)}
                                </div>



                                {current === 2 ?
                                    <div hidden></div>
                                    :
                                    <div className="delete">
                                        <Popconfirm
                                            title="Delete the item"
                                            description="Are you sure to delete this item?"
                                            onConfirm={() => { handleDeleteItem(item) }}
                                            onCancel={() => { }}
                                            okText="Delete"
                                            cancelText="No"
                                        >
                                            <DeleteOutlined
                                                style={{ color: 'red' }} />
                                        </Popconfirm>

                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
                :
                <div style={{ backgroundColor: "white", padding: '100px 0', borderRadius: "5px" }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description='Cart is empty'
                    />
                </div>
            }
        </>
    )
}


export default ProductList