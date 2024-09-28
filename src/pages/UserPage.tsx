import { useParams } from "react-router-dom";
import { FUser } from "../entity/FUser";
import { useEffect, useState } from "react";
import { Box, Grid, Skeleton, Tab } from "@mui/material";
import axiosInstance from "../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/UtilEntity/APIResponse.ts";
import { ShortUserInfoDisplay } from "../components/UtilComponents/ShortUserInfoDisplay.tsx";
import { TabContext, TabList } from "@mui/lab";
import { Note } from "../entity/Note/Note.ts";
import { UserNotesTab } from "../components/UserPage/UserNotesTab";
import { UserBookmarkTab } from "../components/UserPage/UserBookmarkTab";
import { UserVideoTab } from "../components/UserPage/UserVideosTab.tsx";
import { Video } from "../entity/Video/Video.ts";
import { UserSettingsTab } from "../components/UserPage/UserSettingsTab.tsx";

export const UserPage = () => {
    const params = useParams();
    const currentUserId = params.userId as unknown as number;
    const savedUserId = (
        JSON.parse(localStorage.getItem("userInfo") as string) as FUser
    ).userId;
    const isCurrentUser = currentUserId == savedUserId;
    const [user, setUser] = useState<FUser>();
    const [tabPage, setTabPage] = useState<string>("1");
    const [noteList, setNoteList] = useState<Note[]>([]);
    const [videoList, setVideoList] = useState<Video[]>([]);
    useEffect(() => {
        // console.log("debug: currentUserId", currentUserId);
        // console.log("debug: isCurrentUser", isCurrentUser);
        // console.log("debug: savedUserId", savedUserId);
        axiosInstance
            .get("/fuser/userId", {
                params: {
                    userId: currentUserId,
                    token: localStorage.getItem("token"),
                },
            })
            .then((response: AxiosResponse<APIResponse<FUser>>) => {
                setUser(response.data.data);
            });
        getNotes();
        getCurrentUser();
        getVideos();
    }, [currentUserId]);

    const getCurrentUser = () => {
        axiosInstance
            .get("/fuser/userId", {
                params: {
                    userId: currentUserId,
                    token: localStorage.getItem("token"),
                },
            })
            .then((response: AxiosResponse<APIResponse<FUser>>) => {
                setUser(response.data.data);
            });
    };

    const getNotes = () => {
        axiosInstance
            .get("/note/get/all", { params: { userId: currentUserId } })
            .then((response: AxiosResponse<APIResponse<Note[]>>) => {
                setNoteList(response.data.data);
            });
        console.log("debug: noteList", noteList);
    };
    const getVideos = () => {
        axiosInstance
            .get("/video/get/by/userId", { params: { userId: currentUserId } })
            .then((response: AxiosResponse<APIResponse<Video[]>>) => {
                setVideoList(response.data.data);
            });
    };

    const handleChange = (_event: React.SyntheticEvent, newTabPage: string) => {
        setTabPage(newTabPage);
    };

    if (user == undefined) {
        return <Skeleton></Skeleton>;
    }

    return (
        <>
            <div>
                <Grid
                    container
                    style={{
                        paddingLeft: "5%",
                        paddingTop: "2%",
                        paddingRight: "5%",
                    }}
                    direction="column"
                    spacing={3}
                >
                    <Grid item xs={2}>
                        <ShortUserInfoDisplay
                            userId={user?.userId}
                            dataUpdateRequired={false}
                            avatarSize={70}
                        />
                    </Grid>
                    <Grid item>
                        <Box sx={{ typography: "body1" }}>
                            <TabContext value={tabPage}>
                                <Box
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: "divider",
                                    }}
                                >
                                    <TabList
                                        onChange={handleChange}
                                        aria-label="lab API tabs example"
                                    >
                                        <Tab label="Notes" value="1" />
                                        <Tab label="Videos" value="2" />
                                        {/* <Tab label="Posts" value="3" /> */}
                                        {isCurrentUser && (
                                            <Tab label="Bookmarks" value="4" />
                                        )}
                                        {isCurrentUser && (
                                            <Tab
                                                label="User settings"
                                                value="5"
                                            />
                                        )}
                                    </TabList>
                                </Box>
                                <UserNotesTab noteList={noteList} />
                                <UserVideoTab videos={videoList} />
                                {/* <TabPanel value="2">Item Two</TabPanel> */}
                                {/* <TabPanel value="3">Item Three</TabPanel> */}
                                <UserBookmarkTab userId={currentUserId} />
                                <UserSettingsTab />
                            </TabContext>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </>
    );
};
