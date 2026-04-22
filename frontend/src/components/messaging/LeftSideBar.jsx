import { useEffect } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';
import {
    Box, Typography, Avatar, Badge, IconButton
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { styled } from '@mui/material/styles';
import { joinChannel, leaveChannel } from "../../services/socket";
import { useGetChannel } from "../../Api/Api";

const LeftSideBar = ({ currentChannel, setCurrentChannel }) => {
    const { data: channels = [], isLoading } = useGetChannel();
    useEffect(() => {
        if (!currentChannel) return;

        joinChannel(currentChannel._id);

        return () => {
            leaveChannel(currentChannel._id);
        };
    }, [currentChannel]);

    return (
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
                        {channels.map((channel) => {
                            const isActive = currentChannel?._id === channel._id;

                            return (
                                <ChatListItem
                                    key={channel._id}
                                    active={isActive}
                                    onClick={() => setCurrentChannel(channel)}
                                >
                                    <Avatar>
                                        {channel.name?.[0]?.toUpperCase()}
                                    </Avatar>

                                    <Box sx={{ ml: 2 }}>
                                        <Typography>{channel.name}</Typography>
                                        <Typography sx={{ fontSize: 12 }}>
                                            {channel.lastMessage?.content || "No messages"}
                                        </Typography>
                                    </Box>
                                </ChatListItem>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </SidebarContainer>
    );
};

export default LeftSideBar;

const SidebarContainer = styled(Box)(({ theme }) => ({
    width: 320,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    paddingRight: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        padding: '20px 10px',
    }
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
    { id: 1, name: 'John Stark', preview: 'Hey there how are you?...', time: '12:44 pm', avatar: 'JS', active: false },
    { id: 2, name: 'Tony Stark', preview: 'I will be There', time: '11:56 am', avatar: 'TS', hasIndicator: true, unread: true },
    { id: 3, name: 'Side Chick', preview: 'I wanna do it with thor', time: '11:03 am', avatar: 'SC' },
    { id: 4, name: 'Avengers Team', preview: 'Hulk: Good Morning', time: '10:33 am', avatar: 'AT' },
    { id: 5, name: 'Dragon', preview: 'KA', time: '10:32 am', avatar: 'D', isOnline: true },
    { id: 6, name: 'Arya Stark', preview: 'Where is my dragon?', time: '10:28 am', avatar: 'AS', isOffline: true },
];