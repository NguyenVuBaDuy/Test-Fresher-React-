import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Form, Input, message, notification, Row, Upload } from "antd"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { changeInfoAPI, uploadAvatarAPI } from "../../services/api.service";
import { doChangeInfoUserActive, doSetTemporaryAvatarAction } from "../../redux/account/accountSlice";


const ChangeInfo = () => {

    const user = useSelector(state => state.account.user)
    const [form] = Form.useForm();
    const dispatch = useDispatch()
    const tempAvatar = useSelector(state => state.account.tempAvatar)

    useEffect(() => {
        form.setFieldsValue({
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            _id: user.id
        })
    }, [])


    const handleUploadAvatar = async (values) => {
        const { file, onSuccess, onError } = values
        const res = await uploadAvatarAPI(file)
        if (res && res.data) {
            dispatch(doSetTemporaryAvatarAction(res.data.fileUploaded))
            onSuccess("ok")
        } else onError("Error")
    }

    const props = {
        name: 'file',
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`Avatar upload failed.`);
            }
        },
        customRequest: handleUploadAvatar,
    };

    const handleChangeInfo = async (values) => {
        if (values && values._id) {
            const res = await changeInfoAPI(values.fullName, values.phone, tempAvatar || user.avatar, values._id)
            console.log(res)
            if (res.data) {
                dispatch(doChangeInfoUserActive({
                    fullName: values.fullName,
                    phone: values.phone,
                    avatar: tempAvatar || user.avatar
                }))
                localStorage.removeItem('access_token')
            } else {
                notification.success({
                    message: "Change info failed!",
                    description: res.message
                })
            }
        }
    }

    return (
        <Row>
            <Col md={12}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <Avatar style={{ width: "150px", height: "150px", marginBottom: "30px" }} src={`${import.meta.env.VITE_URL_BACKEND}/images/avatar/${tempAvatar || user.avatar}`} />
                    <Upload {...props}>
                        <Button icon={<UploadOutlined />}>Change avatar</Button>
                    </Upload>
                </div>
            </Col>
            <Col md={12}>
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={(values) => { handleChangeInfo(values) }}
                >

                    <Form.Item
                        name="_id"
                        hidden
                    >
                        <Input hidden />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Email"
                    >
                        <Input disabled />
                    </Form.Item>

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
                        <Input autoComplete="off" />
                    </Form.Item>

                    <Button
                        color="default"
                        variant="outlined"
                        style={{ display: "flex", justifySelf: "flex-end", margin: "80px 0 20px 0" }}
                        onClick={() => { form.submit() }}>Save</Button>
                </Form>
            </Col>
        </Row>
    )
}

export default ChangeInfo