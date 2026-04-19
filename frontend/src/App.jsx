import Login from "./pages/auth/Login";
import Layout from "./common/Layout";
import Home from "./pages/Home";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthGuard, LogGuard } from "./common/Gaurd";
import './App.css'
import Register from "./pages/auth/Register";
import RegisterOtp from "./pages/auth/RegisterOtp";
function App() {
  const basePath = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/sign-in" replace />,
    },
    {
      path: "/sign-in",
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
      path: "/verification",
      element: (
        <LogGuard>
          <RegisterOtp />
        </LogGuard>
      ),
    },
    {
      path: "/home",
      element: (
        // <AuthGuard> 
        <Layout />
        // </AuthGuard>
      ),
      children: [
        { path: "", element: <Home /> },
        // {
        //   path: "find",
        //   children: [
        //     { path: "", element: <FindMyself /> },
        //     { path: "result", element: <ResultScreen /> },
        //     { path: "album/:id", element: <AlbumDetail /> }
        //   ],
        // },
      ]
    },
    {
      path: "*",
      element: <Navigate to="/sign-in" replace />,
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