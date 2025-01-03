import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Result } from "antd"
import { Link } from "react-router-dom"


const ErrorPage = () => {
    return (
        <Result
            status="404"
            title="404 ne"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary"><Link to={'/'}><ArrowLeftOutlined /> Back Home</Link></Button>}
        />
    )
}

export default ErrorPage