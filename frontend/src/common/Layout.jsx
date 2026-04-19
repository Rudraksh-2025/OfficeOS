import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState, useRef, useEffect } from "react";
import { Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 280;

function Layout() {
    const [isActive, setActive] = useState(false);
    const sidebarRef = useRef();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    // Close sidebar when clicking outside (on small screens)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                window.innerWidth < 992 &&
                isActive &&
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setActive(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isActive]);

    return (
        <div style={{ display: "flex", background: "var(--bg-deep)", minHeight: "100vh" }}>
            {/* Sidebar */}
            <Sidebar
                setActive={setActive}
                isActive={isActive}
                sidebarRef={sidebarRef}
            />

            {/* Main Content */}
            <div
                style={{
                    flexGrow: 1,
                    width: isMdUp ? `calc(100% - ${drawerWidth}px)` : "100%",
                    background: "var(--bg-deep)",
                }}
            >
                <Navbar setActive={setActive} isActive={isActive} />
                <Toolbar sx={{ minHeight: '68px !important' }} />
                <div
                    style={{
                        overflowX: "hidden",
                        minHeight: "calc(100vh - 68px)",
                        padding: isMdUp ? '24px' : '16px',
                    }}
                >
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Layout;
