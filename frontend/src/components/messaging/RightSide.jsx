import { useState } from 'react'
import {
    Box, Typography, Avatar, IconButton, InputBase, Button, Drawer
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

const mockMessages = [
    {
        id: 1,
        content: <>
            Hello there
        </>,
        time: '2 April 11:07 am',
        edited: true,
    },
    {
        id: 2,
        content: <>
            How Are you?
        </>,
        time: '7 April 10:37 am',
        edited: true,
    },
    {
        id: 3,
        content: <>
            I am fine
        </>,
        time: '7 April 4:58 pm'
    },
    {
        id: 4,
        type: 'file',
        filename: 'HelloWorld.pdf',
        time: ''
    }
];

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



const MessageBubble = styled(Box)(({ theme }) => ({
    backgroundColor: '#7C3AED', // Purple like the screenshot
    color: '#FFF',
    padding: '12px 16px',
    borderRadius: '16px',
    borderBottomRightRadius: '4px',
    maxWidth: '75%',
    wordBreak: 'break-word',
    fontSize: '14px',
    position: 'relative',
    '& a': {
        color: '#A78BFA',
        textDecoration: 'underline',
    }
}));


const RightSide = ({ isMobile, toggleDrawer }) => {
    // const [tabValue, setTabValue] = useState(0);

    return (
        <>
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
                        <Avatar sx={{ width: 36, height: 36, mr: 1.5, bgcolor: '#fff' }}>📝</Avatar>
                        <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#FFF' }}>Notes</Typography>
                        <IconButton size="small" sx={{ ml: 0.5, color: '#A1A1AA' }}>
                            <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                    </Box>

                    {/* <Box sx={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bottom: 0,
                    }}>
                        <Tabs
                            value={tabValue}
                            onChange={(e, val) => setTabValue(val)}
                            sx={{
                                minHeight: '20px',
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    color: '#A1A1AA',
                                    fontWeight: 500,
                                    fontSize: '15px',
                                    minWidth: 'auto',
                                    px: 2,
                                    '&.Mui-selected': { color: '#FFF' }
                                },
                                '& .MuiTabs-indicator': {
                                    backgroundColor: '#818CF8', 
                                    height: '3px',
                                    borderTopLeftRadius: '3px',
                                    borderTopRightRadius: '3px',
                                }
                            }}
                        >
                            <Tab label="Chat" />
                            <Tab label="Files" />
                            <Tab label="Photos" />
                        </Tabs>
                    </Box> */}

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
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }} className="custom-scroll">
                    {mockMessages.map((msg, i) => (
                        <Box key={msg.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            {msg.edited && (
                                <Typography sx={{ fontSize: '11px', color: '#A1A1AA', mb: 0.5, mr: 1 }}>Edited</Typography>
                            )}

                            {msg.type === 'file' ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        bgcolor: '#27272A',
                                        border: '1px solid #3F3F46',
                                        borderRadius: '12px',
                                        p: 1.5,
                                        mr: 1,
                                        gap: 1.5
                                    }}>
                                        <Box sx={{
                                            bgcolor: '#3F3F46',
                                            borderRadius: '8px',
                                            p: '8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#E04F26'
                                        }}>
                                            <AttachFileOutlinedIcon />
                                        </Box>
                                        <Typography sx={{ color: '#FFF', fontSize: '14px', fontWeight: 600 }}>
                                            {msg.filename}
                                        </Typography>
                                        <IconButton size="small" sx={{ color: '#A1A1AA', ml: 1 }}>
                                            <MoreHorizIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', border: '1px solid #6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#6366F1' }} />
                                    </Box>
                                </Box>
                            ) : (
                                <MessageBubble>
                                    {msg.content}
                                </MessageBubble>
                            )}

                            {msg.time && (
                                <Typography sx={{ fontSize: '11px', color: '#71717A', mt: 0.5, mr: 1 }}>
                                    {msg.time}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>

                {/* Input Area */}
                <Box sx={{ p: 3, pt: 1 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'transparent',
                        borderRadius: '12px',
                        border: '1px solid #52525B',
                        p: '4px 8px',
                        '&:focus-within': {
                            borderColor: '#71717A'
                        }
                    }}>
                        <InputBase
                            placeholder="Type a message"
                            sx={{ flexGrow: 1, color: '#F4F4F5', p: 1, fontSize: '15px' }}
                        />
                        <Box sx={{ display: 'flex', color: '#A1A1AA', alignItems: 'center' }}>
                            <IconButton sx={{ color: 'inherit' }}><SentimentSatisfiedAltIcon fontSize="small" /></IconButton>
                            <IconButton sx={{ color: 'inherit' }}><AttachFileOutlinedIcon fontSize="small" /></IconButton>
                            <Box sx={{ width: '1px', height: '24px', bgcolor: '#3F3F46', mx: 0.5 }} />
                            <IconButton sx={{ color: 'inherit' }}><SendOutlinedIcon fontSize="small" /></IconButton>
                        </Box>
                    </Box>
                </Box>
            </ChatArea>
        </>
    )
}

export default RightSide