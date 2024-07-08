import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance.ts";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/APIResponse.ts";
import ResponseCodes from "../entity/ResponseCodes.ts";
import swal from "sweetalert";
import { Note } from "../entity/Note.ts";
import {
	Box,
	Breadcrumbs,
	Button,
	Chip,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
import {
	ArrowBackIos,
	ArrowForwardIos,
	CloudUpload,
	RemoveRedEyeTwoTone,
	ThumbUpAltTwoTone,
} from "@mui/icons-material";
import { NoteUploadDialog } from "../components/Note/NoteUploadDialog.tsx";
import { useNavigate } from "react-router-dom";
import { NoteList } from "../components/Note/NoteList.tsx";

export const NotePage = () => {
	const [noteList, setNoteList] = useState<Note[]>([]);
	const pageSize: number = 10; // fixed page size for pagination
	const [page, setPage] = useState<number>(0);
	const [sortBy, setSortBy] = useState<string>("uploadDate");
	const [ascending, setAscending] = useState<boolean>(false);
	const [showDialog, setShowDialog] = useState<boolean>(false);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [availableTags, setAvailableTags] = useState<string[]>([]);
	const [searchBarValue, setSearchBarValue] = useState<string>("");
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
						ascending: ascending,
					},
				})
				.then((resp) => {
					if (resp.data.code == ResponseCodes.SUCCESS) {
						setNoteList(resp.data.data.content);
						setTotalPages(resp.data.data.totalPages);
					} else {
						swal("Error", resp.data.message, "error");
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
						ascending: ascending,
					},
				})
				.then((resp) => {
					if (resp.data.code == ResponseCodes.SUCCESS) {
						setNoteList(resp.data.data.content);
						setTotalPages(resp.data.data.totalPages);
					} else {
						swal("Error", resp.data.message, "error");
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
						ascending: ascending,
					},
				})
				.then((response) => {
					if (response.data.code == ResponseCodes.SUCCESS) {
						setNoteList(response.data.data.content);
						setTotalPages(response.data.data.totalPages);
					} else {
						swal("Error", response.data.message, "error");
					}
				});
		}
	}, [sortBy, page, ascending, availableTags, searchBarValue, selectedTags]);

	useEffect(() => {
		// fetch tags
		axiosInstance
			.get("/note/get/allTags")
			.then((response: AxiosResponse<APIResponse<string[]>>) => {
				if (response.data.code == ResponseCodes.SUCCESS) {
					setAvailableTags(response.data.data);
				} else {
					swal("Error", response.data.message, "error");
				}
			});
	}, []);

	const findNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		setSearchBarValue(event.target.value);
	};

	const handleTagSelectChange = (event: SelectChangeEvent<string[]>) => {
		const {
			target: { value },
		} = event;
		setSelectedTags(typeof value === "string" ? value.split(",") : value);
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
				sx={{ marginTop: "10px" }}
			>
				<Grid item xs={3}>
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
				<Grid item xs={4}>
					<TextField
						fullWidth
						label="Find Notes"
						variant="outlined"
						onChange={findNotes}
						value={searchBarValue}
					/>
				</Grid>
				<Grid item>
					<FormControl sx={{ m: 1, width: 300 }}>
						<InputLabel id="demo-multiple-chip-label">
							Find tags
						</InputLabel>
						<Select
							labelId="demo-multiple-chip-label"
							id="demo-multiple-chip"
							multiple
							value={selectedTags}
							onChange={(event: SelectChangeEvent<string[]>) =>
								handleTagSelectChange(event)
							}
							input={
								<OutlinedInput
									id="select-multiple-chip"
									label="Chip"
								/>
							}
							renderValue={(selected: string[]) => (
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										gap: 0.5,
									}}
								>
									{selected.map((value: string) => (
										<Chip key={value} label={value} />
									))}
								</Box>
							)}
						>
							{availableTags.map((name, id) => (
								<MenuItem key={id} value={name}>
									{name}
								</MenuItem>
							))}
						</Select>
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
						aria-label="delete"
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
