import {
    Avatar, Chip,
    Divider, IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";
import {Post} from "../../entity/Post/Post.ts";
import {Delete, ThumbUpAltOutlined, VisibilityOutlined} from "@mui/icons-material";
import {PostTag} from "../../entity/Post/PostTag.ts";
import {FUser} from "../../entity/FUser.ts";
import axiosInstance from "../../utils/AxiosInstance.ts";
import {AxiosResponse} from "axios";
import APIResponse from "../../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../../entity/UtilEntity/ResponseCodes.ts";
import {useNavigate} from "react-router-dom";

type PostListProps = {
    postList: Post[];
}
export const PostList = ({postList}: PostListProps) => {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string) as FUser;
    const handleDeletePost = (postId: string) => {
        axiosInstance
            .delete('/forum/delete', {
                params: {
                    postId: postId,
                    token: localStorage.getItem("token")
                }
            }).then((response: AxiosResponse<APIResponse<void>>) => {
            if (response.data.code == ResponseCodes.SUCCESS) {
                sweetAlert("Success", "Post deleted successfully", "success").then(() => {
                    window.location.reload();
                });
            } else {
                sweetAlert("Error", response.data.message, "error");
            }
        }).catch((error) => {
            sweetAlert("Error", error, "error");
        });
    }
    return (
        <>
            {postList.length == 0 ? (
                <Typography variant="body1" sx={{margin: "1rem"}}>
                    No posts
                </Typography>
            ) : (
                <List sx={{width: "100%"}}>
                    {postList.map((post: Post) => (
                        <ListItem
                            key={post.postId}
                            alignItems="center"
                            disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    navigate('/forum/open/' + post.postId)
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar alt="user avatar" src={post.author.avatarUrl}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={post.title}
                                    secondary={
                                        <Stack
                                            direction="row"
                                            divider={
                                                <Divider
                                                    orientation="vertical"
                                                    flexItem
                                                />
                                            }
                                            spacing={1}
                                        >
                                            <>
                                                <VisibilityOutlined
                                                    fontSize="small"
                                                    sx={{marginRight: "3px"}}
                                                />

                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        marginRight: "20px",
                                                    }}
                                                >
                                                    {post.viewCount}
                                                </Typography>
                                            </>
                                            <>

                                                <ThumbUpAltOutlined
                                                    fontSize="small"
                                                    sx={{
                                                        marginRight: "3px",
                                                    }}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    {post.likeCount}
                                                </Typography>
                                            </>
                                        </Stack>
                                    }
                                />
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    flexWrap="wrap"
                                    useFlexGap
                                    justifyContent="flex-end"
                                >
                                    {post.tags.map((tag: PostTag) => (
                                        <Chip
                                            label={tag.tagText}
                                            key={tag.postTagId}
                                        ></Chip>
                                    ))}
                                </Stack>
                            </ListItemButton>
                            {/*post delete button*/}
                            {post.author.userId == userInfo.userId && (
                                <IconButton
                                    children={<Delete/>}
                                    onClick={() => {
                                        handleDeletePost(post.postId);
                                    }}
                                />
                            )}
                        </ListItem>
                    ))}
                </List>
            )}
        </>
    );
};
