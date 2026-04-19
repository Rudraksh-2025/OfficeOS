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
    Avatar,
    Chip,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { menulist } from "./MenuList";
import { useTheme } from "@mui/material/styles";

const drawerWidth = 280;

const Sidebar = ({ isActive, setActive, sidebarRef }) => {
    const [currentMenu, setCurrentMenu] = useState("home");
    const location = useLocation();
    const nav = useNavigate();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch { return null; }
    })();

    useEffect(() => {
        const currentPath = location.pathname.split("/");
        setCurrentMenu(currentPath[2] ? currentPath[2] : currentPath[1]);
    }, [location]);

    const handleLogout = () => {
        localStorage.clear();
        nav("/sign-in");
    };

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* ── Logo ── */}
            <Toolbar sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                pt: 2.5,
                pb: 1.5,
                px: 2.5,
                minHeight: '72px !important',
            }}>
                <Box sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: 16,
                    color: '#fff',
                    flexShrink: 0,
                }}>
                    O
                </Box>
                <Box>
                    <Typography sx={{
                        fontSize: '18px',
                        fontWeight: 700,
                        color: '#F1F5F9',
                        letterSpacing: '-0.3px',
                        lineHeight: 1.2,
                    }}>
                        OfficeOS
                    </Typography>
                    <Typography sx={{
                        fontSize: '11px',
                        color: '#64748B',
                        fontWeight: 500,
                        letterSpacing: '0.3px',
                    }}>
                        Unified Workspace
                    </Typography>
                </Box>
            </Toolbar>

            {/* ── Menu List ── */}
            <List sx={{
                flex: 1,
                overflowY: 'auto',
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
                pt: 1,
                px: 1.5,
            }}>
                {menulist.map((group, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                        {/* Section Title */}
                        {group.section && (
                            <Typography
                                sx={{
                                    px: 1.5,
                                    pt: index === 0 ? 0.5 : 1.5,
                                    pb: 0.8,
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    letterSpacing: "1.5px",
                                    color: "rgba(148, 163, 184, 0.5)",
                                    textTransform: 'uppercase',
                                }}
                            >
                                {group.section}
                            </Typography>
                        )}

                        {/* Menu Items */}
                        {group.items.map((menu) => {
                            const isSelected = currentMenu === menu.id;
                            const IconComponent = menu.icon;
                            const isMui = typeof IconComponent !== 'function' || IconComponent.muiName;

                            return (
                                <ListItemButton
                                    key={menu.id}
                                    selected={isSelected}
                                    onClick={() =>
                                        menu.id === "logout" ? handleLogout() : nav(menu.path)
                                    }
                                    sx={{
                                        borderRadius: '10px',
                                        mb: 0.3,
                                        py: 0.9,
                                        px: 1.5,
                                        color: "#94A3B8",
                                        transition: 'all 0.2s ease',

                                        "&:hover": {
                                            background: "rgba(108, 92, 231, 0.08)",
                                            color: '#F1F5F9',
                                        },

                                        "&.Mui-selected": {
                                            background: "rgba(108, 92, 231, 0.15)",
                                            color: "#A29BFE",
                                            "&:hover": {
                                                background: "rgba(108, 92, 231, 0.2)",
                                            },
                                            "& .MuiListItemIcon-root": {
                                                color: "#A29BFE",
                                            },
                                        },
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: '36px', color: 'inherit' }}>
                                        {isMui ? (
                                            <IconComponent sx={{ fontSize: 20 }} />
                                        ) : (
                                            <IconComponent style={{ fontSize: 18 }} />
                                        )}
                                    </ListItemIcon>

                                    <ListItemText
                                        primary={
                                            <Typography sx={{ fontSize: "13.5px", fontWeight: isSelected ? 600 : 500 }}>
                                                {menu.name}
                                            </Typography>
                                        }
                                    />

                                    {menu.badge && (
                                        <Chip
                                            size="small"
                                            label={menu.badge}
                                            sx={{
                                                height: 20,
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                minWidth: 20,
                                                background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
                                                color: '#fff',
                                                '& .MuiChip-label': { px: 0.7 },
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            );
                        })}
                    </Box>
                ))}
            </List>

            {/* ── User Profile Card ── */}
            <Box sx={{
                p: 2,
                borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        background: 'rgba(108, 92, 231, 0.08)',
                    },
                }}
                    onClick={() => nav('/home/profile')}
                >
                    <Avatar
                        sx={{
                            width: 36,
                            height: 36,
                            background: 'linear-gradient(135deg, #00CEC9, #55EFC4)',
                            fontSize: 14,
                            fontWeight: 700,
                        }}
                    >
                        {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#F1F5F9',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {user?.full_name || 'User'}
                        </Typography>
                        <Typography sx={{
                            fontSize: '11px',
                            color: '#64748B',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                            {user?.email || 'user@office.com'}
                        </Typography>
                    </Box>
                    <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: '#22C55E',
                        flexShrink: 0,
                    }} />
                </Box>
            </Box>
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
                            background: "var(--bg-deep)",
                            color: "#fff",
                            borderRight: "1px solid rgba(255,255,255,0.06)",
                            boxSizing: "border-box",
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": { display: "none" },
                        }
                    }}
                >
                    {drawerContent}
                </Drawer>
            ) : (
                <Drawer
                    ref={sidebarRef}
                    variant="temporary"
                    open={isActive}
                    onClose={() => setActive(false)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: drawerWidth,
                            background: "var(--bg-deep)",
                            color: "#fff",
                            borderRight: "1px solid rgba(255,255,255,0.06)",
                            border: '0px',
                            boxSizing: "border-box",
                            scrollbarWidth: "none",
                            "&::-webkit-scrollbar": { display: "none" },
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
