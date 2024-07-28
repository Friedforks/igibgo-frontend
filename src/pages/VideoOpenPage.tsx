import { AxiosResponse } from "axios";
import axiosInstance from "../utils/AxiosInstance";
import APIResponse from "../entity/APIResponse";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResponseCodes from "../entity/ResponseCodes";
import { Video } from "../entity/Video";
import {
    Avatar,
    Chip,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {
    Delete,
    Search,
    Send,
    Star,
    StarBorderOutlined,
    ThumbUp,
    ThumbUpOutlined,
    VisibilityOutlined
} from "@mui/icons-material";
import { formatDate } from "../utils/DateUtil";
import { ShortUserInfoDisplay } from "../components/UtilComponents/ShortUserInfoDisplay";
import { VideoReply } from "../entity/VideoReply";
import { checkLoginStatus, getUserInfo } from "../utils/LoginUtil";
import { VideoBookmarkDialog } from "../components/Video/VideoBookmarkDialog.tsx";

export const VideoOpenPage = () => {
    const params = useParams();
    const videoId = params.videoId;
    const [video, setVideo] = useState<Video>();
    const [userInfoDisplayUpdateFlag, setUserInfoDisplayUpdateFlag] =
        useState<boolean>(false);

    const getVideoByVideoId = async () => {
        axiosInstance
            .get("/video/get/videoId", {
                params: {
                    videoId: videoId,
                    userId: getUserInfo().userId
                }
            })
            .then((resp: AxiosResponse<APIResponse<Video>>) => {
                if (resp.data.code == ResponseCodes.SUCCESS) {
                    // format date
                    const rawDate = resp.data.data.uploadDate;
                    const formattedDate = formatDate(rawDate);
                    resp.data.data.uploadDate = formattedDate;
                    setVideo(resp.data.data);
                } else {
                    console.log(
                        "Error in get video by video id request: " +
                        resp.data.message
                    );
                }
            })
            .catch((error) => {
                console.log("Error in get video by video id request: " + error);
            });
    };
    const getLikeStatus = async () => {
        axiosInstance.get("/video/is/liked", {
            params: {
                videoId: videoId,
                userId: getUserInfo().userId
            }
        }).then((resp: AxiosResponse<APIResponse<boolean>>) => {
            if (resp.data.code == ResponseCodes.SUCCESS) {
                setIsLiked(resp.data.data);
            } else {
                console.log("Error in get like status request: " + resp.data.message);
            }
        });
    };

    const getSaveStatus=async ()=>{
        axiosInstance.get('/video/is/saved',{
        params:{
            videoId:videoId,
            userId: getUserInfo().userId,
        }}).then((resp:AxiosResponse<APIResponse<boolean>>)=>{
            if(resp.data.code==ResponseCodes.SUCCESS){setStarred(resp.data.data);}
            else{
                console.log("Error in get save status request: "+resp.data.message);
            }
        })
    }
    useEffect(() => {
        getLikeStatus();
        getSaveStatus();
        getVideoByVideoId();
    }, []);

    const navigate = useNavigate();
    const submitVideoTitleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // access the form data
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        // navigate to '/video/search?title=...'
        navigate(`/video/search?title=${title}`);
    };

    const [commentAreaValue, setCommentAreaValue] = useState<string>("");

    const submitComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        checkLoginStatus().then((isLoggedIn) => {
            if (!isLoggedIn) {
                navigate("/");
                return;
            } else {
                axiosInstance
                    .post("/video/reply", 0, {
                        params: {
                            videoId: videoId,
                            replyContent: commentAreaValue,
                            authorId: getUserInfo().userId
                        }
                    })
                    .then((resp: AxiosResponse<APIResponse<VideoReply>>) => {
                        if (resp.data.code == ResponseCodes.SUCCESS) {
                            getVideoByVideoId();
                            setCommentAreaValue("");
                        } else {
                            console.log(
                                "Error in submit comment request: " +
                                resp.data.message
                            );
                        }
                    })
                    .catch((error) => {
                        console.log(
                            "Error in submit comment request: " + error
                        );
                    });
            }
        });
    };

    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isStarred, setStarred] = useState<boolean>(false);

    const saveVideo = () => {
        setBookmarkDialogOpen(true);
    };

    const likeVideo = () => {
        axiosInstance.post("/video/like/videoId", 0, {
            params: {
                videoId: videoId,
                userId: getUserInfo().userId
            }
        }).then((resp: AxiosResponse<APIResponse<void>>) => {
            if (resp.data.code == ResponseCodes.SUCCESS) {
                setUserInfoDisplayUpdateFlag(!userInfoDisplayUpdateFlag);
                getVideoByVideoId();
            }
        });
        setIsLiked(true);
    };

    const unlikeVideo = () => {
        axiosInstance.post("/video/unlike/videoId", 0, {
            params: {
                videoId: videoId,
                userId: getUserInfo().userId
            }
        }).then((resp: AxiosResponse<APIResponse<void>>) => {
            if (resp.data.code == ResponseCodes.SUCCESS) {
                setUserInfoDisplayUpdateFlag(!userInfoDisplayUpdateFlag);
                getVideoByVideoId();
            }
        });
        setIsLiked(false);
    };

    const deleteReply = (videoReplyId: number) => {
        axiosInstance
            .delete("/video/delete/reply", {
                params: {
                    replyId: videoReplyId,
                    authorId: getUserInfo().userId
                }
            })
            .then((resp: AxiosResponse<APIResponse<void>>) => {
                if (resp.data.code == ResponseCodes.SUCCESS) {
                    getVideoByVideoId();
                } else {
                    console.log(
                        "Error in delete reply request: " + resp.data.message
                    );
                }
            })
            .catch((error) => {
                console.log("Error in delete reply request: " + error);
            });
    };

    const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState<boolean>(false);
    const [dataUpdateRequired, setDataUpdateRequired] = useState<boolean>(false);

    return (
        <>
            <Grid
                container
                spacing={2}
                alignItems="center"
                direction="column"
                sx={{ padding: "1rem" }}
            >
                {/* Search bar */}
                <form style={{ width: "40%" }} onSubmit={submitVideoTitleSearch}>
                    <TextField
                        name="title"
                        placeholder="Click here to search"
                        InputProps={{
                            endAdornment: (
                                <IconButton type="submit">
                                    <Search />
                                </IconButton>
                            )
                        }}
                        fullWidth
                    />
                </form>
                <Grid container spacing={2} style={{ marginTop: "0.5rem" }}>
                    {/* left hand side */}
                    <Grid item xs={8}>
                        {/* video title */}
                        <Typography variant="h5">
                            {video ? video.title : ""}
                        </Typography>
                        {/* subtitle: statistics  */}
                        <div style={{ marginBottom: "0.5rem" }}>
                            <Stack direction="row" spacing={2}>
                                <div>
                                    <Stack direction="row" spacing={0.5}>
                                        <VisibilityOutlined fontSize="small" />
                                        <span>{video?.viewCount}</span>
                                    </Stack>
                                </div>
                                <div>{video?.uploadDate}</div>
                            </Stack>
                        </div>
                        <Paper elevation={3}>
                            <video
                                src={video ? video.videoUrl : ""}
                                style={{ width: "100%" }}
                                controls={true}
                            />
                            {/* tags */}
                            <div style={{ padding: "1rem" }}>
                                <Grid container spacing={1}>
                                    {video &&
                                        video.tags.map((tag) => (
                                            <Grid item key={tag.videoTagId}>
                                                <Chip label={tag.tagText}></Chip>
                                            </Grid>
                                        ))}
                                </Grid>
                            </div>
                        </Paper>
                        {/* Comments */}
                        <Divider textAlign="left" style={{ marginTop: "1rem" }}>
                            <Chip label="Comments" size="small" />
                        </Divider>
                        {/* Comment form */}
                        <Stack
                            direction="row"
                            spacing={2}
                            style={{ marginTop: "1rem" }}
                        >
                            <Avatar src={getUserInfo().avatarUrl}></Avatar>
                            <form
                                onSubmit={submitComment}
                                style={{ width: "100%" }}
                            >
                                <TextField
                                    variant="standard"
                                    fullWidth
                                    value={commentAreaValue}
                                    onChange={(e) =>
                                        setCommentAreaValue(e.target.value)
                                    }
                                    placeholder="Add your comment here!"
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton type="submit">
                                                <Send />
                                            </IconButton>
                                        )
                                    }}
                                ></TextField>
                            </form>
                        </Stack>
                        {/* Replies */}
                        <List>
                            {video
                                ? video.replies.map((reply: VideoReply) => (
                                    <ListItem
                                        alignItems="flex-start"
                                        key={reply.videoReplyId}
                                        secondaryAction={
                                            reply.author.userId ===
                                            getUserInfo().userId && (
                                                <IconButton
                                                    onClick={() =>
                                                        deleteReply(
                                                            reply.videoReplyId
                                                        )
                                                    }
                                                >
                                                    <Delete />
                                                </IconButton>
                                            )
                                        }
                                    >
                                        <ListItemAvatar
                                            onClick={() => {
                                                navigate(
                                                    "/user/" + reply.author.userId
                                                );
                                            }}
                                        >
                                            <Avatar
                                                src={reply.author.avatarUrl}
                                                alt={reply.author.username}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={reply.author.username}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: "inline" }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                      <span
                                                          style={{
                                                              wordWrap:
                                                                  "break-word"
                                                          }}
                                                      >
                                                          {reply.replyContent}
                                                      </span>
                                                    </Typography>
                                                </React.Fragment>
                                            }
                                        ></ListItemText>
                                    </ListItem>
                                ))
                                : ""}
                        </List>
                    </Grid>

                    {/* Right hand side */}
                    <Grid item xs={4} style={{ paddingLeft: "2rem" }}>
                        {video && (
                            <ShortUserInfoDisplay
                                userId={video.author.userId}
                                dataUpdateRequired={userInfoDisplayUpdateFlag}
                            />
                        )}

                        {/* Like & save */}
                        <Stack
                            direction="row"
                            justifyContent="space-evenly"
                            spacing={10}
                            style={{ marginTop: "1rem" }}
                        >
                            <div>
                                <Stack spacing={0.2} alignItems="center">
                                    <div>
                                        {isLiked ? (
                                            <div onClick={unlikeVideo}>
                                                <ThumbUp fontSize="large" />
                                            </div>
                                        ) : (
                                            <div onClick={likeVideo}>
                                                <ThumbUpOutlined fontSize="large" />
                                            </div>
                                        )}
                                    </div>
                                    <span>{video?.likeCount}</span>
                                </Stack>
                            </div>
                            <div>
                                <Stack spacing={0.5} alignItems="center">
                                    <div>
                                        {isStarred ? (
                                            <div onClick={saveVideo}>
                                                <Star fontSize="large" />
                                            </div>
                                        ) : (
                                            <div onClick={saveVideo}>
                                                <StarBorderOutlined fontSize="large" />
                                            </div>
                                        )}
                                    </div>
                                    <span>{video?.saveCount}</span>
                                </Stack>
                            </div>
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
            <VideoBookmarkDialog open={bookmarkDialogOpen}
                                 setOpen={setBookmarkDialogOpen} currentVideoId={videoId || ""}
                                 dataUpdateRequired={dataUpdateRequired}
                                 setDataUpdateRequired={setDataUpdateRequired} />
        </>
    );
};
