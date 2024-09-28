import {Button, Stack, TextField, Typography} from "@mui/material";
import React, {useState, useEffect} from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import {FUser} from "../entity/FUser.ts";
import axiosInstance from "../utils/AxiosInstance.ts";
import {AxiosResponse} from "axios";
import APIResponse from "../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../entity/UtilEntity/ResponseCodes.ts";
import {Send} from "@mui/icons-material";


export const PostEditPage = () => {
    const placeHolderMd =
        "# Title 标题 \nStart writing **here**! 从**这里**开始撰写你的文章吧！\n You can use $\\LaTeX$ formula here: $\\frac{1}{2}$";
    const [vd, setVd] = useState<Vditor>();

    const handleImageUpload = (
        file: File,
        callback: (path: string) => void
    ) => {
        const formData = new FormData();
        if (!file) {
            return;
        }
        formData.append("image", file);
        formData.append(
            "authorId",
            (
                JSON.parse(localStorage.getItem("userInfo") as string) as FUser
            ).userId.toString()
        );
        axiosInstance
            .post("/forum/image/upload", formData)
            .then((res: AxiosResponse<APIResponse<string>>) => {
                if (res.data.code == ResponseCodes.SUCCESS) {
                    callback(res.data.data);
                } else {
                    sweetAlert("Upload image failed: " + res.data.message);
                }
            })
            .catch((err) => {
                sweetAlert("Upload image failed: " + err);
            });
    };
    useEffect(() => {
        const vditor = new Vditor("vditor", {
            height: window.innerHeight*0.7,
            width: document.getElementById("post-form")?.clientWidth,
            counter: {
                enable: true,
                type: "markdown",
            },
            placeholder: placeHolderMd,
            mode: "ir",
            comment: {
                enable: false,
            },
            preview: {
                math: {
                    inlineDigit: true,
                    engine: "MathJax",
                },
            },
            upload: {
                accept: "image/*",
                multiple: false,
                headers: {token: localStorage.getItem("token") ?? ""},
                filename(name) {
                    return name
                        .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, "")
                        .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, "")
                        .replace("/\\s/g", "");
                },
                handler(file) {
                    const callback = (path: string) => {
                        const name = file[0] && file[0].name;
                        let succFileText = "";
                        if (vditor && vditor.vditor.currentMode === "wysiwyg") {
                            succFileText += `\n <img alt=${name} src="${path}">`;
                        } else {
                            succFileText += `  \n![${name}](${path})`;
                        }
                        vditor.insertValue(succFileText);
                        succFileText;
                    };
                    handleImageUpload(file[0], callback);
                    return null;
                },
            },
            after: () => {
                setVd(vditor);
            },
        });
        // Clear the effect
        return () => {
            vd?.destroy();
            setVd(undefined);
        };
    }, []);

    const handlePostSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        const tags = formData.get("tags");
        if (!title || !tags) {
            sweetAlert("Title and tags are required");
            return;
        }
        if (!vd?.getValue()) {
            sweetAlert("You need to at least write something in your post.");
            return;
        }
        const newFormData = new FormData();
        newFormData.append("postContent", vd?.getValue() as string);
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
                        <Button variant="contained" endIcon={<Send/>} type="submit" style={{width:'20%'}}>
                            Send
                        </Button>
                    </Stack>
                    <div id="vditor" className="vditor"/>
                </div>
            </form>
        </>
    );
};
