import { useNavigate, useParams } from "react-router-dom";
import { FUser } from "../entity/FUser";
import { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader";
import {
	Avatar,
	Box,
	Chip,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Skeleton,
	Stack,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import axiosInstance from "../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/APIResponse";
import { ShortUserInfoDisplay } from "../components/ShortUserInfoDisplay";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Note } from "../entity/Note";
import { RemoveRedEye, ThumbUpAltOutlined } from "@mui/icons-material";
import { NoteBookmark } from "../entity/NoteBookmark";

export const UserPage = () => {
	const params = useParams();
	const currentUserId = params.userId as unknown as number;
	const savedUserId = (
		JSON.parse(localStorage.getItem("userInfo") as string) as FUser
	).userId;
	const isCurrentUser = currentUserId == savedUserId;
	const [user, setUser] = useState<FUser>();
	const [tabPage, setTabPage] = useState<string>("1");
	const [noteList, setNoteList] = useState<Note[]>([]);
	const [noteBookmarkList, setNoteBookmarkList] = useState<BookmarksByFolder[]>(
		[]
	);
	useEffect(() => {
		// console.log("debug: currentUserId", currentUserId);
		// console.log("debug: isCurrentUser", isCurrentUser);
		// console.log("debug: savedUserId", savedUserId);
		axiosInstance
			.get("/fuser/userId", {
				params: {
					userId: currentUserId,
					token: localStorage.getItem("token"),
				},
			})
			.then((response: AxiosResponse<APIResponse<FUser>>) => {
				setUser(response.data.data);
			});
		getNotes();
		getCurrentUser();
		getNoteBookmarks();
	}, []);

	type BookmarksByFolder = {
		[folder: string]: NoteBookmark[];
	};

	const getNoteBookmarks = () => {
		axiosInstance
			.get("/note/get/bookmarks/user", {
				params: {
					userId: currentUserId,
				},
			})
			// .then((response: AxiosResponse<APIResponse<BookmarksByFolder[]>>) => {
				.then((response)=>{
				console.log("bookmarks: ", response.data.data);
				// setNoteBookmarkList(response.data.data);
			});
	};

	const getCurrentUser = () => {
		axiosInstance
			.get("/fuser/userId", {
				params: {
					userId: currentUserId,
					token: localStorage.getItem("token"),
				},
			})
			.then((response: AxiosResponse<APIResponse<FUser>>) => {
				setUser(response.data.data);
			});
	};

	const getNotes = () => {
		axiosInstance
			.get("/note/get/all", { params: { userId: currentUserId } })
			.then((response: AxiosResponse<APIResponse<Note[]>>) => {
				setNoteList(response.data.data);
			});
	};

	const handleChange = (event: React.SyntheticEvent, newTabPage: string) => {
		setTabPage(newTabPage);
	};

	const navigate = useNavigate();
	const handleNoteListItemClick = (noteId: string) => {
		navigate(`/note/open/${noteId}`);
	};

	if (user == undefined) {
		return <Skeleton></Skeleton>;
	}

	return (
		<>
			<CustomHeader />
			<div>
				<Grid
					container
					style={{
						paddingLeft: "5%",
						paddingTop: "2%",
						paddingRight: "5%",
					}}
					direction="column"
					spacing={3}
				>
					<Grid item xs={2}>
						<ShortUserInfoDisplay
							userId={user?.userId}
							dataUpdateRequired={false}
							avatarSize={70}
						/>
					</Grid>
					<Grid item>
						<Box sx={{ typography: "body1" }}>
							<TabContext value={tabPage}>
								<Box
									sx={{
										borderBottom: 1,
										borderColor: "divider",
									}}
								>
									<TabList
										onChange={handleChange}
										aria-label="lab API tabs example"
									>
										<Tab label="Notes" value="1" />
										{/* <Tab label="Videos" value="2" /> */}
										{/* <Tab label="Posts" value="3" /> */}
										{isCurrentUser && (
											<Tab
												label="User settings"
												value="4"
											/>
										)}
										{isCurrentUser && (
											<Tab
												label="Note bookmarks"
												value="5"
											/>
										)}
									</TabList>
								</Box>
								<TabPanel value="1">
									<List sx={{ width: "100%" }}>
										{noteList.map((value) => (
											<ListItem
												key={value.noteId}
												alignItems="flex-start"
												disablePadding
											>
												<ListItemButton
													onClick={() =>
														handleNoteListItemClick(
															value.noteId
														)
													}
												>
													<ListItemAvatar>
														<Avatar
															alt="user avatar"
															src={
																value.author
																	.avatarUrl
															}
														/>
													</ListItemAvatar>
													<ListItemText
														primary={value.title}
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
																	<RemoveRedEye
																		fontSize="small"
																		sx={{
																			marginRight:
																				"3px",
																		}}
																	/>
																	<Typography
																		variant="body2"
																		color="text.secondary"
																		sx={{
																			marginRight:
																				"20px",
																		}}
																	>
																		{
																			value.viewCount
																		}
																	</Typography>
																</>
																<>
																	<ThumbUpAltOutlined
																		fontSize="small"
																		sx={{
																			marginRight:
																				"3px",
																		}}
																	/>
																	<Typography
																		variant="body2"
																		color="text.secondary"
																	>
																		{
																			value.likeCount
																		}
																	</Typography>
																</>
															</Stack>
														}
													/>
													<Stack
														direction="row"
														spacing={1}
													>
														{value.tags.map(
															(tag) => (
																<Chip
																	label={
																		tag.tagText
																	}
																></Chip>
															)
														)}
													</Stack>
												</ListItemButton>
											</ListItem>
										))}
									</List>
								</TabPanel>
								{/* <TabPanel value="2">Item Two</TabPanel> */}
								{/* <TabPanel value="3">Item Three</TabPanel> */}
								<TabPanel value="4">settings</TabPanel>
								<TabPanel value="5">noteBookmarkList</TabPanel>
							</TabContext>
						</Box>
					</Grid>
				</Grid>
			</div>
		</>
	);
};
