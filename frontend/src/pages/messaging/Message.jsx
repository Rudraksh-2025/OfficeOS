import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState, useEffect } from 'react';
import { Box, Drawer } from '@mui/material';
import LeftSideBar from '../../components/messaging/LeftSideBar';
import RightSide from '../../components/messaging/RightSide';
import { initSocket, disconnectSocket } from '../../services/socket';

const Message = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(false);
    const [currentChannel, setCurrentChannel] = useState(null);

    useEffect(() => {
        initSocket();
        // optionally disconnect here if not needed globally
        // return () => { disconnectSocket(); }; 
    }, []);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{
            display: 'flex',
            height: 'calc(100vh - 100px)',
            color: '#F1F5F9'
        }}>
            {isMobile && (
                <Drawer
                    anchor="left"
                    open={open}
                    onClose={toggleDrawer}
                    PaperProps={{
                        sx: { width: 250 }
                    }}
                >
                    <LeftSideBar currentChannel={currentChannel} setCurrentChannel={setCurrentChannel} toggleDrawer={toggleDrawer} isMobile={isMobile} />
                </Drawer>
            )}
            {!isMobile && <LeftSideBar currentChannel={currentChannel} setCurrentChannel={setCurrentChannel} />}
            <RightSide isMobile={isMobile} toggleDrawer={toggleDrawer} currentChannel={currentChannel} />
        </Box>
    );
};

export default Message;