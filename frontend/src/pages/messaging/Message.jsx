import {
    Box, IconButton, Drawer
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import LeftSideBar from '../../components/messaging/LeftSideBar';
import RightSide from '../../components/messaging/RightSide';

const Message = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [open, setOpen] = useState(false);

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
                    <LeftSideBar />
                </Drawer>
            )}
            {!isMobile && <LeftSideBar />}
            <RightSide isMobile={isMobile} toggleDrawer={toggleDrawer} />
        </Box>
    );
};

export default Message;