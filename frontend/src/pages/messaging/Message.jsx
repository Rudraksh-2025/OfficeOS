import {
    Box
} from '@mui/material';
import LeftSideBar from '../../components/messaging/LeftSideBar';
import RightSide from '../../components/messaging/RightSide';

const Message = () => {
    return (
        <Box sx={{
            display: 'flex',
            height: 'calc(100vh - 100px)',
            color: '#F1F5F9'
        }}>
            <LeftSideBar />
            <RightSide />
        </Box>
    );
};

export default Message;