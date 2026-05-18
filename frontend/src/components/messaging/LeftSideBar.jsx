import { useEffect, useState } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';
import {
    Box, Typography, Avatar, Badge, IconButton, Menu, MenuItem, Divider
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { styled } from '@mui/material/styles';
import { joinChannel, leaveChannel, getSocket } from "../../services/socket";
import { useGetChannel, useGetConversation } from "../../Api/Api";
import { useQueryClient } from "@tanstack/react-query";
import { CreateChannelModal, CreateGroupModal, CreateDmModal } from "./CreateModals";

const LeftSideBar = ({ currentChannel, setCurrentChannel }) => {
    const { data: channels = [] } = useGetChannel();
    const [typingMap, setTypingMap] = useState({});
    const { data: conversations = [] } = useGetConversation();
    const queryClient = useQueryClient();

    const [anchorEl, setAnchorEl] = useState(null);
    const [createType, setCreateType] = useState(null); // 'CHANNEL', 'GROUP', 'DM'

    useEffect(() => {
        if (currentChannel) {
            joinChannel(currentChannel._id);
        }
    }, [currentChannel]);

    useEffect(() => {
        const allChats = [...(Array.isArray(channels) ? channels : []), ...(Array.isArray(conversations) ? conversations : [])];
        allChats.forEach((chat) => {
            if (chat && chat._id) {
                joinChannel(chat._id);
            }
        });
    }, [channels, conversations]);

    useEffect(() => {
        const socket = getSocket();

        const handleNewConversation = (convo) => {
            queryClient.setQueryData(["getConversation"], (old = []) => {
                if (!Array.isArray(old)) return [convo];
                // avoid duplicates
                if (old.find(c => c._id === convo._id)) return old;

                return [convo, ...old]; // add on top
            });
        };

        socket.on("new_conversation", handleNewConversation);

        return () => socket.off("new_conversation", handleNewConversation);
    }, []);

    const handleCreateClick = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    const handleOpenModal = (type) => {
        setCreateType(type);
        handleCloseMenu();
    };

    const handleSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['getChanel'] });
        queryClient.invalidateQueries({ queryKey: ['getConversation'] });
    };

    const allChats = [...(Array.isArray(channels) ? channels : []), ...(Array.isArray(conversations) ? conversations : [])];


    useEffect(() => {
        const socket = getSocket();

        const handleTypingStart = ({ userId, channelId, name }) => {
            setTypingMap((prev) => {
                const existing = prev[channelId] ?? [];
                if (existing.some((u) => u.userId === userId)) return prev;
                return { ...prev, [channelId]: [...existing, { userId, name }] };
            });
        };

        const handleTypingStop = ({ userId, channelId }) => {
            setTypingMap((prev) => {
                const existing = prev[channelId] ?? [];
                return { ...prev, [channelId]: existing.filter((u) => u.userId !== userId) };
            });
        };

        socket.on("typing_start", handleTypingStart);
        socket.on("typing_stop", handleTypingStop);

        return () => {
            socket.off("typing_start", handleTypingStart);
            socket.off("typing_stop", handleTypingStop);
        };
    }, []);


    return (
        <SidebarContainer>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, ml: 1 }}>Chat</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconBtnItem size="small"><FilterListIcon fontSize="small" /></IconBtnItem>
                    <IconBtnItem size="small" onClick={handleCreateClick}><EditOutlinedIcon fontSize="small" /></IconBtnItem>
                </Box>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                PaperProps={{ sx: { bgcolor: '#27272A', color: '#fff', border: '1px solid #3F3F46' } }}
            >
                <MenuItem onClick={() => handleOpenModal('DM')}>New Direct Message</MenuItem>
                <MenuItem onClick={() => handleOpenModal('GROUP')}>New Group</MenuItem>
                <Divider sx={{ bgcolor: '#3F3F46' }} />
                <MenuItem onClick={() => handleOpenModal('CHANNEL')}>Create Channel</MenuItem>
            </Menu>

            <CreateChannelModal open={createType === 'CHANNEL'} onClose={() => setCreateType(null)} onSuccess={handleSuccess} />
            <CreateGroupModal open={createType === 'GROUP'} onClose={() => setCreateType(null)} onSuccess={handleSuccess} />
            <CreateDmModal open={createType === 'DM'} onClose={() => setCreateType(null)} onSuccess={handleSuccess} />

            {/* Lists Area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }} className="custom-scroll">
                <Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        {allChats.map((chat) => {
                            const isActive = currentChannel?._id === chat._id;
                            const name = chat.name || "Direct Message";

                            return (
                                <ChatListItem
                                    key={chat._id}
                                    active={isActive}
                                    onClick={() => setCurrentChannel(chat)}
                                >
                                    <Avatar sx={{ bgcolor: chat.type === 'PUBLIC' || chat.type === 'PRIVATE' ? '#6366F1' : '#3F3F46' }}>
                                        {name?.[0]?.toUpperCase() || 'U'}
                                    </Avatar>

                                    <Box sx={{ ml: 2, overflow: 'hidden' }}>
                                        <Typography sx={{ fontWeight: isActive ? 700 : 500, color: isActive ? '#FFF' : '#E4E4E7', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                            {name}
                                        </Typography>
                                        {(() => {
                                            const typingHere = typingMap[chat._id] ?? [];

                                            if (typingHere.length > 0) {
                                                return (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px', mt: '2px' }}>
                                                        <TypingBubble />
                                                        <Typography sx={{ fontSize: 12, color: '#A1A1AA' }}>
                                                            {typingHere.length === 1
                                                                ? `${typingHere[0].name} typing`
                                                                : `${typingHere.length} people typing`}
                                                        </Typography>
                                                    </Box>
                                                );
                                            }

                                            return (
                                                <Typography sx={{ fontSize: 12, color: '#A1A1AA', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                    {chat.lastMessage
                                                        ? chat.type === "DIRECT"
                                                            ? chat.lastMessage.content
                                                            : `${chat.lastMessage.senderName}: ${chat.lastMessage.content}`
                                                        : "No messages"}
                                                </Typography>
                                            );
                                        })()}
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


const TypingBubble = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
    </Box>
);