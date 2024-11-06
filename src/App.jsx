import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login/login';
import ContactPage from './pages/contact/contact';
import BookPage from './pages/book/book';
import Footer from './components/Footer/footer';
import Header from './components/Header/header';
import HomePage from './components/Home/home';
import RegisterPage from './pages/register/register';
import { fetchUserAPI } from './services/api.service';
import { useDispatch } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';




const Layout = () => {
  return (
    <div className='layout-app'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default function App() {

  const dispatch = useDispatch();

  const getAccount = async () => {
    const res = await fetchUserAPI()
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount()
  }, [])

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: "404 NOT FOUND",
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: "contact",
          element: <ContactPage />
        },
        {
          path: "book",
          element: <BookPage />
        }
      ]
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
