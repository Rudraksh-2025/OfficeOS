import {
    Avatar,
    Box,
    Typography,
    IconButton,
    AppBar,
    Toolbar,
    InputBase,
    Badge,
    Tooltip,
} from "@mui/material";
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { menulist } from "./MenuList";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const drawerWidth = 280;

const Navbar = ({ setActive }) => {
    const [pageTitle, setPageTitle] = useState("Dashboard");
    const [isSubMenu, setIsSubMenu] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch { return null; }
    })();

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
            setPageTitle("Dashboard");
        }
    }, [location]);

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                ...(isMdUp && {
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                }),
                background: "rgba(11, 18, 32, 0.8)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                color: "#fff",
                boxShadow: "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <Toolbar sx={{
                justifyContent: "space-between",
                minHeight: '68px !important',
                px: { xs: 2, md: 3 },
            }}>
                {/* Left side */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {isSubMenu ? (
                        <IconButton onClick={() => nav(-1)} sx={{ color: '#94A3B8', mr: 0.5 }}>
                            <IoArrowBack size={20} />
                        </IconButton>
                    ) : (
                        !isMdUp && (
                            <IconButton sx={{ color: '#94A3B8', mr: 0.5 }} onClick={() => setActive(true)}>
                                <MenuIcon />
                            </IconButton>
                        )
                    )}
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontSize: { xs: '16px', sm: '18px' },
                                fontWeight: 700,
                                color: '#F1F5F9',
                                letterSpacing: '-0.3px',
                            }}
                        >
                            {pageTitle}
                        </Typography>
                        <Typography sx={{
                            fontSize: '12px',
                            color: '#64748B',
                            fontWeight: 400,
                            display: { xs: 'none', sm: 'block' },
                        }}>
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </Typography>
                    </Box>
                </Box>

                {/* Right side */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* Search */}
                    <Box sx={{
                        display: { xs: 'none', sm: 'flex' },
                        alignItems: 'center',
                        background: searchFocused ? 'rgba(108, 92, 231, 0.08)' : 'rgba(255,255,255,0.04)',
                        border: searchFocused ? '1px solid rgba(108, 92, 231, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '10px',
                        px: 1.5,
                        py: 0.5,
                        transition: 'all 0.3s ease',
                        width: searchFocused ? 280 : 200,
                    }}>
                        <SearchIcon sx={{ color: '#64748B', fontSize: 20, mr: 1 }} />
                        <InputBase
                            placeholder="Search..."
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            sx={{
                                color: '#F1F5F9',
                                fontSize: '13px',
                                flex: 1,
                                '& ::placeholder': { color: '#64748B', opacity: 1 },
                            }}
                        />
                        <Typography sx={{
                            fontSize: '10px',
                            color: '#64748B',
                            background: 'rgba(255,255,255,0.06)',
                            px: 0.8,
                            py: 0.2,
                            borderRadius: '4px',
                            fontWeight: 600,
                        }}>⌘K</Typography>
                    </Box>

                    {/* Notifications */}
                    <Tooltip title="Notifications">
                        <IconButton sx={{
                            color: '#94A3B8',
                            '&:hover': { background: 'rgba(108, 92, 231, 0.08)' },
                        }}>
                            <Badge
                                badgeContent={3}
                                sx={{
                                    '& .MuiBadge-badge': {
                                        background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        minWidth: 18,
                                        height: 18,
                                    }
                                }}
                            >
                                <NotificationsNoneOutlinedIcon sx={{ fontSize: 22 }} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* Settings */}
                    <Tooltip title="Settings">
                        <IconButton
                            sx={{
                                color: '#94A3B8',
                                display: { xs: 'none', md: 'flex' },
                                '&:hover': { background: 'rgba(108, 92, 231, 0.08)' },
                            }}
                            onClick={() => nav('/home/settings')}
                        >
                            <SettingsOutlinedIcon sx={{ fontSize: 22 }} />
                        </IconButton>
                    </Tooltip>

                    {/* User Avatar */}
                    <Avatar
                        sx={{
                            width: 34,
                            height: 34,
                            ml: 0.5,
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #00CEC9, #55EFC4)',
                            fontSize: 14,
                            fontWeight: 700,
                            transition: 'box-shadow 0.2s ease',
                            '&:hover': {
                                boxShadow: '0 0 0 2px rgba(0, 206, 201, 0.3)',
                            },
                        }}
                        onClick={() => nav('/home/profile')}
                    >
                        {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;