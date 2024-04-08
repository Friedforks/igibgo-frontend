import CustomHeader from "../components/CustomHeader.tsx";
import {
    Avatar,
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Chip,
    Divider,
    Grid,
    List,
    ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, Stack,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {Video} from "../entity/Video.ts";
import axiosInstance from "../utils/AxiosInstance.ts";
import {AxiosResponse} from "axios";
import APIResponse from "../entity/APIResponse.ts";
import ResponseCodes from "../entity/ResponseCodes.ts";
import swal from "sweetalert";
import VisibilityOutlinedIcon from '@mui/icons-material/RemoveRedEye';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';


export const HomePage = () => {

    const [videos, setVideos] = useState<Video[]>([])
    useEffect(() => {
        // fetch video
        axiosInstance.get('/video/get/order', {
            params: {
                page: 0,
                size: 10,
                orderBy: "uploadDate",
                ascending: false
            }
        }).then((response: AxiosResponse<APIResponse<Video[]>>) => {
            if (response.data.code == ResponseCodes.SUCCESS) {
                setVideos(response.data.data);
            } else {
                swal("Error", response.data.message, "error")
            }
        })
    }, [])
    return (
        <>
            <CustomHeader/>
            <div style={{margin: "5vh"}}>
                <Divider textAlign="left" sx={{marginTop: "2vh"}}>
                    <Chip label="Videos"/>
                </Divider>
                <Grid container spacing={2} sx={{marginTop: "2vh", marginLeft: "2vw"}}>
                    {/*{videos.map((video: Video) => (*/}
                    {[0, 1, 2, 3].map(() => (
                        <Grid item>
                            <Card sx={{width: "200px", height: "250px"}}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="150px"
                                        image="https://source.unsplash.com/random"
                                        alt="video cover"
                                    />
                                    <CardContent>
                                        <Typography variant="h6"> title</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            asdfasdf
                                        </Typography>
                                        <Box display="flex" alignItems="center" sx={{marginTop: '2px'}}>
                                            <VisibilityOutlinedIcon fontSize='small' sx={{marginRight: '3px'}}/>
                                            <Typography variant="body2" color="text.secondary"
                                                        sx={{marginRight: '20px'}}>
                                                123
                                            </Typography>
                                            <ThumbUpAltOutlinedIcon fontSize='small' sx={{marginRight: '3px'}}/>
                                            <Typography variant="body2" color="text.secondary">
                                                123
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Divider textAlign="right" sx={{marginTop: "2vh"}}>
                    <Chip label="Notes"/>
                </Divider>
                <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                    {[0, 1, 2, 3].map((value) => (
                        <ListItem key={value} alignItems="flex-start" disablePadding>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar alt="user avatar" src="https://source.unsplash.com/random"/>
                                </ListItemAvatar>
                                <ListItemText primary={`Note ${value + 1}`} secondary={
                                    <Stack direction="row"
                                           divider={<Divider orientation="vertical" flexItem/>}
                                           spacing={1}>
                                        <>
                                            <VisibilityOutlinedIcon fontSize='small' sx={{marginRight: '3px'}}/>
                                            <Typography variant="body2" color="text.secondary"
                                                        sx={{marginRight: '20px'}}>
                                                123
                                            </Typography>
                                        </>
                                        <>
                                            <ThumbUpAltOutlinedIcon fontSize='small' sx={{marginRight: '3px'}}/>
                                            <Typography variant="body2" color="text.secondary">
                                                123
                                            </Typography>
                                        </>
                                    </Stack>
                                }/>
                                <Stack direction="row" spacing={1}>
                                    {[0, 1, 2, 3].map(() => (
                                        <Chip label="IBDP">
                                        </Chip>
                                    ))}
                                </Stack>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider textAlign="left" sx={{marginTop: "2vh"}}>
                    <Chip label="Forum"/>
                </Divider>
                <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                    {[0, 1, 2, 3].map((value) => (
                        <ListItem key={value} alignItems="flex-start" disablePadding>
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar alt="user avatar" src="https://source.unsplash.com/random"/>
                                </ListItemAvatar>
                                <ListItemText primary={`Question ${value + 1}`} secondary={
                                    <Stack direction="row"
                                           divider={<Divider orientation="vertical" flexItem/>}
                                           spacing={1}>
                                        <>
                                            <VisibilityOutlinedIcon fontSize='small' sx={{marginRight: '3px'}}/>
                                            <Typography variant="body2" color="text.secondary"
                                                        sx={{marginRight: '20px'}}>
                                                123
                                            </Typography>
                                        </>
                                        <>
                                            <ThumbUpAltOutlinedIcon fontSize='small' sx={{marginRight: '3px'}}/>
                                            <Typography variant="body2" color="text.secondary">
                                                123
                                            </Typography>
                                        </>
                                    </Stack>
                                }/>
                                <Stack direction="row" spacing={1}>
                                    {[0, 1, 2, 3].map(() => (
                                        <Chip label="IBDP">
                                        </Chip>
                                    ))}
                                </Stack>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </div>
        </>
    )
}