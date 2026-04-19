import {
    HomeOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
} from "@ant-design/icons";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

export const menulist = [
    {
        section: "OVERVIEW",
        items: [
            {
                id: "home",
                name: "Dashboard",
                path: "/home",
                icon: HomeOutlined,
            },
            {
                id: "analytics",
                name: "Analytics",
                path: "/home/analytics",
                icon: InsightsOutlinedIcon,
            },
        ],
    },

    {
        section: "COLLABORATE",
        items: [
            {
                id: "messaging",
                name: "Messaging",
                path: "/home/messaging",
                icon: ChatBubbleOutlineOutlinedIcon,
                badge: 5,
            },
            {
                id: "meetings",
                name: "Meetings",
                path: "/home/meetings",
                icon: VideocamOutlinedIcon,
            },
            {
                id: "tasks",
                name: "Tasks & Projects",
                path: "/home/tasks",
                icon: AssignmentOutlinedIcon,
                badge: 3,
            },
            {
                id: "documents",
                name: "Documents",
                path: "/home/documents",
                icon: FolderOutlinedIcon,
            },
        ],
    },

    {
        section: "PEOPLE",
        items: [
            {
                id: "hr",
                name: "HR Management",
                path: "/home/hr",
                icon: BadgeOutlinedIcon,
            },
            {
                id: "team",
                name: "Team Directory",
                path: "/home/team",
                icon: GroupsOutlinedIcon,
            },
            {
                id: "calendar",
                name: "Calendar",
                path: "/home/calendar",
                icon: EventNoteOutlinedIcon,
            },
        ],
    },

    {
        section: "AI",
        items: [
            {
                id: "ai-assistant",
                name: "AI Assistant",
                path: "/home/ai-assistant",
                icon: SmartToyOutlinedIcon,
            },
        ],
    },

    {
        section: "",
        items: [
            {
                id: "profile",
                name: "My Profile",
                path: "/home/profile",
                icon: UserOutlined,
            },
            {
                id: "settings",
                name: "Settings",
                path: "/home/settings",
                icon: SettingOutlined,
            },
            {
                id: "logout",
                name: "Logout",
                path: "/logout",
                icon: LogoutOutlined,
            },
        ],
    },
];