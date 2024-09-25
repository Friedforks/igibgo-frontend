import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import { FUser } from "../entity/FUser";
import axiosInstance from "../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/APIResponse";
import ResponseCodes from "../entity/ResponseCodes";

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
        // TODO: Implement upload image function
        // const uploadImage=(file:File)=>{
        //     axiosInstance.post
        // }
        const vditor = new Vditor("vditor", {
            height: window.innerHeight - 200,
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
                headers: { token: localStorage.getItem("token") ?? "" },
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
                }
            },
            after: () => {
                vditor.setValue("");
                setVd(vditor);
            },
        });
        // Clear the effect
        return () => {
            vd?.destroy();
            setVd(undefined);
        };
    }, []);
    return (
        <>
            <Typography variant="h4">Create post</Typography>
            <div id="vditor" className="vditor" />
        </>
    );
};
