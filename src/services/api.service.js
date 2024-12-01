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

const importDataUserAPI = (data) => {
    const URL_BACKEND = '/api/v1/user/bulk-create'
    return axios.post(URL_BACKEND, data)
}

const updateUserAPI = (_id, fullName, phone) => {
    const URL_BACKEND = '/api/v1/user'
    const data = { _id, fullName, phone }
    return axios.put(URL_BACKEND, data)
}

const deleteUserAPI = (id) => {
    const URL_BACKEND = '/api/v1/user/' + id
    return axios.delete(URL_BACKEND)
}

const fetchBookWithPaginationAPI = (current, pageSize, query, sortQuery) => {
    const URL_BACKEND = `/api/v1/book?current=${current}&pageSize=${pageSize}${query ? query : ""}${sortQuery ? sortQuery : ""}`
    return axios.get(URL_BACKEND)
}

const fetchListCategoryBook = () => {
    const URL_BACKEND = `/api/v1/database/category`
    return axios.get(URL_BACKEND)
}


const uploadBookImage = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book"
        },
    });
}

const createBookAPI = (thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    const URL_BACKEND = `/api/v1/book`
    const data = {
        thumbnail, slider, mainText, author, price, sold, quantity, category
    }
    return axios.post(URL_BACKEND, data)
}

const updateBookAPI = (id, thumbnail, slider, mainText, author, price, sold, quantity, category) => {
    const URL_BACKEND = `/api/v1/book/${id}`
    const data = {
        thumbnail, slider, mainText, author, price, sold, quantity, category
    }
    return axios.put(URL_BACKEND, data)
}

const deleteBookAPI = (id) => {
    const URL_BACKEND = `/api/v1/book/${id}`
    return axios.delete(URL_BACKEND)
}

const getBookByIdAPI = (id) => {
    const URL_BACKEND = `/api/v1/book/${id}`
    return axios.get(URL_BACKEND)
}

const createOrderAPI = (data) => {
    const URL_BACKEND = `/api/v1/order`
    return axios.post(URL_BACKEND, data)
}

const fetchHistoryAPI = () => {
    const URL_BACKEND = `/api/v1/history`
    return axios.get(URL_BACKEND)
}

const uploadAvatarAPI = (fileImg) => {
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "avatar"
        },
    });
}

const changeInfoAPI = (fullName, phone, avatar, _id) => {
    const URL_BACKEND = `/api/v1/user`
    const data = {
        fullName, phone, avatar, _id
    }
    return axios.put(URL_BACKEND, data)
}

const changePasswordAPI = (email, oldpass, newpass) => {
    const URL_BACKEND = '/api/v1/user/change-password'
    const data = { email, oldpass, newpass }
    return axios.post(URL_BACKEND, data)
}

const fetchOrderAPI = (current, pageSize, sortQuery) => {
    const URL_BACKEND = `/api/v1/order?current=${current}&pageSize=${pageSize}${sortQuery ? sortQuery : ''}`
    return axios.get(URL_BACKEND)
}

export {
    registerAPI,
    loginAPI,
    fetchUserAPI,
    logOutAPI,
    fetchUserWithPaginationAPI,
    createUserAPI,
    importDataUserAPI,
    updateUserAPI,
    deleteUserAPI,
    fetchBookWithPaginationAPI,
    fetchListCategoryBook,
    uploadBookImage,
    createBookAPI,
    updateBookAPI,
    deleteBookAPI,
    getBookByIdAPI,
    createOrderAPI,
    fetchHistoryAPI,
    uploadAvatarAPI,
    changeInfoAPI,
    changePasswordAPI,
    fetchOrderAPI
} 