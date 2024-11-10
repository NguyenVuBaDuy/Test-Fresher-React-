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
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './redux/account/accountSlice';
import Loading from './components/Loading/loading';
import ErrorPage from './pages/error/error';
import AdminPage from './pages/admin/admin';
import PrivateRoute from './components/PrivateRoute/private.route';
import LayoutAdmin from './components/Admin/layout.admin';
import UserPage from './pages/user/user';
import OrderPage from './pages/order/order';




const Layout = () => {
  return (
    <div className='layout-app'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

// const LayoutAdmin = () => {
//   const isAdminRoute = window.location.pathname.startsWith('/admin')
//   const user = useSelector(state => state.account.user)
//   const userRole = user.role
//   return (
//     <div className='layout-app'>
//       {isAdminRoute && userRole === 'ADMIN' && <HeaderAdmin />}
//       <Outlet />
//       {isAdminRoute && userRole === 'ADMIN' && <Footer />}
//     </div>
//   )
// }

const App = () => {

  const dispatch = useDispatch();

  const isAuthenticated = useSelector(state => state.account.isAuthenticated)

  const getAccount = async () => {
    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
    ) {
      return
    }
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
      errorElement: <ErrorPage />,
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
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <PrivateRoute><AdminPage /></PrivateRoute>
        },
        {
          path: "/admin/user",
          element: <UserPage />
        },
        {
          path: "/admin/book",
          element: <BookPage />
        },
        {
          path: "/admin/order",
          element: <OrderPage />
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
      {isAuthenticated === true
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        ?
        <RouterProvider router={router} />
        :
        <Loading />
      }
    </>
  )
}


export default App