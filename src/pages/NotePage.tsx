import CustomHeader from "../components/CustomHeader.tsx";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance.ts";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/APIResponse.ts";
import ResponseCodes from "../entity/ResponseCodes.ts";
import swal from "sweetalert";
import { Note } from "../entity/Note.ts";
import {
	Avatar,
	Box,
	Breadcrumbs,
	Button,
	Chip,
	Divider,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	SelectChangeEvent,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/RemoveRedEye";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import CalendarMonthTwoToneIcon from "@mui/icons-material/CalendarMonthTwoTone";
import {
	ArrowBackIos,
	ArrowForwardIos,
	CloudUpload,
	RemoveRedEyeTwoTone,
	ThumbUpAltTwoTone,
} from "@mui/icons-material";
import { NoteUploadDialog } from "../components/NoteUploadDialog.tsx";

export const NotePage = () => {
	const [noteList, setNoteList] = useState<Note[]>([]);
	const pageSize: number = 10; // fixed page size for pagination
	const [page, setPage] = useState<number>(0);
	const [sortBy, setSortBy] = useState<string>("uploadDate");
	const [ascending, setAscending] = useState<boolean>(false);
	const [showDialog, setShowDialog] = useState<boolean>(false);
	useEffect(() => {
		// fetch note
		axiosInstance
			.get("/note/get/order", {
				params: {
					page: 0,
					size: 10,
					orderBy: sortBy,
					ascending: ascending,
				},
			})
			.then((response) => {
				if (response.data.code == ResponseCodes.SUCCESS) {
					setNoteList(response.data.data.content);
				} else {
					swal("Error", response.data.message, "error");
				}
			});
	}, [sortBy, page, ascending]);

	useEffect(() => {
		// fetch tags
		axiosInstance
			.get("/note/get/allTags")
			.then((response: AxiosResponse<APIResponse<string[]>>) => {
				if (response.data.code == ResponseCodes.SUCCESS) {
					setAvaliableTags(response.data.data);
				} else {
					swal("Error", response.data.message, "error");
				}
			});
	}, []);

	const findNotes = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault();
		axiosInstance
			.get("/note/get/title", {
				params: {
					title: event.target.value,
				},
			})
			.then((resp: AxiosResponse<APIResponse<Note[]>>) => {
				if (resp.data.code == ResponseCodes.SUCCESS) {
					setNoteList(resp.data.data);
				} else {
					swal("Error", resp.data.message, "error");
				}
			});
	};

	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [avaliableTags, setAvaliableTags] = useState<string[]>([]);

	useEffect(() => {
		if (selectedTags.length > 0) {
			axiosInstance
				.post("note/get/tags",0,{ 
					params:{
						tags:selectedTags.join(",")
					}
				})
				.then((resp: AxiosResponse<APIResponse<Note[]>>) => {
					if (resp.data.code == ResponseCodes.SUCCESS) {
						setNoteList(resp.data.data);
					} else {
						swal("Error", resp.data.message, "error");
					}
				});
		}
	}, [selectedTags]); // This useEffect hook will run every time selectedTags changes

	const handleTagSelectChange = (event: SelectChangeEvent) => {
		const {
			target: { value },
		} = event;
		setSelectedTags(typeof value === "string" ? value.split(",") : value);
	};

	return (
		<>
			<CustomHeader />
			<Grid
				container
				direction="row"
				justifyContent="space-evenly"
				alignItems="center"
				sx={{ marginTop: "10px" }}
			>
				<Grid item xs={3}>
					<Breadcrumbs aria-label="breadcrumb">
						<div>Home</div>
						<Typography color="text.primary">Notes</Typography>
					</Breadcrumbs>
				</Grid>
				<Grid item xs={4}>
					<TextField
						fullWidth
						label="Find Notes"
						variant="outlined"
						onChange={findNotes}
					/>
				</Grid>
				<Grid item>
					<FormControl sx={{ m: 1, width: 300 }}>
						<InputLabel id="demo-multiple-chip-label">Find tags</InputLabel>
						<Select
							labelId="demo-multiple-chip-label"
							id="demo-multiple-chip"
							multiple
							value={selectedTags}
							onChange={handleTagSelectChange}
							input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
							renderValue={(selected) => (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
								</Box>
							)}
						>
							{avaliableTags.map((name, id) => (
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
					>
						<ArrowBackIos fontSize="inherit" />
					</IconButton>
				</Grid>
				<Grid item>
					<IconButton
						aria-label="delete"
						size="small"
						onClick={() => {
							setPage(page + 1);
						}}
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
					<List sx={{ width: "100%" }}>
						{noteList.map((value) => (
							<ListItem
								key={value.noteId}
								alignItems="flex-start"
								disablePadding
							>
								<ListItemButton>
									<ListItemAvatar>
										<Avatar
											alt="user avatar"
											src={value.author.avatarUrl}
										/>
									</ListItemAvatar>
									<ListItemText
										primary={value.title}
										secondary={
											<Stack
												direction="row"
												divider={<Divider orientation="vertical" flexItem />}
												spacing={1}
											>
												<>
													<VisibilityOutlinedIcon
														fontSize="small"
														sx={{ marginRight: "3px" }}
													/>
													<Typography
														variant="body2"
														color="text.secondary"
														sx={{ marginRight: "20px" }}
													>
														{value.viewCount}
													</Typography>
												</>
												<>
													<ThumbUpAltOutlinedIcon
														fontSize="small"
														sx={{ marginRight: "3px" }}
													/>
													<Typography variant="body2" color="text.secondary">
														{value.likeCount}
													</Typography>
												</>
											</Stack>
										}
									/>
									<Stack direction="row" spacing={1}>
										{value.tags.map((tag) => (
											<Chip label={tag.tagText}></Chip>
										))}
									</Stack>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Grid>
			</Grid>
			<NoteUploadDialog open={showDialog} setOpen={setShowDialog} />
		</>
	);
};
