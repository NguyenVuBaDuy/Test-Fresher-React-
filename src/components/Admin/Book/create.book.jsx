import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Col, Divider, Form, Input, InputNumber, message, Modal, notification, Row, Select, Upload } from "antd"
import { useEffect, useState } from "react";
import { createBookAPI, fetchListCategoryBook, uploadBookImage } from "../../../services/api.service";


const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const CreateBook = (props) => {
    const [form] = Form.useForm();

    const { isModalCreateBookOpen, setIsModalCreateBookOpen, loadBook } = props

    const [imageUrl, setImageUrl] = useState("");

    const [listCategory, setListCategory] = useState([])

    const [loadingThumbnail, setLoadingThumbnail] = useState(false)
    const [loadingSliders, setLoadingSliders] = useState(false)

    const [sliders, setSliders] = useState([]);
    const [thumbnail, setThumbnail] = useState([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [loading, setLoading] = useState(false)

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

    const handlePreview = async (file) => {
        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };


    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSliders(true) : setLoadingThumbnail(true)
            return
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSliders(false) : setLoadingThumbnail(false)
                setImageUrl(url)
            });
        }
    };

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

    const handleCreateBook = async (values) => {

        if (thumbnail.length === 0) {
            notification.error({
                message: "Don't have thumbnail",
                description: "Please add thumbnail"
            })
            return
        }

        const thumbnailImg = thumbnail[0].name
        const sliderImg = sliders.map(slider => slider.name)
        const { mainText, author, price, sold, quantity, category } = values
        setLoading(true)
        const res = await createBookAPI(thumbnailImg, sliderImg, mainText, author, price, sold, quantity, category)
        setLoading(false)
        if (res.data) {
            message.success('Create book successfully');
            form.resetFields();
            setSliders([]);
            setThumbnail([])
            setIsModalCreateBookOpen(false);
            await loadBook()
        } else {
            notification.error({
                message: 'Error',
                description: res.message
            })
        }
    }

    const handleRemove = (file, type) => {
        if (type === 'thumbnail') {
            setThumbnail([])
        }

        if (type === 'slider') {
            const newSliders = sliders.filter(item => item.uid !== file.uid)
            setSliders(newSliders)
        }
    }

    return (
        <>
            <Modal
                okButtonProps={{
                    loading: loading
                }}
                title="Create book"
                open={isModalCreateBookOpen}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    form.resetFields()
                    setSliders([])
                    setThumbnail([])
                    setIsModalCreateBookOpen(false)
                }}
                width={"50vw"}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={(values) => { handleCreateBook(values) }}
                    autoComplete="off"
                >
                    <Row style={{ display: "flex", justifyContent: "space-between" }}>
                        <Col style={{ width: "calc(50% - 10px)" }}>
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
                                <InputNumber style={{ width: "100%" }} />
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
                                    beforeUpload={beforeUpload}
                                    customRequest={handleUploadThumbnail}
                                    onChange={handleChange}
                                    onPreview={handlePreview}
                                    maxCount={1}
                                    multiple={false}
                                    onRemove={file => handleRemove(file, 'thumbnail')}

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
                                    beforeUpload={beforeUpload}
                                    customRequest={handleUploadSliders}
                                    onChange={(info) => { handleChange(info, 'slider') }}
                                    onPreview={handlePreview}
                                    maxCount={6}
                                    multiple={true}
                                    onRemove={file => handleRemove(file, 'slider')}
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

export default CreateBook



