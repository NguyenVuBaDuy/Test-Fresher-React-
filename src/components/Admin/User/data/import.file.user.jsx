import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, notification, Table } from "antd";
import Dragger from "antd/es/upload/Dragger"
import { useState } from "react";
import * as XLSX from 'xlsx'
import { importDataUserAPI } from "../../../../services/api.service";
import templateFile from './template.xlsx?url'

const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 1000);
};



const ImportUser = (props) => {

    const { isImportDataUser, setIsImportDataUser, loadUser } = props

    const [dataExcel, setDataExcel] = useState([])
    const [fileList, setFileList] = useState([])

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",//accept these files type

        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',->don't need to upload because only need to read file

        customRequest: dummyRequest,//fake call api
        fileList: fileList,
        onChange(info) {
            const { status } = info.file
            setFileList(info.fileList)

            if (status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (status === 'done') {

                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj
                    const reader = new FileReader()
                    reader.readAsArrayBuffer(file)

                    reader.onload = event => {
                        const data = new Uint8Array(event.target.result)
                        const workbook = XLSX.read(data, { type: 'array' })
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                            header: ['fullName', 'email', 'phone'],
                            range: 1
                        })
                        if (jsonData && jsonData.length) {

                            const addDefaultPassword = jsonData.map(item => {
                                return { ...item, 'password': "123456" }
                            })

                            setDataExcel(addDefaultPassword)
                        }
                    }

                }
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleImportDataUser = async () => {
        if (dataExcel.length) {
            const res = await importDataUserAPI(dataExcel)
            if (res.data) {
                notification.success({
                    description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                    message: "Upload successfully",
                })

                await loadUser()
                resetAndCloseModal()
            } else {
                notification.error({
                    message: "Error import user",
                    description: JSON.stringify(res.message)
                })
            }
            resetAndCloseModal()
        }
    }

    const resetAndCloseModal = () => {
        setIsImportDataUser(false)
        setDataExcel([])
        setFileList([])
    }

    return (
        <Modal
            title="Upload file"
            open={isImportDataUser}
            onOk={() => { handleImportDataUser() }}
            onCancel={() => { resetAndCloseModal() }}
            centered
            okButtonProps={{
                disabled: !dataExcel || dataExcel.length === 0
            }}
            maskClosable={false}
            okText="Import data"
            width={'40vw'} >
            <Dragger
                {...propsUpload}
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single upload.
                    Only accept .csv, .xls, .xlsx . or <a href={templateFile} download onClick={event => event.stopPropagation()}>Download Sample File</a>
                </p>
            </Dragger>
            <div style={{ paddingTop: 20 }}>
                <Table
                    title={() => <span>Data Upload:</span>}
                    dataSource={dataExcel}
                    columns={[
                        {
                            title: 'Full name',
                            dataIndex: 'fullName'
                        },
                        {
                            title: 'Email',
                            dataIndex: 'email'
                        },
                        {
                            title: 'Phone',
                            dataIndex: 'phone'
                        }
                    ]}
                />
            </div>
        </Modal >

    )
}

export default ImportUser