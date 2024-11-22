import axios from "axios";
import { useSelector } from "react-redux";

const instance = axios.create({
    baseURL: import.meta.env.VITE_URL_BACKEND,
    withCredentials: true,
});

instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem("access_token")}` }

const handleRefreshToken = async () => {
    const URL_BACKEND = '/api/v1/auth/refresh'
    const res = await instance.get(URL_BACKEND)
    if (res && res.data) {
        return res.data.access_token
    } else return null
}


// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

const NO_RETRY_HEADER = 'x-no-retry'

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.data && response.data.data) return response.data
    return response;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    const isAuth = localStorage.getItem('access_token')

    if (!isAuth) {
        if (error.response && error.response.data) return error.response.data
        return Promise.reject(error);
    }

    if (error.config && error.response
        && +error.response.status === 401
        && !error.config.headers[NO_RETRY_HEADER]
    ) {
        const access_token = await handleRefreshToken()
        error.config.headers[NO_RETRY_HEADER] = 'true'

        if (access_token) {
            error.config.headers['Authorization'] = `Bearer ${access_token}`
            localStorage.setItem('access_token', access_token)
            return instance.request(error.config);
        }
    }


    // if (error.config && error.response
    //     && +error.response.status === 400
    //     && error.config.url === '/api/v1/auth/refresh'
    // ) {
    //     window.location.href = '/login'
    // }

    if (error.response && error.response.data) return error.response.data
    return Promise.reject(error);
});

export default instance
