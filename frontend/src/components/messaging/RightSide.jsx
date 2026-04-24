import { useState } from 'react';
import {
    Box, Typography, Avatar, IconButton, Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MessageArea from './MessageArea';
import MessageInput from './MessageInput';


const ChatArea = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    backgroundColor: '#27272A',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
    border: '1px solid #3F3F46',
}));

const RightSide = ({ isMobile, toggleDrawer, currentChannel }) => {

    const channelId = currentChannel ? currentChannel._id : null;

    if (!channelId && !currentChannel?.id) {
        return (
            <ChatArea sx={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, position: 'absolute', top: 0, left: 0 }}>
                        <IconButton onClick={toggleDrawer} sx={{ color: '#fff' }}>
                            <MenuIcon />
                        </IconButton>
                    </Box>
                )}
                <Typography sx={{ color: '#A1A1AA' }}>Select a chat to start messaging</Typography>
            </ChatArea>
        );
    }

    const activeChannelId = channelId || currentChannel.id;

    return (
        <ChatArea>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: { xs: 0, md: 3 },
                borderBottom: '1px solid #3F3F46',
                minHeight: '70px',
                position: 'relative'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '25%' }}>
                    {isMobile && (
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                            <IconButton onClick={toggleDrawer} sx={{ color: '#fff' }}>
                                <MenuIcon />
                            </IconButton>
                        </Box>
                    )}
                    <Avatar sx={{ width: 36, height: 36, mr: 1.5, bgcolor: '#fff' }}>
                        {currentChannel?.avatar || '💬'}
                    </Avatar>
                    <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#FFF' }}>
                        {currentChannel?.name || 'Chat'}
                    </Typography>
                    <IconButton size="small" sx={{ ml: 0.5, color: '#A1A1AA' }}>
                        <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', width: '25%', justifyContent: 'flex-end', gap: 0.5 }}>
                    <Button
                        startIcon={<PersonAddAltIcon fontSize="small" />}
                        sx={{ color: '#D4D4D8', textTransform: 'none', fontWeight: 600, minWidth: 0, mr: 1 }}
                    >
                        1
                    </Button>
                    <IconButton sx={{ color: '#D4D4D8' }}><SearchIcon fontSize="small" /></IconButton>
                    <IconButton sx={{ color: '#D4D4D8' }}><MoreHorizIcon fontSize="small" /></IconButton>
                </Box>
            </Box>

            {/* Messages Body */}
            <MessageArea channelId={activeChannelId} />

            {/* Input Area */}
            <MessageInput channelId={activeChannelId} />
        </ChatArea>
    )
}

export default RightSide;