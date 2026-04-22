import FilterListIcon from '@mui/icons-material/FilterList';
import {
    Box, Typography, Avatar, Badge, IconButton
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { styled } from '@mui/material/styles';

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 320,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingRight: theme.spacing(2),
}));
const IconBtnItem = styled(IconButton)(({ theme }) => ({
    border: '1px solid #3F3F46',
    borderRadius: '8px',
    padding: '6px',
    color: '#D4D4D8',
    backgroundColor: 'rgba(255,255,255,0.02)',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,0.08)',
    }
}));

const ChatListItem = styled(Box)(({ active }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '12px',
    cursor: 'pointer',
    backgroundColor: active ? '#27272A' : 'transparent',
    border: active ? '1px solid #3F3F46' : '1px solid transparent',
    transition: 'all 0.2s',
    '&:hover': {
        backgroundColor: '#27272A',
    }
}));
/* ─── Mock Data ─── */
const recentChats = [
    { id: 1, name: 'John Stark', preview: 'Hey there how are you?...', time: '12:44 pm', avatar: 'HD', active: false },
    { id: 2, name: 'Tony Stark', preview: 'I will be There', time: '11:56 am', avatar: 'W', hasIndicator: true, unread: true },
    { id: 3, name: 'Side Chick', preview: 'I wanna do it with thor', time: '11:03 am', avatar: 'F' },
    { id: 4, name: 'Avengers Team', preview: 'Hulk: Good Morning', time: '10:33 am', avatar: 'C' },
    { id: 5, name: 'Dragon', preview: 'KA', time: '10:32 am', avatar: 'KM', isOnline: true },
    { id: 6, name: 'Arya Stark', preview: 'Where is my dragon?', time: '10:28 am', avatar: 'DD', isOffline: true },
];

const LeftSideBar = () => {
    return (
        <>
            {/* ─── Left Sidebar ─── */}
            <SidebarContainer>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, ml: 1 }}>Chat</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconBtnItem size="small"><FilterListIcon fontSize="small" /></IconBtnItem>
                        <IconBtnItem size="small"><EditOutlinedIcon fontSize="small" /></IconBtnItem>
                    </Box>
                </Box>

                {/* Lists Area */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }} className="custom-scroll">
                    <Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {recentChats.map((chat) => (
                                <ChatListItem key={chat.id} active={chat.active}>
                                    <Box sx={{ position: 'relative', mr: 2 }}>
                                        {chat.hasIndicator && (
                                            <Box sx={{ position: 'absolute', left: -10, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', bgcolor: '#E4E4E7' }} />
                                        )}
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            variant="dot"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    backgroundColor: chat.isOnline ? '#22C55E' : chat.isOffline ? '#A1A1AA' : chat.unread ? '#EAB308' : 'transparent',
                                                    color: chat.isOnline ? '#22C55E' : chat.isOffline ? '#A1A1AA' : chat.unread ? '#EAB308' : 'transparent',
                                                    boxShadow: '0 0 0 2px var(--bg-deep)',
                                                    display: (chat.isOnline || chat.isOffline || chat.unread) ? 'flex' : 'none'
                                                }
                                            }}
                                        >
                                            <Avatar sx={{ width: 40, height: 40, bgcolor: '#3F3F46', fontSize: '15px', fontWeight: 600 }}>
                                                {chat.avatar}
                                            </Avatar>
                                        </Badge>
                                    </Box>
                                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ fontSize: '15px', fontWeight: chat.unread ? 700 : 500, color: chat.unread ? '#FFF' : '#E4E4E7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {chat.name}
                                            </Typography>
                                            <Typography sx={{ fontSize: '11px', color: '#A1A1AA', ml: 1, flexShrink: 0 }}>
                                                {chat.time}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontSize: '13px', color: '#A1A1AA', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {chat.preview}
                                        </Typography>
                                    </Box>
                                </ChatListItem>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </SidebarContainer>
        </>
    )
}

export default LeftSideBar