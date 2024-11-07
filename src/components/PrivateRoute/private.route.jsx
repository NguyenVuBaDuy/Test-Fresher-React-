import { notification } from "antd"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import Unauthorized from "./unauthorized"

const RoleBaseRoute = (props) => {
    const isAdminRoute = window.location.pathname.startsWith('/admin')
    const user = useSelector(state => state.account.user)
    const userRole = user.role

    if (isAdminRoute && userRole === 'ADMIN') {
        return (
            <>
                {props.children}

            </>
        )
    } else {
        return (
            <Unauthorized />
        )
    }
}

const PrivateRoute = (props) => {

    const isAuthenticated = useSelector(state => state.account.isAuthenticated)

    return (
        <>
            {isAuthenticated === true ?

                <>
                    <RoleBaseRoute>
                        {props.children}
                    </RoleBaseRoute>
                </>
                :
                <>
                    {
                        notification.warning({
                            message: "Access failed",
                            description: "You need login to access this page"
                        })
                    }
                    < Navigate to={'/login'} replace />
                </>
            }
        </>
    )
}

export default PrivateRoute