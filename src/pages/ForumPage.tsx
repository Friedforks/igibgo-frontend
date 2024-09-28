import "vditor/dist/index.css";
import {Button, IconButton, Stack, TextField, Typography} from "@mui/material";
import {ArrowBackIos, ArrowForwardIos, Search, Send} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {useNavigate,  useSearchParams} from "react-router-dom";
import {PostList} from "../components/Post/PostList.tsx";
import axiosInstance from "../utils/AxiosInstance.ts";
import {AxiosResponse} from "axios";
import APIResponse from "../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../entity/UtilEntity/ResponseCodes.ts";
import {Post} from "../entity/Post/Post.ts";
import {Page} from "../entity/UtilEntity/Page.ts";

export const ForumPage = () => {
    const navigate = useNavigate();
    const pageSize = 10;
    const [param]=useSearchParams();
    const keywords=param.get('keywords');
    const [page, setPage] = useState<number>(0);
    const [postList, setPostList] = useState<Post[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const getPostList = async () => {
        console.log("get post list");
        axiosInstance.get("/forum/get/order", {
            params: {
                page: page,
                size: pageSize,
                orderBy: "uploadDate",
                ascending: false // get newest post first
            },
        }).then((response: AxiosResponse<APIResponse<Page<Post[]>>>) => {
            if (response.data.code == ResponseCodes.SUCCESS) {
                setPostList(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
                console.log(postList);
            } else {
                console.log("Error in get post list request: " + response.data.message);
            }
        }).catch((error) => {
            console.log("Error in get post list request: " + error);
        });
    }

    const getPostListByKeywords = () => {
        axiosInstance.get("/forum/get/keyword", {
            params: {
                keyword: keywords,
                page: page,
                size: pageSize,
            }
        }).then((response: AxiosResponse<APIResponse<Page<Post[]>>>) => {
            if (response.data.code == ResponseCodes.SUCCESS) {
                setPostList(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
                console.log(postList);
            } else {
                console.log("Error in get post list request: " + response.data.message);
            }
        }).catch((error) => {
            console.log("Error in get post list request: " + error);
        });
    }

    const handlePostSearch = (event: React.FormEvent<HTMLDivElement>) => {
        event.preventDefault();
        // get HTMLDivElement's content
        const formData = new FormData(event.target as HTMLFormElement);
        const searchKeywords = formData.get("keywords") as string;
        navigate("/forum/search/" + searchKeywords);
    }

    useEffect(() => {
        console.log("keywords: ", keywords);
        if(keywords){
            getPostListByKeywords();
        }
        else{
            getPostList();
        }
    }, [page]);

    return (
        <>
            <Stack
                direction="row"
                spacing={2}
                sx={{mb: "2rem", ml: "2rem"}}
            >
                <Button
                    variant="contained"
                    startIcon={<Send/>}
                    onClick={() => {
                        navigate("/forum/new");
                    }}
                >
                    New Post
                </Button>
                {/* Search bar */}
                <form
                    style={{width: "40%"}}
                    // onSubmit={handlePostSearch}
                >
                    <TextField
                        name="keywords"
                        placeholder="Click here to search for posts"
                        InputProps={{
                            endAdornment: (
                                <IconButton type="submit">
                                    <Search/>
                                </IconButton>
                            ),
                        }}
                        fullWidth
                        onSubmit={handlePostSearch}
                    />
                </form>
            </Stack>
            <Stack
                direction="row"
                spacing={1}
                justifyContent="flex-end"
                alignItems="flex-end"
            >
                <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                        page > 0 ? setPage(page - 1) : setPage(0);
                    }}
                    disabled={page == 0}
                >
                    <ArrowBackIos fontSize="inherit"/>
                </IconButton>
                <Typography>{page + 1}</Typography>
                <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => {
                        setPage(page + 1);
                    }}
                    disabled={page == totalPages - 1}
                >
                    <ArrowForwardIos fontSize="inherit"/>
                </IconButton>
            </Stack>
            <PostList postList={postList}/>
        </>
    )
}

