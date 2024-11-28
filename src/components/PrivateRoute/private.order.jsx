import { useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"

const PrivateOrder = (props) => {
    const isAuthenticated = useSelector(state => state.account.isAuthenticated)


    return (
        <>
            {isAuthenticated === true ?
                <>
                    {props.children}
                </>
                :
                < Navigate to={'/login'} replace />
            }
        </>
    )
}

export default PrivateOrder