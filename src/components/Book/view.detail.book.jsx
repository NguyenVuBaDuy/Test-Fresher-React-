import { Row, Col, Rate, Divider, Button } from 'antd';
import './book.scss';
import ImageGallery from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import ModalGallery from './modal.gallery'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import SkeletonBookLoader from './skeleton.book.loader';
import { doAddBookAction } from '../../redux/order/orderSlice';
import { useDispatch } from 'react-redux';

const ViewDetail = (props) => {

    const { dataBook, setDataBook } = props

    const [isModalImageOpen, setIsModalImageOpen] = useState(false)

    const [currentIndex, setCurrentIndex] = useState(0)

    const [currentQuantity, setCurrentQuantity] = useState(1)

    const dispatch = useDispatch()


    const images = dataBook?.items ?? []
    const title = dataBook?.mainText ?? ''

    const handleOnClickImage = () => {
        setIsModalImageOpen(true)
    }

    const handleChangeQuantityButton = (type) => {
        if (type === 'plus') {
            setCurrentQuantity(currentQuantity + 1 > +dataBook.quantity ? currentQuantity : currentQuantity + 1)
        } else {
            setCurrentQuantity(currentQuantity - 1 < 1 ? currentQuantity : currentQuantity - 1)
        }
    }

    const handleChangeQuantityInput = (value) => {
        if (value <= +dataBook.quantity && value >= 1) {
            setCurrentQuantity(value)
        } else if (value > +dataBook.quantity) {
            setCurrentQuantity(+dataBook.quantity)
        } else if (value === '') {
            setCurrentQuantity('')
        }
    }

    const handleAddToCart = (quantity, book) => {
        dispatch(doAddBookAction({ quantity, _id: book._id, detail: book }))
    }

    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    {dataBook && dataBook._id
                        ?
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    items={images}
                                    showFullscreenButton={false}
                                    showPlayButton={false}
                                    renderLeftNav={() => <></>}
                                    renderRightNav={() => <></>}
                                    slideOnThumbnailOver={true}
                                    onClick={() => { handleOnClickImage() }}
                                    onSlide={(i) => { setCurrentIndex(i) }}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        items={images}
                                        showFullscreenButton={false}
                                        showPlayButton={false}
                                        renderLeftNav={() => <></>}
                                        renderRightNav={() => <></>}
                                        slideOnThumbnailOver={true}
                                        showThumbnails={false} />
                                </Col>
                                <Col span={24}>
                                    <div className='author'>Author: <a href='#'>{dataBook.author}</a> </div>
                                    <div className='title'>{title}</div>
                                    <div className='rating'>
                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                        <span className='sold'>
                                            <Divider type="vertical" />
                                            Sold {dataBook.sold}</span>
                                    </div>
                                    <div className='price'>
                                        <span className='currency'>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook.price)}
                                        </span>
                                    </div>
                                    <div className='delivery'>
                                        <div>
                                            <span className='left-side'>Transport</span>
                                            <span className='right-side'>Free shipping</span>
                                        </div>
                                    </div>
                                    <div className='quantity'>
                                        <span className='left-side'>Số lượng</span>
                                        <span className='right-side'>
                                            <button onClick={() => { handleChangeQuantityButton('minus') }}><MinusOutlined /></button>
                                            <input
                                                onChange={(event) => { handleChangeQuantityInput(event.target.value) }}
                                                value={currentQuantity}
                                                onBlur={(event) => {
                                                    if (event.target.value === '') {
                                                        setCurrentQuantity(1)
                                                    }
                                                }}
                                            />
                                            <button onClick={() => { handleChangeQuantityButton('plus') }}><PlusOutlined /></button>
                                        </span>
                                        <span style={{ marginLeft: "10px", color: "#757575" }}>{dataBook.quantity} available</span>
                                    </div>

                                    <div className='buy'>
                                        <button className='cart' onClick={() => { handleAddToCart(currentQuantity, dataBook) }}>
                                            <BsCartPlus className='icon-cart' />
                                            <span>Add To Cart</span>
                                        </button>
                                        <button className='now'>Buy Now</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                        :
                        <SkeletonBookLoader />}
                </div>
            </div>
            <ModalGallery
                isModalImageOpen={isModalImageOpen}
                setIsModalImageOpen={setIsModalImageOpen}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                images={images}
                title={title}
            />
        </div>
    )
}

export default ViewDetail;