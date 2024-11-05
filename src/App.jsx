import React, { useState } from 'react';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/login';
import ContactPage from './pages/contact';
import BookPage from './pages/book';
import Footer from './components/Footer';
import Header from './components/Header';
import HomePage from './components/Home';




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
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
