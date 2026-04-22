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
                    (old = { pages: [] }) => {
                        // Assuming pagination wrapper (Infinite Query)
                        if (!old || !old.pages) return old;
                        
                        // We will mutate the first page
                        const firstPage = old.pages[0];
                        if (firstPage && firstPage.results) {
                            if (firstPage.results.find((m) => m._id === msg._id)) return old;
                            return {
                                ...old,
                                pages: [
                                    { ...firstPage, results: [...firstPage.results, msg] },
                                    ...old.pages.slice(1)
                                ]
                            };
                        } else {
                            // Non infinite query fallback
                            const oldArr = Array.isArray(old) ? old : [];
                            if (oldArr.find((m) => m._id === msg._id)) return old;
                            return [...oldArr, msg];
                        }
                    }
                );
            }
        };

        socket.on("receive_message", handleMessage);

        return () => socket.off("receive_message", handleMessage);
    }, [channelId, queryClient]);

    return null;
};

const mockMessages = [
    {
        id: 1,
        content: <>Hello there</>,
        time: '2 April 11:07 am',
        edited: true,
    },
    {
        id: 2,
        content: <>How Are you?</>,
        time: '7 April 10:37 am',
        edited: true,
    },
    {
        id: 3,
        content: <>I am fine</>,
        time: '7 April 4:58 pm'
    },
];

const MessageArea = ({ channelId }) => {
    // Note: useGetMessages was created in Api.jsx
    const { data: messagesData, isLoading } = useGetMessages(channelId, { enabled: !!channelId });
    const scrollRef = useRef();

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
    const finalMessages = messages.length > 0 ? messages : mockMessages;

    return (
        <>
            <MessageList channelId={channelId} />
            <Box 
                ref={scrollRef}
                sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }} 
                className="custom-scroll"
            >
                {finalMessages.map((msg, i) => (
                    <Box key={msg._id || msg.id || i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
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
                            <MessageBubble>
                                {msg.content}
                            </MessageBubble>
                        )}

                        {(msg.time || msg.createdAt) && (
                            <Typography sx={{ fontSize: '11px', color: '#71717A', mt: 0.5, mr: 1 }}>
                                {msg.time || new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        )}
                    </Box>
                ))}
            </Box>
        </>
    )
}

export default MessageArea;

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