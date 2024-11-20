import { Badge, Descriptions, Divider, Drawer, Image, Modal, Upload } from "antd"
import { v4 as uuidv4 } from 'uuid';
import { PlusOutlined } from '@ant-design/icons';
import moment from "moment"
import { useEffect, useState } from "react";

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });


const ViewBookDetail = (props) => {

    const { setDataViewBookDetail, dataViewBookDetail, setIsViewBookDetail, isViewBookDetail } = props



    useEffect(() => {
        setImages()
    }, [dataViewBookDetail])

    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewImageTitle, setPreviewImageTitle] = useState('')
    const [fileList, setFileList] = useState([])

    const setImages = () => {
        const images = dataViewBookDetail ? [dataViewBookDetail.thumbnail, ...dataViewBookDetail.slider].map(item => {
            return {
                uid: uuidv4(),
                name: item,
                status: 'done',
                url: `${import.meta.env.VITE_URL_BACKEND}/images/book/${item}`
            }
        }) : [];

        setFileList(images)
    }

    const handlePreview = async (file) => {
        console.log(file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setIsPreviewOpen(true);
        setPreviewImageTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };

    const handleCancel = () => {
        setPreviewImage(null)
        setIsPreviewOpen(false)
        setPreviewImageTitle(null)
    }
    console.log(previewImage)
    return (
        <>
            <Drawer
                title={dataViewBookDetail ? dataViewBookDetail.mainText : 'No name'}
                width={'50vw'}
                onClose={() => {
                    setDataViewBookDetail('')
                    setIsViewBookDetail(false)
                }}
                open={isViewBookDetail}
            >
                {dataViewBookDetail ?
                    <>
                        <Divider orientation="left">Book info</Divider>

                        <Descriptions bordered >
                            <Descriptions.Item label="Id" span={3}>
                                {dataViewBookDetail._id}
                            </Descriptions.Item>

                            <Descriptions.Item label="Book title" span={3}>
                                {dataViewBookDetail.mainText}
                            </Descriptions.Item>

                            <Descriptions.Item label="Author" span={2}>
                                {dataViewBookDetail.author}
                            </Descriptions.Item>

                            <Descriptions.Item label="Price" span={2}>
                                <>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataViewBookDetail.price)}</>
                            </Descriptions.Item>

                            <Descriptions.Item label="Category" span={3}>
                                <Badge status="processing" text={dataViewBookDetail.category} />
                            </Descriptions.Item>

                            <Descriptions.Item label="Created At" span={2}>
                                {moment(dataViewBookDetail.createdAt).format('DD-MM-YYYY HH:mm:ss')}
                            </Descriptions.Item>

                            <Descriptions.Item label="Updated At" span={2}>
                                {moment(dataViewBookDetail.updatedAt).format('DD-MM-YYYY HH:mm:ss')}
                            </Descriptions.Item>
                        </Descriptions>
                    </>
                    :
                    <div>Don't have data user</div>
                }

                <Divider orientation="left">Book images</Divider>

                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    showUploadList={{
                        showRemoveIcon: false
                    }}
                >
                </Upload>
                <Modal
                    title={previewImageTitle}
                    open={isPreviewOpen}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <img src={previewImage} style={{ width: '100%' }} />
                </Modal>
            </Drawer>
        </>
    )
}

export default ViewBookDetail 