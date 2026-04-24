import React, { useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "../../services/socket";
import { Box, InputBase, IconButton } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

const MessageInput = ({ channelId }) => {
    const [text, setText] = useState("");
    const queryClient = useQueryClient();

    const currentUserId = localStorage.getItem("userId");
    const currentUserName = localStorage.getItem("name");

    const sendMessage = () => {
        if (!text.trim()) return;

        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
            _id: tempId,
            tempId,
            content: text,
            channelId,
            optimistic: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),

            senderId: {
                _id: currentUserId,
                name: currentUserName
            }
        };

        // Optimistic UI
        queryClient.setQueryData(
            ["getMessages", channelId],
            (old = []) => [...old, tempMessage]
        );

        getSocket().emit("send_message", {
            channelId,
            content: text,
            tempId
        });

        setText("");
    };

    const handleTyping = (value) => {
        setText(value);

        const socket = getSocket();
        socket.emit("typing_start", { channelId });

        // debounce stop typing
        if (window.typingTimeout) clearTimeout(window.typingTimeout);

        window.typingTimeout = setTimeout(() => {
            socket.emit("typing_stop", { channelId });
        }, 1000);
    };

    return (
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
                    value={text}
                    onChange={(e) => handleTyping(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                    sx={{ flexGrow: 1, color: '#F4F4F5', p: 1, fontSize: '15px' }}
                />
                <Box sx={{ display: 'flex', color: '#A1A1AA', alignItems: 'center' }}>
                    <IconButton sx={{ color: 'inherit' }}><SentimentSatisfiedAltIcon fontSize="small" /></IconButton>
                    <IconButton sx={{ color: 'inherit' }}><AttachFileOutlinedIcon fontSize="small" /></IconButton>
                    <Box sx={{ width: '1px', height: '24px', bgcolor: '#3F3F46', mx: 0.5 }} />
                    <IconButton sx={{ color: 'inherit' }} onClick={sendMessage}><SendOutlinedIcon fontSize="small" /></IconButton>
                </Box>
            </Box>
        </Box>
    )
};

export default MessageInput;