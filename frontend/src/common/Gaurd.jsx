/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom"

const parseStoredUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        return null;
    }
};

/** True when API user has explicit email_verified: false */
export const requiresEmailVerification = () => {
    const user = parseStoredUser();
    return Boolean(user && user.email_verified === false);
};

const isVerificationRoute = (pathname) =>
    pathname === "/verification" || pathname.endsWith("/verification");

export const AuthGuard = ({ children }) => {
    const auth = localStorage.getItem("accessToken");

    if (!auth) {
        return <Navigate to="/" replace />;
    }

    if (requiresEmailVerification()) {
        const user = parseStoredUser();
        return (
            <Navigate
                to="/verification"
                replace
                state={{ email: user?.email, fromLogin: true }}
            />
        );
    }

    return children;
};

export const LogGuard = ({ children }) => {
    const auth = localStorage.getItem("accessToken");
    const location = useLocation();
    const onVerification = isVerificationRoute(location.pathname);

    if (!auth) {
        return children;
    }

    if (requiresEmailVerification()) {
        if (onVerification) {
            return children;
        }
        const user = parseStoredUser();
        return (
            <Navigate
                to="/verification"
                replace
                state={{ email: user?.email, fromLogin: true }}
            />
        );
    }

    if (onVerification) {
        return <Navigate to="/home" replace />;
    }

    return <Navigate to="/home" replace />;
};
