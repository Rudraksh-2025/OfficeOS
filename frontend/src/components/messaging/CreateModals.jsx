import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useAddChannel, useCreateGroup, useCreateDm } from '../../Api/Api';

export const CreateChannelModal = ({ open, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('PUBLIC');
    const { mutate: addChannel, isPending } = useAddChannel(
        () => {
            onSuccess();
            onClose();
        },
        (err) => console.error(err)
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Channel</DialogTitle>
            <DialogContent>
                <TextField 
                    fullWidth 
                    label="Channel Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    margin="normal" 
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Type</InputLabel>
                    <Select value={type} onChange={e => setType(e.target.value)} label="Type">
                        <MenuItem value="PUBLIC">Public</MenuItem>
                        <MenuItem value="PRIVATE">Private</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: '#fff' }}>Cancel</Button>
                <Button variant="contained" onClick={() => addChannel({ name, type })} disabled={!name || isPending}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export const CreateGroupModal = ({ open, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [membersInput, setMembersInput] = useState('');
    const { mutate: createGroup, isPending } = useCreateGroup(
        () => {
            onSuccess();
            onClose();
        },
        (err) => console.error(err)
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Group</DialogTitle>
            <DialogContent>
                <TextField 
                    fullWidth 
                    label="Group Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    margin="normal" 
                />
                <TextField 
                    fullWidth 
                    label="Member User IDs (comma separated)" 
                    value={membersInput} 
                    onChange={e => setMembersInput(e.target.value)} 
                    margin="normal" 
                    helperText="Enter valid user IDs separated by commas"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: '#fff' }}>Cancel</Button>
                <Button variant="contained" onClick={() => {
                    const members = membersInput.split(',').map(m => m.trim()).filter(m => m);
                    createGroup({ name, members });
                }} disabled={!name || !membersInput || isPending}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export const CreateDmModal = ({ open, onClose, onSuccess }) => {
    const [userId, setUserId] = useState('');
    const { mutate: createDm, isPending } = useCreateDm(
        () => {
            onSuccess();
            onClose();
        },
        (err) => console.error(err)
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Start Direct Message</DialogTitle>
            <DialogContent>
                <TextField 
                    fullWidth 
                    label="Target User ID" 
                    value={userId} 
                    onChange={e => setUserId(e.target.value)} 
                    margin="normal" 
                    helperText="Enter the valid user ID of the person you want to message"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} sx={{ color: '#fff' }}>Cancel</Button>
                <Button variant="contained" onClick={() => createDm({ userId })} disabled={!userId || isPending}>Start</Button>
            </DialogActions>
        </Dialog>
    );
};
