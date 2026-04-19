import {
    Avatar,
    Box,
    Typography,
    IconButton,
    AppBar,
    Toolbar
} from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { menulist } from "./MenuList";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from '@mui/icons-material/Person';

const Navbar = ({ setActive }) => {
    const [pageTitle, setPageTitle] = useState("Dashboard");
    const [isSubMenu, setIsSubMenu] = useState(false);
    const [profileImg] = useState(localStorage.getItem('profileImg'))

    const location = useLocation();
    const nav = useNavigate();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    useEffect(() => {
        const pathParts = location.pathname.split("/").filter(Boolean);

        const parentId = pathParts[1];
        const allMenus = menulist.flatMap(section => section.items);
        const parentMenu = allMenus.find(menu => menu.id === parentId);

        const infoSegment = pathParts.find(part =>
            part.endsWith("-information") ||
            part.endsWith("-view") ||
            part.endsWith("-edit") ||
            part.startsWith("add-")
        );

        const isInfoPage = Boolean(infoSegment);

        if (isInfoPage) {
            setIsSubMenu(true);

            let subTitle = parentMenu?.name || "Details";
            setPageTitle(subTitle);
            return;
        }

        setIsSubMenu(false);

        if (parentMenu) {
            setPageTitle(parentMenu.name);
        } else {
            setPageTitle("User Home");
        }
    }, [location]);




    return (
        <AppBar
            position="fixed"
            sx={{
                ...(isMdUp && {
                    width: `calc(100% - 340px)`,
                    ml: "340px",
                }),
                background: "#0b1220",
                color: "#fff",
                boxShadow: "none",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
        >
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {isSubMenu ? (
                    <IconButton onClick={() => nav(-1)} sx={{ mr: 2 }}>
                        <IoArrowBack size={24} />
                    </IconButton>
                ) : (
                    !isMdUp && (
                        <IconButton sx={{ mr: 2, color: 'white' }} onClick={() => setActive(true)}>
                            <MenuIcon size={24} />
                        </IconButton>
                    )
                )}
                <Typography
                    variant="h5"
                    fontWeight={600}
                    // className="mb-0"
                    sx={{ flexGrow: 1, fontSize: { xs: '18px', sm: "24px" } }}
                >
                    {pageTitle}
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;