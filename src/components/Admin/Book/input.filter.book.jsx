import { Button, Form, Input } from "antd"
import { useForm } from "antd/es/form/Form"

const InputFilterBook = (props) => {
    const [form] = useForm()

    const { setQuery, setCurrent, setPageSize, setSortQuery } = props

    const handleSearch = async (values) => {

        let dataQuery = ''

        if (values) {
            dataQuery = Object.entries(values).reduce((acc, [key, val]) => {
                if (val) {
                    acc += `&${key}=/${val}/i`
                }
                return acc
            }, '')

        }
        setCurrent(1)
        setPageSize(5)
        setQuery(dataQuery)
    }

    return (
        <div style={{
            marginBottom: "50px",
            backgroundColor: "#F0F0F0",
            borderRadius: "10px",
            padding: "30px 0 20px 0"
        }}>
            <Form
                form={form}
                layout="vertical"
                onFinish={(values) => { handleSearch(values) }}
                autoComplete="off"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around"
                }}
            >
                <Form.Item
                    label="Book title"
                    name="mainText"
                    style={{ width: "25%" }}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Author"
                    name="author"
                    style={{ width: "25%" }}>
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="category"
                    style={{ width: "25%" }}>
                    <Input />
                </Form.Item>
            </Form>

            <div className="btnSearch" style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                    type="primary"
                    style={{ marginRight: "10px" }}
                    onClick={() => { form.submit() }}
                >Search</Button>
                <Button
                    type="primary"
                    style={{
                        marginRight: "40px",
                        backgroundColor: "white",
                        boxShadow: "none",
                        color: "black",
                        border: "1px solid #ccc"
                    }}
                    onClick={() => {
                        setCurrent(1)
                        setPageSize(5)
                        setQuery('')
                        setSortQuery('&sort=-updatedAt')
                        form.resetFields()
                    }}
                >Clear</Button>
            </div>
        </div>
    )
}

export default InputFilterBook