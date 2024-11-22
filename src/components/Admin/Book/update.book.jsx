import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from "antd"
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchListCategoryBook, updateBookAPI, uploadBookImage } from "../../../services/api.service";


const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });




const UpdateBook = (props) => {

    const [form] = Form.useForm();

    const { isModalUpdateBookOpen, dataUpdateBook, setDataUpdateBook, setIsModalUpdateBookOpen, loadBook } = props

    const [listCategory, setListCategory] = useState()

    const [thumbnail, setThumbnail] = useState([])
    const [sliders, setSliders] = useState([])

    const [loadingThumbnail, setLoadingThumbnail] = useState(false)
    const [loadingSliders, setLoadingSliders] = useState(false)

    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')


    useEffect(() => {
        fetchListCategory()
    }, [])

    const fetchListCategory = async () => {
        const res = await fetchListCategoryBook();
        if (res.data) {
            const list = res.data.map(item => {
                return {
                    value: item,
                    label: item
                }
            })
            setListCategory(list)
        }
    }

    useEffect(() => {
        if (dataUpdateBook && dataUpdateBook._id) {
            form.setFieldsValue({
                id: dataUpdateBook._id,
                mainText: dataUpdateBook.mainText,
                author: dataUpdateBook.author,
                price: dataUpdateBook.price,
                quantity: dataUpdateBook.quantity,
                category: dataUpdateBook.category,
                sold: dataUpdateBook.sold
            })
            setThumbnail([{
                uid: uuidv4(),
                status: 'done',
                name: dataUpdateBook.thumbnail,
                url: `${import.meta.env.VITE_URL_BACKEND}/images/book/${dataUpdateBook.thumbnail}`
            }])

            setSliders([...dataUpdateBook.slider].map(item => {
                return {
                    uid: uuidv4(),
                    status: 'done',
                    name: item,
                    url: `${import.meta.env.VITE_URL_BACKEND}/images/book/${item}`
                }
            }))
        }
    }, [dataUpdateBook])

    const handleUpdateBook = async (values) => {
        if (thumbnail.length === 0) {
            notification.error({
                message: 'Lỗi validate',
                description: 'Vui lòng upload ảnh thumbnail'
            })
            return;
        }


        const { id, mainText, author, price, sold, quantity, category } = values
        const thumbnailImg = thumbnail[0].name
        const slidersImg = sliders.map(item => item.name);
        const res = await updateBookAPI(id, thumbnailImg, slidersImg, mainText, author, price, sold, quantity, category)
        if (res && res.data) {
            message.success('Update book successfully');
            form.resetFields();
            setSliders([]);
            setThumbnail([]);
            setIsModalUpdateBookOpen(false);
            await loadBook()
        } else {
            notification.error({
                message: 'Error',
                description: res.message
            })
        }
    };

    const handleRemoveFile = (file, type) => {
        if (type === 'thumbnail') {
            setThumbnail([])
        }
        if (type === 'slider') {
            const newSlider = sliders.filter(x => x.uid !== file.uid);
            setSliders(newSlider);
        }
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    }

    const handleUploadThumbnail = async (values) => {
        const { file, onSuccess, onError } = values
        const res = await uploadBookImage(file)
        if (res && res.data) {
            setThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid,
                url: URL.createObjectURL(file),
                status: 'done',
            }])
            onSuccess("ok")
            setLoadingThumbnail(false)
        } else onError("Error")
    }

    const handleUploadSliders = async (values) => {
        const { file, onSuccess, onError } = values
        const res = await uploadBookImage(file)
        if (res && res.data) {
            setSliders(sliders => [...sliders, {
                name: res.data.fileUploaded,
                uid: file.uid,
                url: URL.createObjectURL(file),
                status: 'done',
            }])
            onSuccess("ok")
            setLoadingSliders(false)
        } else onError('Error')
    }

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!')
        }
        return isJpgOrPng && isLt2M;
    }

    return (
        <>
            <Modal
                title="Update book"
                open={isModalUpdateBookOpen}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setIsModalUpdateBookOpen(false)
                }}
                width={"50vw"}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={(values) => { handleUpdateBook(values) }}
                    autoComplete="off"
                >
                    <Row style={{ display: "flex", justifyContent: "space-between" }}>
                        <Col style={{ width: "calc(50% - 10px)" }}>
                            <Form.Item
                                hidden
                                name="id"
                                label="id"
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="mainText"
                                label="Book detail"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter book title"
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col style={{ width: "calc(50% - 10px)" }}>
                            <Form.Item
                                name="author"
                                label="Author"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter author"
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row style={{ display: "flex", justifyContent: "space-between" }}>
                        <Col style={{ width: "calc(25% - 10px)" }}>
                            <Form.Item
                                name="price"
                                label="Price"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter price"
                                    },
                                ]}

                            >
                                <InputNumber
                                    min={0}
                                    addonAfter="VND"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>

                        <Col style={{ width: "calc(25% - 10px)" }}>
                            <Form.Item
                                name="category"
                                label="Category"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter author"
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Search to Select"
                                    optionFilterProp="label"
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>

                        <Col style={{ width: "calc(25% - 10px)" }}>
                            <Form.Item
                                name="quantity"
                                label="Quantity"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter quantity"
                                    },
                                ]}
                            >
                                <InputNumber style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>

                        <Col style={{ width: "calc(25% - 10px)" }}>
                            <Form.Item
                                name="sold"
                                label="Sold"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter sold"
                                    },
                                ]}
                            >
                                <InputNumber style={{ width: "100%" }} disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ width: "50%" }}>
                            <Divider orientation="left">Thumbnail</Divider>
                        </Col>
                        <Col style={{ width: "50%" }}>
                            <Divider orientation="left">Sliders</Divider>
                        </Col>
                    </Row>
                    <Row style={{ display: "flex", justifyContent: "space-between" }}>
                        <Col style={{ width: "calc(50% - 10px)" }}>
                            <Form.Item
                                name="thumbnail"
                            >
                                <Upload
                                    fileList={thumbnail}
                                    name="thumnail"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    beforeUpload={(info) => { beforeUpload(info) }}
                                    customRequest={(values) => { handleUploadThumbnail(values) }}
                                    onChange={(info) => { }}
                                    onPreview={handlePreview}
                                    maxCount={1}
                                    multiple={false}
                                    onRemove={file => handleRemoveFile(file, 'thumbnail')}

                                >
                                    <button
                                        style={{
                                            border: 0,
                                            background: 'none',
                                        }}
                                        type="button"
                                    >
                                        {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div
                                            style={{
                                                marginTop: 8,
                                            }}
                                        >
                                            Upload
                                        </div>
                                    </button>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col style={{ width: "calc(50% - 10px)" }}>
                            <Form.Item
                                name="sliders"
                            >
                                <Upload
                                    fileList={sliders}
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    beforeUpload={(info) => { beforeUpload(info) }}
                                    customRequest={(values) => { handleUploadSliders(values) }}
                                    onChange={(info) => { }}
                                    onPreview={handlePreview}
                                    maxCount={6}
                                    multiple={true}
                                    onRemove={file => { handleRemoveFile(file, 'slider') }}
                                >
                                    {sliders.length < 6 &&
                                        <button
                                            style={{
                                                border: 0,
                                                background: 'none',
                                            }}
                                            type="button"
                                        >
                                            {loadingSliders ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div
                                                style={{
                                                    marginTop: 8,
                                                }}
                                            >
                                                Upload
                                            </div>
                                        </button>
                                    }
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                centered
                onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    )
}

export default UpdateBook