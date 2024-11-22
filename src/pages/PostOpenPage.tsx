import {useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {Post} from "../entity/Post/Post.ts";
import axiosInstance from "../utils/AxiosInstance.ts";
import {AxiosResponse} from "axios";
import APIResponse from "../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../entity/UtilEntity/ResponseCodes.ts";
import {
    Button, Chip, Dialog,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import {
    Send,
    VisibilityOutlined
} from "@mui/icons-material";
import {ShortUserInfoDisplay} from "../components/UtilComponents/ShortUserInfoDisplay.tsx";
import "vditor/dist/index.css";
import {PostReplyList} from "../components/Post/PostReplyList.tsx";
import {PostReply} from "../entity/Post/PostReply.ts";
import {MdEditor, CustomEditorRef} from "../components/UtilComponents/MdEditor.tsx";
import {MdPreview} from "../components/UtilComponents/MdPreview.tsx";
import {formatDate} from "../utils/DateUtil.ts";

export const PostOpenPage = () => {
    const param = useParams();
    const postId = param.postId;
    const [post, setPost] = useState<Post>();
    const [dataUpdateRequired, setDataUpdateRequired] = useState<boolean>(false);
    const [replies, setReplies] = useState<PostReply[]>();
    const [postContent, setPostContent] = useState<string>("");

    const getPost = async () => {
        axiosInstance.get("/forum/get/postId", {
            params: {
                postId: postId,
                token: localStorage.getItem("token")
            }
        }).then((response: AxiosResponse<APIResponse<Post>>) => {
            if (response.data.code == ResponseCodes.SUCCESS) {
                response.data.data.uploadDate=formatDate(response.data.data.uploadDate);
                setPost(response.data.data);
                // createVditor(response.data.data.postContent);
                setPostContent(response.data.data.postContent);
            } else {
                console.log("Error in get post request: " + response.data.message);
            }
        }).catch((error) => {
            console.log("Error in get post request: " + error);
        })
    }

    const getReplies = async () => {
        axiosInstance.get("/forum/reply/primary", {
            params: {
                postId: postId
            }
        }).then((response: AxiosResponse<APIResponse<PostReply[]>>) => {
            // console.log("get replies response: ", response.data);
            if (response.data.code == ResponseCodes.SUCCESS) {
                // wait 2 seconds
                setReplies(response.data.data);
            } else {
                console.log("Error in get replies request: " + response.data.message);
            }
        }).catch((error) => {
            console.log("Error in get replies request: " + error);
        })
    }

    const [newReplyDialogOpen, setNewReplyDialogOpen] = useState(false);

    const editorRef = useRef<CustomEditorRef>(null);

    const handleNewReply = () => {
        setNewReplyDialogOpen(true);
    }

    const handleReplySubmit = () => {
        const replyContent = editorRef.current?.getValue() as string;
        if (!replyContent) {
            sweetAlert("Error", "Reply content is empty", "error");
        }
        const formData = new FormData();
        formData.append("replyContent", replyContent);
        axiosInstance.post("/forum/reply/new", formData, {
            params: {
                postId: postId,
                token: localStorage.getItem("token"),
                parentReplyId: null
            }
        }).then((response: AxiosResponse<APIResponse<void>>) => {
            if (response.data.code == ResponseCodes.SUCCESS) {
                setNewReplyDialogOpen(false);
                setDataUpdateRequired(!dataUpdateRequired);
                sweetAlert("Success!", "Reply sent successfully", "success").then(() => window.location.reload())
            } else {
                sweetAlert("Error", response.data.message, "error");
            }
        }).catch((error) => {
            sweetAlert("Error", error, "error");
        })
    }

    useEffect(() => {
        getPost().then(() => {
            getReplies()
        })
    }, [])

    return (
        <>
            <div style={{maxWidth:"100%"}}>
                <Grid item xs={4} style={{marginBottom: '2rem'}}>
                    <ShortUserInfoDisplay
                        userId={post?.author.userId}
                        dataUpdateRequired={dataUpdateRequired}
                    />
                    {/* new reply */}
                </Grid>
                {/* Title section */}
                <Typography variant="h5">{post?.title}</Typography>
                <div style={{marginTop: "5px"}}>
                    <Stack direction="row" spacing={2} id="header-row">
                        <div>
                            <Stack direction="row" spacing={0.5}>
                                <VisibilityOutlined fontSize="small"/>
                                <span>{post?.viewCount}</span>
                            </Stack>
                        </div>
                        <div>{post?.uploadDate.toString()}</div>
                    </Stack>
                    {/*    render post markdown*/}
                    <MdPreview content={postContent} maxWidth={window.innerWidth*0.9}/>
                </div>
                {/* replies */}
                <Divider textAlign="left" style={{marginTop: "1rem"}}>
                    <Chip label="Replies" size="small"/>
                </Divider>
                <Button variant="contained" onClick={handleNewReply}>New reply</Button>
                <PostReplyList
                    replies={replies ?? []}
                />

                {/*Dialogs*/}
                <Dialog open={newReplyDialogOpen} onClose={() => {
                    setNewReplyDialogOpen(false)
                }} maxWidth="md" fullWidth>
                    <Stack direction="row" margin="1rem" justifyContent="space-between">
                        <Typography variant="h6">New Reply</Typography>
                        <Button variant="contained" onClick={handleReplySubmit} endIcon={<Send/>}>Send</Button>
                    </Stack>
                    <MdEditor ref={editorRef}/>
                </Dialog>
            </div>
        </>
    )
}