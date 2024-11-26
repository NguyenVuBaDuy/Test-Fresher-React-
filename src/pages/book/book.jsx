import { useLocation } from "react-router-dom"
import ViewDetailBook from "../../components/Book/view.detail.book"
import { getBookByIdAPI } from "../../services/api.service"
import { useEffect, useState } from "react"

const BookPage = () => {
    let location = useLocation()

    let params = new URLSearchParams(location.search)
    const id = params?.get('id')

    const [dataBook, setDataBook] = useState(null)

    useEffect(() => {
        fetchBookById(id)
    }, [id])

    const fetchBookById = async (id) => {
        const res = await getBookByIdAPI(id)
        if (res.data) {
            let data = res.data
            data.items = getThumbnailAndSliders(data)
            setTimeout(() => {
                setDataBook(data)
            }, 500)
        }
    }

    const getThumbnailAndSliders = (data) => {
        const images = []

        images.push(
            {
                original: `${import.meta.env.VITE_URL_BACKEND}/images/book/${data.thumbnail}`,
                thumbnail: `${import.meta.env.VITE_URL_BACKEND}/images/book/${data.thumbnail}`,
                originalClass: "original-image",
                thumbnailClass: "thumbnail-image"
            }
        )

        if (data.slider && data.slider.length > 0) {
            data.slider.map(item => {
                images.push(
                    {
                        original: `${import.meta.env.VITE_URL_BACKEND}/images/book/${item}`,
                        thumbnail: `${import.meta.env.VITE_URL_BACKEND}/images/book/${item}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    }
                )
            })
        }
        return images
    }

    return (
        <ViewDetailBook
            dataBook={dataBook}
            setDataBook={setDataBook} />
    )
}

export default BookPage