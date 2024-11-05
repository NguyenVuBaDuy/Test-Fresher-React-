import React, { useState } from 'react';
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
