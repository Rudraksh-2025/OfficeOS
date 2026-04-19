import { useState, useEffect } from 'react';
import {
    Box, Typography, Avatar, AvatarGroup, LinearProgress,
    IconButton, Chip, Tooltip, Button
} from '@mui/material';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AddIcon from '@mui/icons-material/Add';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

/* ─── Mock Data ─── */
const stats = [
    {
        label: 'Unread Messages',
        value: '24',
        trend: '+12%',
        trendUp: true,
        icon: <ChatBubbleOutlineOutlinedIcon />,
        color: '#6C5CE7',
        bg: 'rgba(108, 92, 231, 0.12)',
    },
    {
        label: 'Meetings Today',
        value: '5',
        trend: '+2',
        trendUp: true,
        icon: <VideocamOutlinedIcon />,
        color: '#00CEC9',
        bg: 'rgba(0, 206, 201, 0.12)',
    },
    {
        label: 'Active Tasks',
        value: '18',
        trend: '-3',
        trendUp: false,
        icon: <AssignmentOutlinedIcon />,
        color: '#F59E0B',
        bg: 'rgba(245, 158, 11, 0.12)',
    },
    {
        label: 'Team Online',
        value: '32',
        trend: '85%',
        trendUp: true,
        icon: <GroupsOutlinedIcon />,
        color: '#22C55E',
        bg: 'rgba(34, 197, 94, 0.12)',
    },
];

const upcomingMeetings = [
    {
        id: 1,
        title: 'Sprint Planning',
        time: '10:00 AM',
        duration: '45 min',
        attendees: ['S', 'M', 'A', 'R'],
        type: 'Team',
        color: '#6C5CE7',
    },
    {
        id: 2,
        title: 'Design Review',
        time: '11:30 AM',
        duration: '30 min',
        attendees: ['J', 'K'],
        type: 'Review',
        color: '#00CEC9',
    },
    {
        id: 3,
        title: '1:1 with Manager',
        time: '2:00 PM',
        duration: '25 min',
        attendees: ['D'],
        type: 'Personal',
        color: '#F59E0B',
    },
    {
        id: 4,
        title: 'Client Presentation',
        time: '4:00 PM',
        duration: '60 min',
        attendees: ['T', 'L', 'N', 'P', 'R'],
        type: 'External',
        color: '#EF4444',
    },
];

const activityFeed = [
    { id: 1, user: 'Sarah Chen', action: 'commented on', target: 'Q4 Marketing Plan', time: '2 min ago', avatar: 'S', color: '#6C5CE7' },
    { id: 2, user: 'Mike Ross', action: 'completed task', target: 'API Documentation', time: '15 min ago', avatar: 'M', color: '#22C55E' },
    { id: 3, user: 'AI Assistant', action: 'generated summary for', target: 'Weekly Standup', time: '32 min ago', avatar: '🤖', color: '#00CEC9', isAI: true },
    { id: 4, user: 'Lisa Park', action: 'shared document', target: 'Design System v3', time: '1 hr ago', avatar: 'L', color: '#F59E0B' },
    { id: 5, user: 'HR System', action: 'approved leave for', target: 'David Kim (Dec 25-27)', time: '2 hr ago', avatar: '🏢', color: '#A29BFE', isSystem: true },
    { id: 6, user: 'Tom Wright', action: 'created project', target: 'Mobile App Redesign', time: '3 hr ago', avatar: 'T', color: '#EF4444' },
];

const tasksList = [
    { id: 1, title: 'Review pull request #482', priority: 'High', done: false, project: 'Backend API' },
    { id: 2, title: 'Update onboarding flow slides', priority: 'Medium', done: false, project: 'HR Portal' },
    { id: 3, title: 'Fix navigation bug on mobile', priority: 'High', done: true, project: 'Mobile App' },
    { id: 4, title: 'Prepare meeting notes template', priority: 'Low', done: false, project: 'Operations' },
    { id: 5, title: 'Deploy staging environment', priority: 'Medium', done: true, project: 'DevOps' },
];

const teamMembers = [
    { name: 'Sarah Chen', role: 'Product Lead', status: 'online', avatar: 'S', color: '#6C5CE7' },
    { name: 'Mike Ross', role: 'Engineer', status: 'online', avatar: 'M', color: '#00CEC9' },
    { name: 'Lisa Park', role: 'Designer', status: 'away', avatar: 'L', color: '#F59E0B' },
    { name: 'David Kim', role: 'HR Manager', status: 'online', avatar: 'D', color: '#22C55E' },
    { name: 'Tom Wright', role: 'Engineer', status: 'offline', avatar: 'T', color: '#EF4444' },
    { name: 'Anna Lee', role: 'Marketing', status: 'online', avatar: 'A', color: '#A29BFE' },
];

const weeklyChartData = [
    { day: 'Mon', messages: 65, meetings: 40 },
    { day: 'Tue', messages: 80, meetings: 55 },
    { day: 'Wed', messages: 45, meetings: 70 },
    { day: 'Thu', messages: 90, meetings: 45 },
    { day: 'Fri', messages: 70, meetings: 60 },
    { day: 'Sat', messages: 30, meetings: 15 },
    { day: 'Sun', messages: 20, meetings: 10 },
];

const quickActions = [
    { label: 'New Message', icon: <ChatBubbleOutlineOutlinedIcon />, color: '#6C5CE7', bg: 'rgba(108, 92, 231, 0.12)' },
    { label: 'Schedule Meeting', icon: <CalendarTodayOutlinedIcon />, color: '#00CEC9', bg: 'rgba(0, 206, 201, 0.12)' },
    { label: 'Create Task', icon: <AddIcon />, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
    { label: 'Invite Member', icon: <PersonAddOutlinedIcon />, color: '#22C55E', bg: 'rgba(34, 197, 94, 0.12)' },
    { label: 'Upload File', icon: <FolderOutlinedIcon />, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.12)' },
    { label: 'Ask AI', icon: <SmartToyOutlinedIcon />, color: '#A29BFE', bg: 'rgba(162, 155, 254, 0.12)' },
];

const priorityColors = {
    High: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)' },
    Medium: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
    Low: { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.12)' },
};

const statusColors = {
    online: '#22C55E',
    away: '#F59E0B',
    offline: '#64748B',
};

/* ─── Card Wrapper ─── */
const Card = ({ children, sx = {}, animate = true, ...props }) => (
    <Box
        sx={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            p: 3,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                borderColor: 'var(--border-strong)',
                transform: 'translateY(-2px)',
                boxShadow: 'var(--shadow-lg)',
            },
            '&::before': animate ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(108, 92, 231, 0.3), transparent)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
            } : {},
            '&:hover::before': animate ? { opacity: 1 } : {},
            ...sx,
        }}
        {...props}
    >
        {children}
    </Box>
);

/* ─── Section Header ─── */
const SectionHeader = ({ title, action, actionLabel = 'View All' }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 700, color: '#F1F5F9', letterSpacing: '-0.2px' }}>
            {title}
        </Typography>
        {action && (
            <Button
                endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
                sx={{
                    color: '#6C5CE7',
                    fontSize: '12px',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': { background: 'rgba(108, 92, 231, 0.08)' },
                }}
                onClick={action}
            >
                {actionLabel}
            </Button>
        )}
    </Box>
);

/* ─── Component ─── */
const Home = () => {
    const [animatedStats, setAnimatedStats] = useState(stats.map(() => 0));
    const [chartVisible, setChartVisible] = useState(false);
    const [checkedTasks, setCheckedTasks] = useState(
        tasksList.reduce((acc, t) => ({ ...acc, [t.id]: t.done }), {})
    );

    const user = (() => {
        try {
            return JSON.parse(localStorage.getItem("user") || "null");
        } catch { return null; }
    })();

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    })();

    useEffect(() => {
        const timer = setTimeout(() => setChartVisible(true), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const targets = stats.map(s => parseInt(s.value));
        const duration = 1200;
        const steps = 40;
        const interval = duration / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;
            const progress = Math.min(step / steps, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedStats(targets.map(t => Math.round(t * eased)));
            if (step >= steps) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const toggleTask = (id) => {
        setCheckedTasks(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
            {/* ── Welcome Banner ── */}
            <Box sx={{
                mb: 3,
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.15) 0%, rgba(0, 206, 201, 0.08) 100%)',
                border: '1px solid rgba(108, 92, 231, 0.15)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: -80,
                    right: -80,
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(108, 92, 231, 0.1) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <Box sx={{
                    position: 'absolute',
                    bottom: -60,
                    left: '30%',
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(0, 206, 201, 0.08) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Typography sx={{ fontSize: { xs: '22px', md: '28px' }, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.5px', mb: 0.5 }}>
                        {greeting}, {user?.full_name?.split(' ')[0] || 'there'} 👋
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#94A3B8', maxWidth: 500 }}>
                        You have <strong style={{ color: '#A29BFE' }}>5 meetings</strong> and <strong style={{ color: '#00CEC9' }}>8 tasks</strong> pending today. Here's your workspace overview.
                    </Typography>
                </Box>
            </Box>

            {/* ── Stat Cards ── */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: { xs: 1.5, md: 2 },
                mb: 3,
            }}>
                {stats.map((stat, i) => (
                    <Card key={i} sx={{
                        p: { xs: 2, md: 3 },
                        animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: `0 0 24px ${stat.color}15`,
                            borderColor: `${stat.color}30`,
                        },
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '12px',
                                background: stat.bg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: stat.color,
                                '& .MuiSvgIcon-root': { fontSize: 22 },
                            }}>
                                {stat.icon}
                            </Box>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.3,
                                fontSize: '11px',
                                fontWeight: 700,
                                color: stat.trendUp ? '#22C55E' : '#EF4444',
                                background: stat.trendUp ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                px: 0.8,
                                py: 0.3,
                                borderRadius: '6px',
                            }}>
                                {stat.trendUp ? <TrendingUpIcon sx={{ fontSize: 13 }} /> : <TrendingDownIcon sx={{ fontSize: 13 }} />}
                                {stat.trend}
                            </Box>
                        </Box>
                        <Typography sx={{ fontSize: { xs: '24px', md: '28px' }, fontWeight: 800, color: '#F1F5F9', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
                            {animatedStats[i]}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#64748B', fontWeight: 500, mt: 0.5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {stat.label}
                        </Typography>
                    </Card>
                ))}
            </Box>

            {/* ── Quick Actions ── */}
            <Box sx={{ mb: 3 }}>
                <SectionHeader title="Quick Actions" />
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(6, 1fr)' },
                    gap: 1.5,
                }}>
                    {quickActions.map((action, i) => (
                        <Box
                            key={i}
                            className="quick-action-btn"
                            sx={{
                                animation: `scaleIn 0.4s ease-out ${i * 0.06}s both`,
                            }}
                        >
                            <Box className="action-icon" sx={{ background: action.bg, color: action.color }}>
                                {action.icon}
                            </Box>
                            <span>{action.label}</span>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* ── Main Grid: Meetings + Activity + Chart ── */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
                gap: 2.5,
                mb: 3,
            }}>
                {/* Upcoming Meetings */}
                <Card sx={{ p: 0, '&:hover': { transform: 'none' } }}>
                    <Box sx={{ p: 3, pb: 0 }}>
                        <SectionHeader title="Upcoming Meetings" action={() => { }} />
                    </Box>
                    <Box sx={{ px: 2, pb: 2 }}>
                        {upcomingMeetings.map((meeting, i) => (
                            <Box
                                key={meeting.id}
                                className="meeting-card"
                                sx={{
                                    mb: 1,
                                    animation: `slideInLeft 0.4s ease-out ${i * 0.08}s both`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                }}
                            >
                                {/* Time indicator */}
                                <Box sx={{
                                    width: 4,
                                    height: 48,
                                    borderRadius: 2,
                                    background: meeting.color,
                                    flexShrink: 0,
                                }} />

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography sx={{ fontSize: '13.5px', fontWeight: 600, color: '#F1F5F9' }}>
                                            {meeting.title}
                                        </Typography>
                                        <Chip
                                            label={meeting.type}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                fontSize: '10px',
                                                fontWeight: 600,
                                                background: `${meeting.color}18`,
                                                color: meeting.color,
                                                '& .MuiChip-label': { px: 0.8 },
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748B', fontSize: '12px' }}>
                                            <AccessTimeIcon sx={{ fontSize: 13 }} />
                                            {meeting.time} · {meeting.duration}
                                        </Box>
                                    </Box>
                                </Box>

                                <AvatarGroup max={3} sx={{
                                    '& .MuiAvatar-root': {
                                        width: 26,
                                        height: 26,
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        border: '2px solid var(--bg-elevated)',
                                    },
                                }}>
                                    {meeting.attendees.map((a, j) => (
                                        <Avatar key={j} sx={{ background: `${meeting.color}40`, color: meeting.color }}>
                                            {a}
                                        </Avatar>
                                    ))}
                                </AvatarGroup>
                            </Box>
                        ))}
                    </Box>
                </Card>

                {/* Activity Feed */}
                <Card sx={{ p: 0, '&:hover': { transform: 'none' } }}>
                    <Box sx={{ p: 3, pb: 0 }}>
                        <SectionHeader title="Recent Activity" action={() => { }} />
                    </Box>
                    <Box sx={{ px: 3, pb: 2, maxHeight: 370, overflowY: 'auto' }} className="custom-scroll">
                        {activityFeed.map((item, i) => (
                            <Box
                                key={item.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: 1.5,
                                    py: 1.5,
                                    borderBottom: i < activityFeed.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                                    animation: `fadeInUp 0.4s ease-out ${i * 0.06}s both`,
                                }}
                            >
                                <Avatar sx={{
                                    width: 34,
                                    height: 34,
                                    fontSize: item.isAI || item.isSystem ? '16px' : '12px',
                                    fontWeight: 700,
                                    background: item.isAI || item.isSystem ? `${item.color}20` : `${item.color}30`,
                                    color: item.color,
                                    mt: 0.3,
                                }}>
                                    {item.avatar}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{ fontSize: '13px', color: '#CBD5E1', lineHeight: 1.5 }}>
                                        <span style={{ fontWeight: 600, color: '#F1F5F9' }}>
                                            {item.user}
                                        </span>{' '}
                                        {item.action}{' '}
                                        <span style={{ fontWeight: 600, color: '#A29BFE' }}>
                                            {item.target}
                                        </span>
                                    </Typography>
                                    <Typography sx={{ fontSize: '11px', color: '#64748B', mt: 0.3 }}>
                                        {item.time}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Card>
            </Box>

            {/* ── Bottom Grid: Tasks + Team + Chart ── */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                gap: 2.5,
            }}>
                {/* Tasks */}
                <Card sx={{ p: 0, '&:hover': { transform: 'none' } }}>
                    <Box sx={{ p: 3, pb: 0 }}>
                        <SectionHeader title="My Tasks" action={() => { }} />
                    </Box>
                    <Box sx={{ px: 2, pb: 2 }}>
                        {tasksList.map((task, i) => (
                            <Box
                                key={task.id}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    px: 1.5,
                                    py: 1.2,
                                    borderRadius: '10px',
                                    mb: 0.5,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    '&:hover': { background: 'rgba(255,255,255,0.03)' },
                                    animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
                                }}
                                onClick={() => toggleTask(task.id)}
                            >
                                <IconButton size="small" sx={{ p: 0, color: checkedTasks[task.id] ? '#22C55E' : '#64748B' }}>
                                    {checkedTasks[task.id] ?
                                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 20 }} /> :
                                        <RadioButtonUncheckedIcon sx={{ fontSize: 20 }} />
                                    }
                                </IconButton>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        color: checkedTasks[task.id] ? '#64748B' : '#F1F5F9',
                                        textDecoration: checkedTasks[task.id] ? 'line-through' : 'none',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        transition: 'color 0.2s ease',
                                    }}>
                                        {task.title}
                                    </Typography>
                                    <Typography sx={{ fontSize: '11px', color: '#64748B' }}>
                                        {task.project}
                                    </Typography>
                                </Box>
                                <Box sx={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    px: 0.8,
                                    py: 0.2,
                                    borderRadius: '5px',
                                    color: priorityColors[task.priority].color,
                                    background: priorityColors[task.priority].bg,
                                    flexShrink: 0,
                                }}>
                                    {task.priority}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Card>

                {/* Team */}
                <Card sx={{ p: 0, '&:hover': { transform: 'none' } }}>
                    <Box sx={{ p: 3, pb: 0 }}>
                        <SectionHeader title="Team Members" action={() => { }} />
                    </Box>
                    <Box sx={{ px: 2, pb: 2 }}>
                        {teamMembers.map((member, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    px: 1.5,
                                    py: 1.2,
                                    borderRadius: '10px',
                                    mb: 0.5,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                    '&:hover': { background: 'rgba(255,255,255,0.03)' },
                                    animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
                                }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar sx={{
                                        width: 36,
                                        height: 36,
                                        fontSize: '13px',
                                        fontWeight: 700,
                                        background: `${member.color}25`,
                                        color: member.color,
                                    }}>
                                        {member.avatar}
                                    </Avatar>
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        background: statusColors[member.status],
                                        border: '2px solid var(--bg-card)',
                                    }} />
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#F1F5F9' }}>
                                        {member.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: '11px', color: '#64748B' }}>
                                        {member.role}
                                    </Typography>
                                </Box>
                                <Tooltip title="Send message">
                                    <IconButton size="small" sx={{
                                        color: '#64748B',
                                        '&:hover': { color: '#6C5CE7', background: 'rgba(108, 92, 231, 0.08)' },
                                    }}>
                                        <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ))}
                    </Box>
                </Card>

                {/* Activity Chart */}
                <Card sx={{ p: 0, '&:hover': { transform: 'none' } }}>
                    <Box sx={{ p: 3, pb: 0 }}>
                        <SectionHeader title="Weekly Activity" />
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: 1, background: '#6C5CE7' }} />
                                <Typography sx={{ fontSize: '11px', color: '#94A3B8' }}>Messages</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Box sx={{ width: 8, height: 8, borderRadius: 1, background: '#00CEC9' }} />
                                <Typography sx={{ fontSize: '11px', color: '#94A3B8' }}>Meetings</Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{ px: 3, pb: 3 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: 1,
                            height: 180,
                        }}>
                            {weeklyChartData.map((data, i) => (
                                <Box key={i} sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    height: '100%',
                                    justifyContent: 'flex-end',
                                }}>
                                    <Box sx={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '100%' }}>
                                        <Box
                                            className="chart-bar"
                                            sx={{
                                                width: 14,
                                                height: chartVisible ? `${(data.messages / 100) * 150}px` : '0px',
                                                background: 'linear-gradient(180deg, #6C5CE7, #6C5CE780)',
                                                borderRadius: '4px 4px 2px 2px',
                                                transition: `height 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.08}s`,
                                            }}
                                        />
                                        <Box
                                            className="chart-bar"
                                            sx={{
                                                width: 14,
                                                height: chartVisible ? `${(data.meetings / 100) * 150}px` : '0px',
                                                background: 'linear-gradient(180deg, #00CEC9, #00CEC980)',
                                                borderRadius: '4px 4px 2px 2px',
                                                transition: `height 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.08 + 0.1}s`,
                                            }}
                                        />
                                    </Box>
                                    <Typography sx={{ fontSize: '10px', color: '#64748B', fontWeight: 500 }}>
                                        {data.day}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {/* Summary stats */}
                    <Box sx={{
                        px: 3,
                        pb: 3,
                        display: 'flex',
                        gap: 2,
                    }}>
                        <Box sx={{
                            flex: 1,
                            p: 1.5,
                            borderRadius: '10px',
                            background: 'rgba(108, 92, 231, 0.08)',
                            textAlign: 'center',
                        }}>
                            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#6C5CE7' }}>400</Typography>
                            <Typography sx={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>Total Messages</Typography>
                        </Box>
                        <Box sx={{
                            flex: 1,
                            p: 1.5,
                            borderRadius: '10px',
                            background: 'rgba(0, 206, 201, 0.08)',
                            textAlign: 'center',
                        }}>
                            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#00CEC9' }}>295</Typography>
                            <Typography sx={{ fontSize: '10px', color: '#94A3B8', fontWeight: 500 }}>Total Meetings</Typography>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </Box>
    );
};

export default Home;