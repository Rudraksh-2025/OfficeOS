import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, InputLabel, FormControl, Autocomplete } from '@mui/material';
import { useAddChannel, useCreateGroup, useCreateDm } from '../../Api/Api';
import { toast } from 'sonner';
import { useGetWorkspaceUsers } from '../../Api/Api';

export const CreateChannelModal = ({ open, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('PUBLIC');
    const { mutate: addChannel, isPending } = useAddChannel(
        () => {
            onSuccess();
            onClose();
        },
        (err) => {
            toast.error(err.message)
            console.error(err)
        }
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
    const [selectedUsers, setSelectedUsers] = useState([]);
    const currentUserId = localStorage.getItem("userId");

    const { data: users = [] } = useGetWorkspaceUsers();

    const filteredUsers = users.filter(
        (u) => u._id !== currentUserId
    );

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
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                />

                <Autocomplete
                    multiple
                    options={filteredUsers}
                    getOptionLabel={(option) => option.name}
                    value={selectedUsers}
                    onChange={(e, newValue) => setSelectedUsers(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select Members" margin="normal" />
                    )}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={() =>
                        createGroup({
                            name,
                            members: selectedUsers.map((u) => u._id),
                        })
                    }
                    disabled={!name || selectedUsers.length === 0 || isPending}
                >
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export const CreateDmModal = ({ open, onClose, onSuccess }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const currentUserId = localStorage.getItem("userId");

    const { data: users = [] } = useGetWorkspaceUsers();

    const filteredUsers = users.filter(
        (u) => u._id !== currentUserId
    );

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
                <Autocomplete
                    options={filteredUsers}
                    getOptionLabel={(option) => option.name}
                    value={selectedUser}
                    onChange={(e, newValue) => setSelectedUser(newValue)}
                    renderInput={(params) => (
                        <TextField {...params} label="Select User" margin="normal" />
                    )}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={() => createDm({ userId: selectedUser._id })}
                    disabled={!selectedUser || isPending}
                >
                    Start
                </Button>
            </DialogActions>
        </Dialog>
    );
};
