import {Button, Stack, TextField, Typography} from "@mui/material";
import React, { useRef} from "react";
import "vditor/dist/index.css";
import axiosInstance from "../utils/AxiosInstance.ts";
import {AxiosResponse} from "axios";
import APIResponse from "../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../entity/UtilEntity/ResponseCodes.ts";
import {Send} from "@mui/icons-material";
import {MdEditor, CustomEditorRef} from "../components/UtilComponents/MdEditor.tsx";


export const PostEditPage = () => {
    const editorRef = useRef<CustomEditorRef>(null);

    const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
        axiosInstance
            .post("/forum/upload", newFormData, {
                params: {
                    title: title,
                    tags: tags,
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
                        window.location.reload();
                    });
                } else {
                    sweetAlert("Error", res.data.message, "error");
                }
            })
            .catch((err) => {
                console.log("Error in uploading post", err);
            });
    };

    return (
        <>
            <form onSubmit={handlePostSubmit}>
                <div style={{margin: "2rem"}}>
                    <Typography variant="h4">Create post</Typography>
                    <Stack
                        direction="row"
                        spacing={2}
                        style={{marginTop: "1rem", marginBottom: "1rem"}}
                        id="post-form"
                    >
                        <TextField
                            id="outlined-basic"
                            name="title"
                            label="Title"
                            required
                            fullWidth
                        />
                        <TextField
                            id="outlined-basic"
                            name="tags"
                            label="Tags (separate by comma ,)"
                            fullWidth
                        />
                        <Button variant="contained" endIcon={<Send/>} type="submit" style={{width: '20%'}}>
                            Send
                        </Button>
                    </Stack>
                    {/*<div id="vditor" className="vditor"/>*/}
                    <MdEditor ref={editorRef}/>
                </div>
            </form>
        </>
    );
};
