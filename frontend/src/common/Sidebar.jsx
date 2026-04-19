import { useEffect, useState } from "react";
import {
    Drawer,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Box,
    Toolbar,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { menulist } from "./MenuList";
import logo4 from "../assets/images/icons.svg";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 340;

const Sidebar = ({ isActive, setActive, sidebarRef }) => {
    const [currentMenu, setCurrentMenu] = useState("home");
    const location = useLocation();
    const nav = useNavigate();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    useEffect(() => {
        const currentPath = location.pathname.split("/");
        setCurrentMenu(currentPath[2] ? currentPath[2] : currentPath[1]);
        if (location.pathname.startsWith("/reports")) {
            setOpenReports(true);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        nav("/sign-in");
    };


    const drawerContent = (
        <Box sx={{
            height: '100%',
        }}>
            {/* --- Logo --- */}
            <Toolbar sx={{ display: "flex", justifyContent: "center", pt: 1 }}>
                <Box component="img" src={logo4} alt="logo" sx={{ width: "40%" }} />
            </Toolbar>
            {/* --- Menu List --- */}
            <List sx={{
                height: '88vh', overflowY: 'auto', scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" }, pt: 4
            }}>
                {menulist.map((group, index) => (
                    <Box key={index} sx={{ mb: 2 }}>

                        {/* SECTION TITLE */}
                        {group.section && (
                            <Typography
                                sx={{
                                    px: 2,
                                    mb: 1,
                                    fontSize: "14px",
                                    letterSpacing: "1px",
                                    color: "rgba(255,255,255,0.4)",
                                    paddingBottom: "10px",
                                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                                }}
                            >
                                {group.section}
                            </Typography>
                        )}

                        {/* MENU ITEMS */}
                        {group.items.map((menu) => (
                            <ListItemButton
                                key={menu.id}
                                selected={currentMenu === menu.id}
                                onClick={() =>
                                    menu.id === "logout" ? handleLogout() : nav(menu.path)
                                }
                                sx={{
                                    borderRadius: 1,
                                    mx: 1,
                                    mb: 0.5,
                                    color: "#cbd5e1",

                                    "&:hover": {
                                        background: "rgba(255,255,255,0.05)",
                                    },

                                    "&.Mui-selected": {
                                        background:
                                            "linear-gradient(94.7deg, #352daf66 6.05%, #3b33f566 85.42%)",
                                        color: "#fff",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: '35px' }}>
                                    <menu.icon
                                        style={{ fontSize: 21, color: "white" }}
                                    />
                                </ListItemIcon>

                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: "16px" }}>
                                            {menu.name}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        ))}
                    </Box>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            {/* Permanent Sidebar on md+ */}
            {isMdUp ? (
                <Drawer
                    variant="permanent"
                    open

                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            background: "#0b1220",
                            color: "#fff",
                            borderRight: "1px solid rgba(255,255,255,0.1)",
                            boxSizing: "border-box",
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                // Temporary Drawer on xs/sm
                <Drawer
                    ref={sidebarRef}
                    variant="temporary"
                    open={isActive}
                    onClose={() => setActive(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: drawerWidth - 50,
                            background: "#0b1220",
                            color: "#fff",
                            borderRight: "1px solid rgba(255,255,255,0.1)",
                            border: '0px',
                            boxSizing: "border-box",
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": {
                                display: "none",
                            },
                        }
                    }}
                >
                    {drawerContent}
                </Drawer>
            )}
        </>
    );
};

export default Sidebar;
