import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import Vditor from "vditor";
import "vditor/dist/index.css";
import axiosInstance from "../utils/AxiosInstance";

export const PostEditPage = () => {
    const placeHolderMd =
        "# Title 标题 \nStart writing **here**! 从**这里**开始撰写你的文章吧！\n You can use $\\LaTeX$ formula here: $\\frac{1}{2}$";
    const [vd, setVd] = useState<Vditor>();
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
            upload:{
                accept:"image/*",
                multiple:false,
                token: localStorage.getItem("token") ?? undefined,
                
                // url(file){
                //     return 
                // }
            },
            after: () => {
                vditor.setValue('');
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
