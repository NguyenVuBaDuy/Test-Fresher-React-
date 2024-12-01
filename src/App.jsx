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
import LayoutAdmin from './components/Admin/User/layout.admin';
import OrderPage from './pages/order/order';
import './styles/reset.scss';
import ManageBookPage from './pages/admin/book/mange.book';
import ManageUserPage from './pages/admin/user/manage.user';
import './styles/global.scss'
import PrivateOrder from './components/PrivateRoute/private.order';
import HistoryPage from './pages/history/history';
import ManageOrder from './pages/admin/order/manage.order';


const Layout = () => {
  return (
    <div className='layout-app' style={{ height: "100%" }}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}


const App = () => {

  const dispatch = useDispatch();

  const isLoading = useSelector(state => state.account.isLoading)


  const getAccount = async () => {

    if (window.location.pathname === '/login'
      || window.location.pathname === '/register'
    ) return

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
          path: "book/:slug",
          element: <BookPage />
        },
        {
          path: 'order',
          element: <PrivateOrder><OrderPage /></PrivateOrder>
        },
        {
          path: '/history',
          element: <HistoryPage />
        }
      ]
    },
    {
      path: "/admin",
      element: <PrivateRoute><LayoutAdmin /></PrivateRoute>,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <PrivateRoute><AdminPage /></PrivateRoute>
        },
        {
          path: "/admin/user",
          element: <PrivateRoute><ManageUserPage /></PrivateRoute>
        },
        {
          path: "/admin/book",
          element: <PrivateRoute><ManageBookPage /></PrivateRoute>
        },
        {
          path: "/admin/order",
          element: <PrivateRoute><ManageOrder /></PrivateRoute>
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
      {isLoading === false
        || window.location.pathname === '/login'
        || window.location.pathname === '/register'
        || window.location.pathname === '/'
        || window.location.pathname.startsWith('/book/')
        ?
        <RouterProvider router={router} />
        :
        <Loading />
      }
    </>
  )
}


export default App