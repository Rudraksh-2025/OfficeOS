import Login from "./pages/auth/Login";
import Layout from "./common/Layout";
import Home from "./pages/Home";
import Message from "./pages/messaging/Message";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthGuard, LogGuard } from "./common/Gaurd";
import './App.css'
import Register from "./pages/auth/Register";
import RegisterOtp from "./pages/auth/RegisterOtp";
import PageNotFound from "./pages/PageNotFound";
import CheckEmail from "./pages/auth/CheckEmail";
import VerifyEmailReminder from "./pages/auth/VerifyEmailReminder";
import ForgotPassword from "./pages/auth/forgotPassword/ForgotPassword";
function App() {
  const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";

  const router = createBrowserRouter([
    {
      path: "/check-email",
      element: (
        <LogGuard>
          <CheckEmail />
        </LogGuard >)
    },
    {
      path: "/",
      element: (
        <LogGuard>
          <Login />
        </LogGuard>
      ),
    },
    {
      path: "/sign-up",
      element: (
        <LogGuard>
          <Register />
        </LogGuard>
      ),
    },
    {
      path: "/verify-email",
      element: (
        <LogGuard>
          <RegisterOtp />
        </LogGuard>
      ),
    },
    {
      path: "/resend-email",
      element: (
        <LogGuard>
          <VerifyEmailReminder />
        </LogGuard>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <LogGuard>
          <ForgotPassword />
        </LogGuard>
      ),
    },
    {
      path: "/home",
      element: (
        <AuthGuard>
          <Layout />
        </AuthGuard>
      ),
      children: [
        { path: "", element: <Home /> },
        { path: "messaging", element: <Message /> },
        // {
        //   path: "find",
        //   children: [
        //     {path: "", element: <FindMyself /> },
        //     {path: "result", element: <ResultScreen /> },
        //     {path: "album/:id", element: <AlbumDetail /> }
        //   ],
        // },
      ]
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ], {
    basename: basePath,
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;