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

const logOutAPI = () => {
    const URL_BACKEND = '/api/v1/auth/logout'
    return axios.post(URL_BACKEND)
}

const fetchUserWithPaginationAPI = (current, pageSize, query, sortQuery) => {
    const URL_BACKEND = `/api/v1/user?current=${current}&pageSize=${pageSize}${query ? query : ""}${sortQuery ? sortQuery : ""}`
    return axios.get(URL_BACKEND)
}

const createUserAPI = (fullName, password, email, phone) => {
    const URL_BACKEND = '/api/v1/user'
    const data = {
        fullName, password, email, phone
    }
    return axios.post(URL_BACKEND, data)
}

export {
    registerAPI,
    loginAPI,
    fetchUserAPI,
    logOutAPI,
    fetchUserWithPaginationAPI,
    createUserAPI
}