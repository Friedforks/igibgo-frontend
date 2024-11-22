import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance.ts";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../entity/UtilEntity/ResponseCodes.ts";
import sweetAlert from "sweetalert";
import { Note } from "../entity/Note/Note.ts";
import {
    Autocomplete,
    Box,
    Breadcrumbs,
    Button,
    FormControl,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    TextField,
    Typography
} from "@mui/material";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
import {
    ArrowBackIos,
    ArrowForwardIos,
    CloudUpload,
    RemoveRedEyeTwoTone,
    ThumbUpAltTwoTone
} from "@mui/icons-material";
import { NoteUploadDialog } from "../components/Note/NoteUploadDialog.tsx";
import { useNavigate } from "react-router-dom";
import { NoteList } from "../components/Note/NoteList.tsx";
import { Constants, Tag } from "../utils/Constants.ts";


export const NotePage = () => {
    const fixedTags = Constants.fixedTags;
    const [noteList, setNoteList] = useState<Note[]>([]);
    const pageSize: number = 10; // fixed page size for pagination
    const [page, setPage] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>("uploadDate");
    const [ascending, setAscending] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [suggestedTags, setSuggestedTags] = useState<Tag[]>([]);
    const [searchBarValue, setSearchBarValue] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    const navigate = useNavigate();

    useEffect(() => {
        // fetch note with tags
        if (selectedTags.length > 0) {
            axiosInstance
                .get("note/get/tags", {
                    params: {
                        tags: selectedTags.join(","),
                        page: page,
                        size: pageSize,
                        orderBy: sortBy,
                        ascending: ascending
                    }
                })
                .then((resp) => {
                    if (resp.data.code == ResponseCodes.SUCCESS) {
                        setNoteList(resp.data.data.content);
                        setTotalPages(resp.data.data.totalPages);
                    } else {
                        sweetAlert("Error", resp.data.message, "error");
                    }
                });
        } else if (searchBarValue.length > 0) {
            axiosInstance
                .get("/note/get/title", {
                    params: {
                        title: searchBarValue,
                        page: page,
                        size: pageSize,
                        orderBy: sortBy,
                        ascending: ascending
                    }
                })
                .then((resp) => {
                    if (resp.data.code == ResponseCodes.SUCCESS) {
                        setNoteList(resp.data.data.content);
                        setTotalPages(resp.data.data.totalPages);
                    } else {
                        sweetAlert("Error", resp.data.message, "error");
                    }
                });
        } else {
            // fetch note
            axiosInstance
                .get("/note/get/order", {
                    params: {
                        page: page,
                        size: pageSize,
                        orderBy: sortBy,
                        ascending: ascending
                    }
                })
                .then((response) => {
                    if (response.data.code == ResponseCodes.SUCCESS) {
                        setNoteList(response.data.data.content);
                        setTotalPages(response.data.data.totalPages);
                    } else {
                        sweetAlert("Error", response.data.message, "error");
                    }
                });
        }
    }, [sortBy, page, ascending, searchBarValue, selectedTags]);

    useEffect(() => {
        // fetch tags
        axiosInstance
            .get("/note/get/allTags")
            .then((response: AxiosResponse<APIResponse<string[]>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    // encapsulate response data (available tags) + fixed tags -> suggested tags
                    const tmpTags: Tag[] = fixedTags.map((tag) => ({ label: tag, fixed: true })).concat(response.data.data.map((tag) => ({ label: tag.trim(), fixed: false })));
                    // Remove duplicates
                    const uniqueTags = Array.from(new Set(tmpTags.map(tag => tag.label))).map(label => tmpTags.find(tag => tag.label === label)!);
                    // response.data.data.forEach((tag) => {
                    //     tmpTags.push({ label: tag, fixed: false });
                    // });
                    // fixedTags.forEach((tag) => {
                    //     tmpTags.push({ label: tag, fixed: true });
                    // });
                    setSuggestedTags(uniqueTags);
                } else {
                    sweetAlert("Error", response.data.message, "error");
                }
            });
    }, []);

    const findNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setSearchBarValue(event.target.value);
    };

    const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
        setInputValue(newInputValue);
    };

    // const handleChange = (_event: React.SyntheticEvent, newValue: string[], reason: AutocompleteChangeReason) => {
    //     setSelectedTags(newValue);
    // };

    const handleChange = (_event: React.SyntheticEvent, newValue: (string | Tag)[]) => {
        setSelectedTags(newValue.map((item) => typeof item === "string" ? item : item.label));
    };

    const handleNoteListItemClick = (noteId: string) => {
        navigate("/note/open/" + noteId);
    };

    return (
        <>
            <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={2}
                sx={{ marginTop: "10px" }}
            >
                <Grid item xs={2}>
                    <Breadcrumbs aria-label="breadcrumb">
                        <div
                            onClick={() => {
                                navigate("/");
                            }}
                        >
                            Home
                        </div>

                        <Typography color="text.primary">Notes</Typography>
                    </Breadcrumbs>
                </Grid>
                <Grid item xs={5}>
                    <TextField
                        fullWidth
                        label="Find Notes"
                        variant="outlined"
                        onChange={findNotes}
                        value={searchBarValue}
                        helperText="Input the full keywords to search"
                    />
                </Grid>

                <Grid item xs={5}>
                    <FormControl sx={{ m: 1 }} fullWidth>
                        <Autocomplete
                            multiple
                            id="tags-input"
                            options={suggestedTags}
                            value={selectedTags}
                            onChange={handleChange}
                            inputValue={inputValue}
                            onInputChange={handleInputChange}
                            getOptionLabel={(option) => typeof option === "string" ? option : option.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tags"
                                    helperText="Press enter to search for tags"
                                />
                            )}
                            freeSolo
                        />

                        {/*<Select*/}
                        {/*    labelId="demo-multiple-chip-label"*/}
                        {/*    id="demo-multiple-chip"*/}
                        {/*    multiple*/}
                        {/*    value={selectedTags}*/}
                        {/*    onChange={(event: SelectChangeEvent<string[]>) =>*/}
                        {/*        handleTagSelectChange(event)*/}
                        {/*    }*/}
                        {/*    input={*/}
                        {/*        <OutlinedInput*/}
                        {/*            id="select-multiple-chip"*/}
                        {/*            label="Chip"*/}
                        {/*        />*/}
                        {/*    }*/}
                        {/*    renderValue={(selected: string[]) => (*/}
                        {/*        <Box*/}
                        {/*            sx={{*/}
                        {/*                display: "flex",*/}
                        {/*                flexWrap: "wrap",*/}
                        {/*                gap: 0.5,*/}
                        {/*            }}*/}
                        {/*        >*/}
                        {/*            {selected.map((value: string) => (*/}
                        {/*                <Chip key={value} label={value} />*/}
                        {/*            ))}*/}
                        {/*        </Box>*/}
                        {/*    )}*/}
                        {/*>*/}
                        {/*    {fixedTags.map((name, id) => (*/}
                        {/*        <MenuItem key={id} value={name}>*/}
                        {/*            {name}*/}
                        {/*        </MenuItem>*/}
                        {/*    ))}*/}
                        {/*</Select>*/}

                    </FormControl>
                </Grid>
            </Grid>

            <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="flex-end"
            >
                <Grid item xs={8.2}>
                    <Button
                        variant="contained"
                        startIcon={<CloudUpload />}
                        onClick={() => {
                            setShowDialog(true);
                        }}
                    >
                        Note Upload
                    </Button>
                </Grid>
                <Grid item>
                    <IconButton
                        // aria-label="delete"
                        size="small"
                        onClick={() => {
                            page > 0 ? setPage(page - 1) : setPage(0);
                        }}
                        disabled={page == 0}
                    >
                        <ArrowBackIos fontSize="inherit" />
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography>{page + 1}</Typography>
                </Grid>
                <Grid item>
                    <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => {
                            setPage(page + 1);
                        }}
                        disabled={page == totalPages - 1}
                    >
                        <ArrowForwardIos fontSize="inherit" />
                    </IconButton>
                </Grid>
            </Grid>

            {/* Left sider */}
            <Grid
                container
                direction="row"
                justifyContent="space-evenly"
                alignItems="flex-start"
            >
                <Grid item xs={3}>
                    <Box sx={{ width: "100%" }}>
                        <List>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <CalendarMonthTwoToneIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Newest"
                                        onClick={() => {
                                            setSortBy("uploadDate");
                                            setAscending(false);
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <CalendarMonthTwoToneIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Oldest"
                                        onClick={() => {
                                            setSortBy("uploadDate");
                                            setAscending(true);
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <RemoveRedEyeTwoTone />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Most Views"
                                        onClick={() => {
                                            setSortBy("viewCount");
                                            setAscending(false);
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ThumbUpAltTwoTone />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Most Likes"
                                        onClick={() => {
                                            setSortBy("likeCount");
                                            setAscending(false);
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={9}>
                    <NoteList
                        noteList={noteList}
                        handleNoteListItemClick={handleNoteListItemClick}
                    />
                </Grid>
            </Grid>
            <NoteUploadDialog open={showDialog} setOpen={setShowDialog} />
        </>
    );
};
