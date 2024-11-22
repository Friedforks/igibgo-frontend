import { Button, Grid, Skeleton, Stack, TextField, Typography } from "@mui/material";
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
import { TagAutocomplete } from "../components/UtilComponents/TagAutocomplete.tsx";
import { Constants, Tag } from "../utils/Constants.ts";
import sweetAlert from "sweetalert";

export const PostEditPage = () => {
    const editorRef = useRef<CustomEditorRef>(null);
    const [searchParams] = useSearchParams();
    const postId = searchParams.get("postId");
    const [post, setPost] = useState<Post>();
    const [isLoading, setLoading] = useState(true);
    const [postContent, setPostContent] = useState<string | null>(null);
    const navigate = useNavigate();

    // tags
    const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
    const [selectedTags, setSelectedTags] = useState<(string)[]>([]);
    const [inputValue, setInputValue] = useState<string>("");

    const getTags = async () => {
        axiosInstance
            .get("/forum/get/allTags")
            .then((response: AxiosResponse<APIResponse<string[]>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    // encapsulate response data (available tags) + fixed tags -> suggested tags
                    const tmpTags: Tag[] = Constants.fixedTags.map((tag) => ({
                        label: tag,
                        fixed: true
                    })).concat(response.data.data.map((tag) => ({ label: tag.trim(), fixed: false })));
                    // Remove duplicates
                    const uniqueTags = Array.from(new Set(tmpTags.map(tag => tag.label))).map(label => tmpTags.find(tag => tag.label === label)!);
                    setSuggestedTags(uniqueTags);
                } else {
                    sweetAlert("Error", response.data.message, "error");
                }
            });
    };

    const handleChange = (_event: React.SyntheticEvent, newValue: (string | Tag)[]) => {
        setSelectedTags(newValue.map((item) => typeof item === "string" ? item : item.label));
    };

    const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
        setInputValue(newInputValue);
    };


    const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const editorValue = editorRef.current?.getValue();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        const tags = selectedTags.join(",");
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
                    const tagList = response.data.data.tags.map(
                        (tag) => tag.tagText
                    );
                    setSelectedTags(tagList);
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
            getTags();
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
                                <Grid container spacing={2}>
                                    <Grid item xs={5}>
                                        <TextField
                                            id="outlined-basic"
                                            name="title"
                                            label="Title"
                                            defaultValue={post?.title || ""}
                                            required
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={5}>

                                        <TagAutocomplete suggestedTags={suggestedTags} selectedTags={selectedTags} inputValue={inputValue} handleChange={handleChange} handleInputChange={handleInputChange}/>
                                    </Grid>
                                    <Grid item xs={1.5}>
                                        <Button
                                            variant="contained"
                                            endIcon={<Send />}
                                            type="submit"
                                            fullWidth
                                            size="large"
                                            style={{marginTop:'5px'}}
                                        >
                                            Send
                                        </Button>
                                    </Grid>
                                </Grid>
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
