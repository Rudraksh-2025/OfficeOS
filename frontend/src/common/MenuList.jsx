import {
    HomeOutlined,
    UploadOutlined,
    AppstoreOutlined,
    PictureOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
} from "@ant-design/icons";

const icons = {
    HomeOutlined,
    UploadOutlined,
    AppstoreOutlined,
    PictureOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
};

export const menulist = [
    {
        section: "HOME",
        items: [
            {
                id: "home",
                name: "User Home",
                path: "/home",
                icon: icons.HomeOutlined,
            },
        ],
    },

    {
        section: "FIND MYSELF",
        items: [
            {
                id: "find",
                name: "Find Your Photos",
                path: "/home/find",
                icon: icons.UploadOutlined,
            },
            {
                id: "results",
                name: "Past Identified Photos",
                path: "/home/results",
                icon: icons.PictureOutlined,
            },
        ],
    },

    {
        section: "MANAGEMENT",
        items: [
            {
                id: "categories",
                name: "Categories",
                path: "/home/categories",
                icon: icons.AppstoreOutlined,
            },
        ],
    },

    {
        section: "ACCOUNT",
        items: [
            {
                id: "profile",
                name: "My Profile",
                path: "/home/profile",
                icon: icons.UserOutlined,
            },
            {
                id: "settings",
                name: "Settings",
                path: "/home/settings",
                icon: icons.SettingOutlined,
            },
        ],
    },

    {
        section: "",
        items: [
            {
                id: "logout",
                name: "Logout",
                path: "/logout",
                icon: icons.LogoutOutlined,
            },
        ],
    },
];