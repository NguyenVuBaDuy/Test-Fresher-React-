import { Card, Col, Row, Statistic } from "antd"
import { useEffect, useState } from "react"
import { getDashboard } from "../../../services/api.service"
import CountUp from 'react-countup';

const Dashboard = () => {

    const [dataDashboard, setDataDashboard] = useState({
        countOrder: 0,
        countUser: 0
    })

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        const res = await getDashboard()
        if (res.data) {
            setDataDashboard(res.data)
        }
    }

    const formatter = (value) => <CountUp end={value} separator="," />;

    return (
        <Row gutter={[20, 20]}>
            <Col md={12} sm={24}>
                <Card>
                    <Statistic title="Total user" value={dataDashboard.countUser} formatter={formatter} />
                </Card>
            </Col>
            <Col md={12} sm={24}>
                <Card>
                    <Statistic title="Total order" value={dataDashboard.countOrder} formatter={formatter} />
                </Card>
            </Col>
        </Row>
    )

}

export default Dashboard