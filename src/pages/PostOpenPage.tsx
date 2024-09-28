import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Post} from "../entity/Post/Post.ts";
import axiosInstance from "../utils/AxiosInstance.ts";
import {AxiosResponse} from "axios";
import APIResponse from "../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../entity/UtilEntity/ResponseCodes.ts";
import {
    Chip,
    Divider,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import {
    ThumbUpOutlined,
    VisibilityOutlined
} from "@mui/icons-material";
import {ShortUserInfoDisplay} from "../components/UtilComponents/ShortUserInfoDisplay.tsx";
import Vditor from "vditor";
import "vditor/dist/index.css";

export const PostOpenPage = () => {
    const param = useParams();
    const postId = param.postId;
    const [post, setPost] = useState<Post>();
    const [dataUpdateRequired, setDataUpdateRequired] = useState<boolean>(false);

    const [vdPost, setVdPost] = useState<Vditor>();

    const createVidtor = (content: string) => {
        Vditor.preview(document.getElementById("post-content") as HTMLDivElement,
            content,
            {
                mode: "light",
            }
        );
    }

    useEffect(() => {
        axiosInstance.get("/forum/get/postId", {
            params: {
                postId: postId
            }
        }).then((response: AxiosResponse<APIResponse<Post>>) => {
            if (response.data.code == ResponseCodes.SUCCESS) {
                setPost(response.data.data);
                createVidtor(response.data.data.postContent);
            } else {
                console.log("Error in get post request: " + response.data.message);
            }
        }).catch((error) => {
            console.log("Error in get post request: " + error);
        })
    }, [])


    return (
        <>
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
                            <ThumbUpOutlined fontSize="small"/>
                            <span>{post?.likeCount}</span>
                        </Stack>
                    </div>
                    <div>
                        <Stack direction="row" spacing={0.5}>
                            <VisibilityOutlined fontSize="small"/>
                            <span>{post?.viewCount}</span>
                        </Stack>
                    </div>
                    <div>{post?.uploadDate.toString()}</div>
                </Stack>
                {/*    render post markdown*/}
                <div id="post-content" className="vditor" style={{
                    height: window.innerHeight * 0.7,
                    overflowY: "scroll",
                    padding: '3rem',
                    maxWidth: document.getElementById("header-row")?.clientWidth
                }}/>
            </div>
            {/* comments */}
        </>
    )
}