import { Button, Skeleton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "vditor/dist/index.css";
import axiosInstance from "../utils/AxiosInstance.ts";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../entity/UtilEntity/ResponseCodes.ts";
import { Send } from "@mui/icons-material";
import {
    MdEditor,
    CustomEditorRef,
} from "../components/UtilComponents/MdEditor.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Post } from "../entity/Post/Post.ts";

export const PostEditPage = () => {
    const editorRef = useRef<CustomEditorRef>(null);
    const [searchParams] = useSearchParams();
    const postId = searchParams.get("postId");
    const [post, setPost] = useState<Post>();
    const [isLoading, setLoading] = useState(true);
    const [tags, setTags] = useState<string>();
    const [postContent, setPostContent] = useState<string | null>(null);
    const navigate = useNavigate();

    const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const editorValue = editorRef.current?.getValue();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        const tags = formData.get("tags");
        if (!title || !tags) {
            sweetAlert("Title and tags are required");
            return;
        }
        if (!editorValue) {
            sweetAlert("You need to at least write something in your post.");
            return;
        }
        const newFormData = new FormData();
            newFormData.append("postContent", editorValue);
            newFormData.append("tags", tags);
            newFormData.append("title", title);
        if (post) {
            axiosInstance
                .post("/forum/edit", newFormData, {
                    params: {
                        postId: post.postId,
                        token: localStorage.getItem("token"),
                    },
                })
                .then((res: AxiosResponse<APIResponse<void>>) => {
                    if (res.data.code == ResponseCodes.SUCCESS) {
                        sweetAlert(
                            "Success!",
                            "Post created successfully",
                            "success"
                        ).then(() => {
                            navigate("/forum/search");
                        });
                    } else {
                        sweetAlert("Error", res.data.message, "error");
                    }
                })
                .catch((err) => {
                    console.log("Error in uploading post", err);
                });
        } else {
            axiosInstance
                .post("/forum/upload", newFormData, {
                    params: {
                        token: localStorage.getItem("token"),
                    },
                })
                .then((res: AxiosResponse<APIResponse<void>>) => {
                    if (res.data.code == ResponseCodes.SUCCESS) {
                        sweetAlert(
                            "Success!",
                            "Post created successfully",
                            "success"
                        ).then(() => {
                            navigate("/forum/search");
                        });
                    } else {
                        sweetAlert("Error", res.data.message, "error");
                    }
                })
                .catch((err) => {
                    console.log("Error in uploading post", err);
                });
        }
    };

    const getPost = async () => {
        axiosInstance
            .get("/forum/get/postId", {
                params: {
                    postId: postId,
                },
            })
            .then((response: AxiosResponse<APIResponse<Post>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    setPost(response.data.data);
                    // createVidtor(response.data.data.postContent);
                    setPostContent(response.data.data.postContent);
                    const tagArray = response.data.data.tags.map(
                        (tag) => tag.tagText
                    );
                    const tagString = tagArray.join(",");
                    setTags(tagString);
                    setLoading(false);
                } else {
                    console.log(
                        "Error in get post request: " + response.data.message
                    );
                }
            })
            .catch((error) => {
                console.log("Error in get post request: " + error);
            });
    };
    useEffect(() => {
        if (postId) {
            // edit post
            // get post content
            getPost();
        } else {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (editorRef.current && postContent) {
            editorRef.current.setValue(postContent);
        }
    }, [editorRef, postContent]);

    return (
        <>
            <form onSubmit={handlePostSubmit}>
                <div style={{ margin: "2rem" }}>
                    <Typography variant="h4">
                        {isLoading ? <Skeleton width="40%" /> : "Create post"}
                    </Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                        style={{ marginTop: "1rem", marginBottom: "1rem" }}
                        id="post-form"
                    >
                        {isLoading ? (
                            <>
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={56}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={56}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width="20%"
                                    height={56}
                                />
                            </>
                        ) : (
                            <>
                                <TextField
                                    id="outlined-basic"
                                    name="title"
                                    label="Title"
                                    defaultValue={post?.title || ""}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    id="outlined-basic"
                                    name="tags"
                                    label="Tags (separate by comma ,)"
                                    defaultValue={tags ?? ""}
                                    fullWidth
                                />
                                <Button
                                    variant="contained"
                                    endIcon={<Send />}
                                    type="submit"
                                    style={{ width: "20%" }}
                                >
                                    Send
                                </Button>
                            </>
                        )}
                    </Stack>
                    {isLoading ? (
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={400}
                        />
                    ) : (
                        <MdEditor ref={editorRef} maxWidth="calc(100vw*0.9)" />
                    )}
                </div>
            </form>
        </>
    );
};
