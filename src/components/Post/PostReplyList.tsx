import React, { useRef, useState } from "react";
import {
    List,
    ListItem,
    ListItemText,
    Typography,
    Button,
    Box,
    ListItemAvatar,
    Avatar,
} from "@mui/material";
import { ThumbUp, Reply as ReplyIcon, Delete } from "@mui/icons-material";
import { PostReply } from "../../entity/Post/PostReply.ts";
import { MdPreview } from "../UtilComponents/MdPreview.tsx";
import { FUser } from "../../entity/FUser.ts";
import { CustomEditorRef, MdEditor } from "../UtilComponents/MdEditor.tsx";
import axiosInstance from "../../utils/AxiosInstance.ts";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../../entity/UtilEntity/ResponseCodes.ts";
import { useNavigate } from "react-router-dom";

interface ReplyItemProps {
    reply: PostReply;
    depth: number;
}

const ReplyItem: React.FC<ReplyItemProps> = ({ reply, depth }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [childReplies, setChildReplies] = useState<PostReply[]>([]);
    const [isLoadingChildReplies, setIsLoadingChildReplies] = useState(false);

    const onLoadChildReplies = async (parentId: number) => {
        return new Promise<PostReply[]>((resolve, reject) => {
            axiosInstance
                .get("/forum/reply/child", {
                    params: {
                        postReplyId: parentId,
                    },
                })
                .then((response: AxiosResponse<APIResponse<PostReply[]>>) => {
                    if (response.data.code == ResponseCodes.SUCCESS) {
                        resolve(response.data.data);
                    } else {
                        reject(response.data.message);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    const handleLoadChildReplies = async () => {
        setIsLoadingChildReplies(true);
        try {
            const loadedReplies = await onLoadChildReplies(reply.postReplyId);
            setChildReplies(loadedReplies);
        } catch (error) {
            console.error("Error loading child replies:", error);
        } finally {
            setIsLoadingChildReplies(false);
        }
    };

    const onLike = () => {
        axiosInstance
            .post("/forum/like/reply", 0, {
                params: {
                    postReplyId: reply.postReplyId,
                    token: localStorage.getItem("token"),
                },
            })
            .then((response: AxiosResponse<APIResponse<void>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    window.location.reload();
                } else {
                    console.log(
                        "Error in like request: " + response.data.message
                    );
                }
            })
            .catch((error) => {
                console.log("Error in like request: " + error);
            });
    };

    const onDelete = () => {
        axiosInstance
            .delete("/forum/reply/delete", {
                params: {
                    postReplyId: reply.postReplyId,
                    token: localStorage.getItem("token"),
                },
            })
            .then((response: AxiosResponse<APIResponse<void>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    window.location.reload();
                } else {
                    console.log(
                        "Error in delete request: " + response.data.message
                    );
                }
            })
            .catch((error) => {
                console.log("Error in delete request: " + error);
            });
    };

    const onReply = () => {
        console.log("onReply, reply:", reply);
        const replyContent = editorRef.current?.getValue() as string;
        if (!replyContent) {
            sweetAlert("Error", "Reply content is empty", "error");
        }
        const formData = new FormData();
        formData.append("replyContent", replyContent);
        axiosInstance
            .post("/forum/reply/new", formData, {
                params: {
                    postId: reply.post.postId,
                    token: localStorage.getItem("token"),
                    parentReplyId: reply.postReplyId,
                },
            })
            .then((response: AxiosResponse<APIResponse<void>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    setIsReplying(false);
                    window.location.reload();
                } else {
                    console.log(
                        "Error in reply request: " + response.data.message
                    );
                }
            })
            .catch((error) => {
                sweetAlert("Error", error, "error");
            });
    };

    const editorRef = useRef<CustomEditorRef>(null);

    const userInfo = JSON.parse(
        localStorage.getItem("userInfo") as string
    ) as FUser;
    const navigate=useNavigate();

    return (
        <>
            <ListItem alignItems="flex-start" sx={{ pl: depth * 4 }}>
                <ListItemAvatar>
                    <div onClick={()=>navigate("/user/"+userInfo.userId)}>
                        <Avatar
                            alt={reply.user.username}
                            src={reply.user.avatarUrl}
                        />
                    </div>
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography variant="subtitle1">
                            {reply.user.username}
                        </Typography>
                    }
                    secondary={
                        <>
                            <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                <MdPreview
                                    content={reply.replyContent}
                                    maxWidth={
                                        window.innerWidth * 0.9 -
                                        56 -
                                        depth * 32
                                    }
                                />
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                                <Button
                                    startIcon={<ThumbUp />}
                                    size="small"
                                    onClick={onLike}
                                >
                                    {reply.likeCount}{" "}
                                    {reply.likeCount > 1 ? "Likes" : "Like"}
                                </Button>
                                <Button
                                    startIcon={<ReplyIcon />}
                                    size="small"
                                    onClick={() => setIsReplying(!isReplying)}
                                >
                                    Reply
                                </Button>
                                {reply.user.userId == userInfo.userId && (
                                    <Button
                                        startIcon={<Delete />}
                                        size="small"
                                        onClick={onDelete}
                                    >
                                        Delete
                                    </Button>
                                )}
                                {reply.childReplyCount > 0 &&
                                    childReplies.length === 0 && (
                                        <Button
                                            size="small"
                                            onClick={handleLoadChildReplies}
                                            disabled={isLoadingChildReplies}
                                        >
                                            {isLoadingChildReplies
                                                ? "Loading..."
                                                : `Load ${
                                                      reply.childReplyCount
                                                  } 
                                         ${
                                             reply.childReplyCount > 1
                                                 ? "Replies"
                                                 : "Reply"
                                         }`}
                                        </Button>
                                    )}
                            </Box>
                            <Typography variant="caption" display="block">
                                {new Date(reply.replyDate).toLocaleString()}
                            </Typography>
                            {isReplying && (
                                <Box sx={{ mt: 2 }}>
                                    <MdEditor
                                        ref={editorRef}
                                        maxWidth={
                                            window.innerWidth * 0.9 -
                                            56 -
                                            depth * 32
                                        }
                                        height={window.innerHeight * 0.3}
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        sx={{ mt: 1 }}
                                        onClick={onReply}
                                    >
                                        Submit Reply
                                    </Button>
                                </Box>
                            )}
                        </>
                    }
                />
            </ListItem>
            {childReplies.length > 0 && (
                <List>
                    {childReplies.map((childReply) => (
                        <ReplyItem
                            key={childReply.postReplyId}
                            reply={childReply}
                            depth={depth + 1}
                        />
                    ))}
                </List>
            )}
        </>
    );
};

interface ReplyListProps {
    replies: PostReply[];
}

export const PostReplyList: React.FC<ReplyListProps> = ({ replies }) => {
    return (
        <List>
            {replies.map((reply) => (
                <ReplyItem key={reply.postReplyId} reply={reply} depth={0} />
            ))}
        </List>
    );
};
