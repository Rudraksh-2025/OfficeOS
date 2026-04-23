import React, { useEffect, useRef } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../services/socket";
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useGetMessages } from '../../Api/Api';


const MessageList = ({ channelId }) => {
    const queryClient = useQueryClient();


    useEffect(() => {
        const socket = getSocket();

        const handleMessage = (msg) => {
            if (msg.channelId === channelId) {
                queryClient.setQueryData(
                    ["getMessages", channelId],
                    (old = []) => {
                        if (!Array.isArray(old)) return old;

                        // remove optimistic message if exists
                        console.log(old)
                        const filtered = old.filter(m => !m.optimistic);

                        // prevent duplicates
                        if (filtered.find(m => m._id === msg._id)) return filtered;
                        console.log(filtered)

                        return [...filtered, msg];
                    }
                );
            }
        };

        socket.on("receive_message", handleMessage);

        return () => socket.off("receive_message", handleMessage);
    }, [channelId, queryClient]);

    return null;
};

const MessageArea = ({ channelId }) => {
    const { data: messagesData, isLoading } = useGetMessages(channelId, { enabled: !!channelId });
    const scrollRef = useRef();
    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messagesData]);

    let messages = [];
    if (messagesData) {
        if (messagesData.pages) {
            messagesData.pages.forEach(p => {
                if (p.results) {
                    messages.push(...p.results);
                }
            });
            // messages are usually newest last from infinite queries if configured to prepend, otherwise sort
        } else if (Array.isArray(messagesData)) {
            messages = [...messagesData];
        }
    }

    // fallback for empty display
    const finalMessages = messages.length > 0 ? messages : [];



    return (
        <>
            <MessageList channelId={channelId} />
            <Box
                ref={scrollRef}
                sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}
                className="custom-scroll"
            >
                {finalMessages.map((msg, i) => {

                    const senderId =
                        typeof msg.senderId === "object"
                            ? msg.senderId._id
                            : msg.senderId;
                    const isOwnMessage = senderId === currentUserId;
                    return (
                        <Box key={msg._id || msg.id || i} sx={{ display: 'flex', flexDirection: 'column', alignItems: isOwnMessage ? 'flex-end' : 'flex-start' }}>
                            {msg.edited && (
                                <Typography sx={{ fontSize: '11px', color: '#A1A1AA', mb: 0.5, mr: 1 }}>Edited</Typography>
                            )}
                            {!isOwnMessage && (
                                <Typography sx={{ fontSize: 12, color: '#A1A1AA', pb: 0.5 }}>
                                    {msg?.senderId?.name || msg?.senderName || "User"}
                                </Typography>
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
                                            {msg.filename || "Attachment"}
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
                                <MessageBubble isOwnMessage={isOwnMessage}>
                                    {msg.content}
                                </MessageBubble>
                            )}


                            {(msg.time || msg.createdAt) && (
                                <Typography sx={{ fontSize: '11px', color: '#71717A', mt: 0.5, mr: 1 }}>
                                    {msg.time || new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Typography>
                            )}
                        </Box>
                    )
                })
                }
            </Box>
        </>
    )
}

export default MessageArea;

const MessageBubble = styled(Box)(({ theme, isOwnMessage }) => ({
    backgroundColor: isOwnMessage ? '#7C3AED' : '#3F3F46',
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