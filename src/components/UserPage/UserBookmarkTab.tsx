import { TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/APIResponse";
import { Bookmark } from "../../entity/Bookmark";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Chip,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Stack,
	Typography,
} from "@mui/material";
import {
	ExpandMoreOutlined,
	RemoveRedEye,
	ThumbUpAltOutlined,
} from "@mui/icons-material";
import { NoteBookmark } from "../../entity/NoteBookmark";
import { useNavigate } from "react-router-dom";

type UserBookmarkTabProps = {
	userId: number;
};
export const UserBookmarkTab = ({ userId }: UserBookmarkTabProps) => {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	useEffect(() => {
		getBookmarks();
	}, []);

	const getBookmarks = () => {
		axiosInstance
			.get("/bookmark/get/by/userId", {
				params: {
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<Bookmark[]>>) => {
				setBookmarks(response.data.data);
			});
	};
	const navigate = useNavigate();
	const handleNoteListItemClick = (noteId: string) => {
		navigate(`/note/open/${noteId}`);
	};
	return (
		<TabPanel value="5" sx={{ padding: 0 }}>
			{bookmarks.map((bookmark: Bookmark) => (
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreOutlined />}
						id={bookmark.bookmarkId.toString()}
					>
						{bookmark.bookmarkName}
					</AccordionSummary>
					<AccordionDetails sx={{ padding: 0 }}>
						<List sx={{ width: "100%" }}>
							{bookmark.noteBookmarks.map(
								(noteBookmark: NoteBookmark) => (
									<ListItem
										key={noteBookmark.noteBookmarkId}
										alignItems="flex-start"
										disablePadding
									>
										<ListItemButton
											onClick={() =>
												handleNoteListItemClick(
													noteBookmark.note.noteId
												)
											}
										>
											<ListItemAvatar>
												<Avatar
													alt="user avatar"
													src={
														noteBookmark.note.author
															.avatarUrl
													}
												/>
											</ListItemAvatar>
											<ListItemText
												primary={
													noteBookmark.note.title
												}
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
																	noteBookmark
																		.note
																		.viewCount
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
																	noteBookmark
																		.note
																		.likeCount
																}
															</Typography>
														</>
													</Stack>
												}
											/>
											<Stack direction="row" spacing={1}>
												{noteBookmark.note.tags.map(
													(tag) => (
														<Chip
															label={tag.tagText}
														></Chip>
													)
												)}
											</Stack>
										</ListItemButton>
									</ListItem>
								)
							)}
						</List>
					</AccordionDetails>
				</Accordion>
			))}
		</TabPanel>
	);
};
