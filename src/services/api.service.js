import axios from './axios.customize';

const registerAPI = (fullName, email, password, phone) => {
    const URL_BACKEND = '/api/v1/user/register'
    const data = {
        fullName,
        email,
        password,
        phone
    }
    return axios.post(URL_BACKEND, data)
}

const loginAPI = (username, password) => {
    const URL_BACKEND = '/api/v1/auth/login'
    const data = {
        username,
        password,
        delay: 1000
    }
    return axios.post(URL_BACKEND, data)
}

const fetchUserAPI = () => {
    const URL_BACKEND = '/api/v1/auth/account'
    return axios.get(URL_BACKEND)
}

export {
    registerAPI,
    loginAPI,
    fetchUserAPI
}