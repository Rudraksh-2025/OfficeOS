/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom"
// import { useAuth } from "../context/AuthContext"
// import { superadmin_menulist } from "./MenuList"

// const findPathRecursive = (menus) => {
//     for (const menu of menus) {

//         if (menu.path && menu.path !== "/logout") {
//             return menu.path;
//         }

//         if (menu.children) {
//             const childPath = findPathRecursive(menu.children);
//             if (childPath) return childPath;
//         }
//     }
//     return null;
// };

// const getRouteFromPermissionKey = (key) => {
//     const menu = superadmin_menulist.find(
//         (m) => m.permissionKey === key
//     );

//     if (!menu) return "/home";

//     const path = findPathRecursive([menu]);

//     return path || "/home";
// };

// const getFirstAllowedRoute = (allowedKeys) => {
//     for (const key of allowedKeys) {
//         const route = getRouteFromPermissionKey(key);
//         if (route && route !== "/home") return route;
//     }
//     return "/home";
// };

export const AuthGuard = ({ children }) => {
    const auth = localStorage.getItem("token")

    if (auth) {
        return children
    }

    else {
        return <Navigate to="/" />
    }
}

export const LogGuard = ({ children }) => {
    const auth = localStorage.getItem("token")

    if (!auth) {
        return children
    }

    else {
        return <Navigate to="/home" />
    }
}


// export const PermissionGuard = ({ children, requiredKey }) => {
//     const auth = localStorage.getItem("token");
//     const { allowedKeys } = useAuth();

//     if (!auth) return <Navigate to="/" replace />;

//     if (!requiredKey) return children;

//     if (allowedKeys.includes(requiredKey)) return children;

//     const firstAllowedRoute = getFirstAllowedRoute(allowedKeys);

//     return <Navigate to={firstAllowedRoute} replace />;
// };

