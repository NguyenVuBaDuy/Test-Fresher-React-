import { InboxOutlined } from "@ant-design/icons";
import { message, Modal, Table } from "antd";
import Dragger from "antd/es/upload/Dragger"
import { useState } from "react";
import { render } from "react-dom";
import * as XLSX from 'xlsx'


const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
        onSuccess("ok");
    }, 1000);
};



const ImportUser = (props) => {

    const { isImportDataUser, setIsImportDataUser } = props

    const [dataExcel, setDataExcel] = useState([])

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",//accept these files type

        // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',->don't need to upload because only need to read file
        customRequest: dummyRequest,//fake call api

        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {

                if (info.fileList && info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj
                    const reader = new FileReader();
                    reader.readAsArrayBuffer(file);

                    reader.onload = event => {
                        const data = new Uint8Array(event.target.result)
                        const workbook = XLSX.read(data, { type: 'array' })
                        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                            header: ['fullName', 'email', 'phone'],
                            range: 1
                        })
                        if (jsonData && jsonData.length) {
                            setDataExcel(jsonData)
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

    return (
        <Modal
            title="Upload file"
            open={isImportDataUser}
            onOk={() => { }}
            onCancel={() => { setIsImportDataUser(false) }}
            centered
            okButtonProps={{
                disabled: true
            }}
            maskClosable={false}
            okText="Import data"
            width={'40vw'}>
            <Dragger {...propsUpload}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
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
        </Modal>

    )
}

export default ImportUser