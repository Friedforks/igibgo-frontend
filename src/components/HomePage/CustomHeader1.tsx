import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Avatar, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import LoginDialog from "./LoginDialog";
import axiosInstance from "../../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/UtilEntity/APIResponse.ts";
import { FUser } from "../../entity/FUser";
import ResponseCodes from "../../entity/UtilEntity/ResponseCodes.ts";
import { Description, Forum, Home, SmartDisplay } from "@mui/icons-material";
import { RegisterDialog1 } from "./RegisterDialog1";
import { RegisterDialog2 } from "./RegisterDialog2";
import {CustomBackdrop} from "../UtilComponents/CustomBackdrop.tsx";
import { Constants } from "../../utils/Constants.ts";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));

interface CustomHeader1Props {
    children: React.ReactNode;
}

type menuItemType = {
    text: string;
    icon: React.ReactNode;
    location: string;
};
const CustomHeader1: React.FC<CustomHeader1Props> = ({ children: content }) => {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    // check if user is logged in
    const [loginStatus, setLoginStatus] = useState(false);
    const [userInfo, setUserInfo] = useState<FUser>(
        localStorage.getItem("userInfo")
            ? JSON.parse(localStorage.getItem("userInfo") as string)
            : null,
    );
    useEffect(() => {
        axiosInstance
            .post("/fuser/checkLogin", 0, {
                params: {
                    token: localStorage.getItem("token"),
                },
            })
            .then((response: AxiosResponse<APIResponse<FUser>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    localStorage.setItem(
                        "userInfo",
                        JSON.stringify(response.data.data),
                    );
                    setUserInfo(response.data.data);
                    setLoginStatus(true);
                } else {
                    setLoginDialogOpen(true);
                    setLoginStatus(false);
                }
            });
    }, []);

    const handleUserAvatarClick = () => {
        const userId = userInfo?.userId;
        if (userId) {
            window.location.href = "/user/" + userId;
        } else {
            sweetAlert("Error", "You are not logged in", "error");
        }
    };

    const handleLogoutClick = () => {
        axiosInstance
            .post("/fuser/logout", 0, {
                params: {
                    token: localStorage.getItem("token"),
                },
            })
            .then((response: AxiosResponse<boolean>) => {
                if (response.data) {
                    localStorage.removeItem("token");
                    setLoginStatus(false);
                    location.reload();
                } else {
                    sweetAlert("Error!", "Logout failed!", "error");
                }
            });
    };

    const menuItems: menuItemType[] = [
        {
            text: "Home",
            icon: <Home />,
            location: "/",
        },
        {
            text: "Note",
            icon: <Description />,
            location: "/note",
        },
        {
            text: "Video",
            icon: <SmartDisplay />,
            location: "/video/search",
        },
        {
            text: "Forum",
            icon: <Forum />,
            location: "/forum/search",
        },
    ];

    const [backdropOpen, setBackdropOpen] = useState<boolean>(false);
    const [registerDialog1Open, setRegisterDialog1Open] =
        useState<boolean>(false);
    const [registerDialog2Open, setRegisterDialog2Open] =
        useState<boolean>(false);
    return (
        <>
            <CustomBackdrop open={backdropOpen}>
                <CircularProgress color="inherit" />
            </CustomBackdrop>

            {/* Dialog section */}
            <LoginDialog
                loginDialogOpen={loginDialogOpen}
                setLoginDialogOpen={setLoginDialogOpen}
                setRegisterDialog1Open={setRegisterDialog1Open}
            />

            <RegisterDialog1
                setLoginDialogOpen={setLoginDialogOpen}
                registerDialog1Open={registerDialog1Open}
                setRegisterDialog1Open={setRegisterDialog1Open}
                backdropOpen={backdropOpen}
                setBackdropOpen={setBackdropOpen}
                setRegisterDialog2Open={setRegisterDialog2Open}
                setLoginStatus={setLoginStatus}
            />

            <RegisterDialog2
                registerDialog2Open={registerDialog2Open}
                setRegisterDialog2Open={setRegisterDialog2Open}
                backdropOpen={backdropOpen}
                setBackdropOpen={setBackdropOpen}
            />

            {/* Header */}
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar position="fixed" open={drawerOpen}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(drawerOpen && { display: "none" }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            Welcome to Study Hive! (${Constants.version})
                        </Typography>
                        <div style={{ position: "absolute", right: "1rem" }}>
                            {!loginStatus && (
                                <>
                                    <Button
                                        color="inherit"
                                        onClick={() => {
                                            setLoginDialogOpen(true);
                                        }}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        color="inherit"
                                        onClick={() => {
                                            setRegisterDialog1Open(true);
                                        }}
                                    >
                                        Register
                                    </Button>
                                </>
                            )}
                            {loginStatus && (
                                <Box display="flex" alignItems="center">
                                    <div onClick={handleUserAvatarClick}>
                                        <Avatar
                                            alt="avatar"
                                            src={userInfo?.avatarUrl}
                                            sx={{ marginRight: "1vw" }}
                                        />
                                    </div>
                                    <div>{userInfo?.username}</div>
                                    <Button
                                        color="inherit"
                                        onClick={handleLogoutClick}
                                    >
                                        Logout
                                    </Button>
                                </Box>
                            )}
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={drawerOpen}>
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === "rtl" ? (
                                <ChevronRightIcon />
                            ) : (
                                <ChevronLeftIcon />
                            )}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <List>
                        {menuItems.map((item: menuItemType, index) => (
                            <ListItem
                                key={index}
                                disablePadding
                                sx={{ display: "block" }}
                                onClick={() => {
                                    window.location.href = item.location;
                                }}
                            >
                                <ListItemButton
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: drawerOpen
                                            ? "initial"
                                            : "center",
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: drawerOpen ? 3 : "auto",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{ opacity: drawerOpen ? 1 : 0 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    {content}
                </Box>
            </Box>
        </>
    );
};
export default CustomHeader1;
