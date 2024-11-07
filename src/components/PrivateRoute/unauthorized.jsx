import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Result } from "antd"
import { Link } from "react-router-dom"


const Unauthorized = () => {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, Sorry, you are not authorized to access this page.."
            extra={<Button type="primary"><Link to={'/'}><ArrowLeftOutlined /> Back Home</Link></Button>}
        />
    )
}

export default Unauthorized