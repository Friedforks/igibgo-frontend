import {
	Avatar,
	Chip,
	Divider,
	Fade,
	Grid,
	IconButton,
	InputAdornment,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Skeleton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import {
	Comment,
	CommentOutlined,
	Delete,
	Send,
	Star,
	StarBorderOutlined,
	ThumbUp,
	ThumbUpOutlined,
	VisibilityOutlined,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import APIResponse from "../entity/APIResponse";
import { Note } from "../entity/Note";
import { ShortUserInfoDisplay } from "../components/UtilComponents/ShortUserInfoDisplay.tsx";
import { FUser } from "../entity/FUser";
import swal from "sweetalert";
import { AxiosResponse } from "axios";
import { BookmarkDialog } from "../components/Upload/BookmarkDialog.tsx";
import ResponseCodes from "../entity/ResponseCodes";
import { NoteReply } from "../entity/NoteReply";
import { useNavigate, useParams } from "react-router-dom";

export const NoteOpenPage = () => {
	const [currentNote, setCurrentNote] = useState<Note>();
	const [loading, setLoading] = useState(true);
	const [height, setHeight] = useState(window.innerHeight);
	const [totalLike, setTotalLike] = useState<number>(0);
	const [totalSave, setTotalSave] = useState<number>(0);
	const [totalView, setTotalView] = useState<number>(0);
	const [totalReply, setTotalReply] = useState<number>(0);
	const [isLiked, setLiked] = useState(false);
	const [isStarred, setStarred] = useState(false);
	const [isReplied, setReplied] = useState(false);
	const [dataUpdateRequired, setDataUpdateRequired] = useState(false);
	const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
	const [replyClicked, setReplyClicked] = useState(false);
	const [replies, setReplies] = useState<NoteReply[]>([]);

	const params=useParams();
	const currentNoteId = params.noteId;
	const userInfo = JSON.parse(
		localStorage.getItem("userInfo") as string
	) as FUser;
	const userId = userInfo.userId;
	useEffect(() => {
		setHeight(window.innerHeight);
		axiosInstance
			.get("/note/get/noteId", {
				params: {
					noteId: currentNoteId,
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<Note>>) => {
				const responseData = response.data.data;
				const date = new Date(responseData.uploadDate);
				const formattedDate =
					date.toLocaleDateString("zh-Hans-CN") +
					" " +
					date.toLocaleTimeString();
				responseData.uploadDate = formattedDate;
				setCurrentNote(responseData);
				setLoading(false);
			});
		// query for user note status
		getLikeStatus();
		getSaveStatus();
		getReplyStatus();
	}, []);

	useEffect(() => {
		if (currentNote === undefined) return;
		getTotalLike();
		getTotalSave();
		getTotalView();
		getTotalReply();
		getReplies();
		getLikeStatus();
		getSaveStatus();
		getReplyStatus();
	}, [currentNote, dataUpdateRequired]);
	window.onresize = () => {
		setHeight(window.innerHeight);
	};
	const navigate=useNavigate();

	const getLikeStatus = () => {
		// query for starred or liked status
		axiosInstance
			.get("/note/is/liked", {
				params: {
					noteId: currentNoteId,
					userId: userId,
				},
			})
			.then((response) => {
				setLiked(response.data.data);
			});
	};
	const getSaveStatus = () => {
		axiosInstance
			.get("/note/is/saved", {
				params: {
					noteId: currentNoteId,
					userId: userId,
				},
			})
			.then((response) => {
				setStarred(response.data.data);
			});
	};
	const getReplyStatus = () => {
		axiosInstance
			.get("/note/is/replied", {
				params: {
					noteId: currentNoteId,
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<boolean>>) => {
				setReplied(response.data.data);
			});
	};

	const getTotalLike = () => {
		axiosInstance
			.get("/note/total/like", {
				params: {
					noteId: currentNoteId,
				},
			})
			.then((response) => {
				setTotalLike(response.data.data);
			});
	};
	const getTotalSave = () => {
		axiosInstance
			.get("/note/total/save", {
				params: {
					noteId: currentNoteId,
				},
			})
			.then((response) => {
				setTotalSave(response.data.data);
			});
	};
	const getTotalView = () => {
		axiosInstance
			.get("/note/total/view", {
				params: {
					noteId: currentNoteId,
				},
			})
			.then((response) => {
				setTotalView(response.data.data);
			});
	};
	const getTotalReply = () => {
		axiosInstance
			.get("/note/total/reply", {
				params: {
					noteId: currentNoteId,
				},
			})
			.then((response: AxiosResponse<APIResponse<number>>) => {
				setTotalReply(response.data.data);
			});
	};
	const getReplies = () => {
		axiosInstance
			.get("/note/get/reply", {
				params: {
					noteId: currentNoteId,
				},
			})
			.then((response: AxiosResponse<APIResponse<NoteReply[]>>) => {
				if (response.data.code == ResponseCodes.SUCCESS) {
					setReplies(response.data.data);
				} else {
					console.log(
						"Error in fetching replies: ",
						response.data.message
					);
				}
			});
	};
	const likeNote = () => {
		setLiked(true);
		axiosInstance
			.get("/note/like", {
				params: {
					noteId: currentNoteId,
					userId: userId,
				},
			})
			.then(() => {
				getTotalLike();
				setDataUpdateRequired(!dataUpdateRequired);
			})
			.catch((error) => {
				swal("Error", error.response.data.message, "error");
			});
	};

	const unlikeNote = () => {
		setLiked(false);
		axiosInstance
			.get("/note/unlike", {
				params: {
					noteId: currentNoteId,
					userId: userId,
				},
			})
			.then(() => {
				getTotalLike();
				setDataUpdateRequired(!dataUpdateRequired);
			});
	};

	const saveNote = () => {
		setBookmarkDialogOpen(true);
	};

	const replySubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const replyContent = formData.get("replyContent") as string;
		// check if reply text is empty
		if (replyContent === "") {
			swal("Error", "Reply text cannot be empty", "error");
			return;
		}
		axiosInstance
			.get("/note/reply", {
				params: {
					noteId: currentNoteId,
					authorId: userId,
					replyContent: replyContent,
				},
			})
			.then(() => {
				setReplyClicked(false);
				getTotalReply();
				setDataUpdateRequired(!dataUpdateRequired);
			})
			.catch((error) => {
				swal("Error", error.response.data.message, "error");
			});
	};
	const deleteReply = (replyId: number) => {
		const token = localStorage.getItem("token");
		if (token == null) {
			swal("Error", "Please login to delete reply", "error");
		} else {
			axiosInstance
				.get("/note/delete/reply", {
					params: {
						replyId: replyId,
						token: localStorage.getItem("token"),
					},
				})
				.then(() => {
					getTotalReply();
					setDataUpdateRequired(!dataUpdateRequired);
				})
				.catch((error) => {
					swal("Error", error.response.data.message, "error");
				});
		}
	};

	if (loading) {
		return (
			<>
				<Skeleton />
				<Skeleton animation="wave" />
				<Skeleton animation={false} />
			</>
		);
	}

	return (
		<>
			<Grid
				container
				spacing={2}
				style={{
					padding: "1rem",
				}}
			>
				<Grid item xs={8}>
					{/* Title section */}
					<Typography variant="h5">{currentNote?.title}</Typography>
					<div style={{ marginTop: "5px" }}>
						<Stack direction="row" spacing={2}>
							<div>
								<Stack direction="row" spacing={0.5}>
									<ThumbUpOutlined fontSize="small" />
									<span>{totalLike}</span>
								</Stack>
							</div>
							<div>
								<Stack direction="row" spacing={0.5}>
									<VisibilityOutlined fontSize="small" />
									<span>{totalView}</span>
								</Stack>
							</div>
							<div>
								<Stack direction="row" spacing={0.5}>
									<StarBorderOutlined fontSize="small" />
									<span>{totalSave}</span>
								</Stack>
							</div>
							<div>{currentNote?.uploadDate.toString()}</div>
						</Stack>
						<iframe
							style={{ marginTop: "10px" }}
							src={currentNote?.noteUrl}
							width="100%"
							height={height * 0.8}
						></iframe>
					</div>
					{/* comments */}
				</Grid>
				<Grid item xs={4}>
					<ShortUserInfoDisplay
						userId={currentNote?.author.userId}
						dataUpdateRequired={dataUpdateRequired}
					/>
					<Stack
						direction="row"
						justifyContent="space-evenly"
						marginTop={2}
					>
						<div>
							<Stack spacing={0.2} alignItems="center">
								<div>
									{isLiked ? (
										<div onClick={unlikeNote}>
											<ThumbUp fontSize="large" />
										</div>
									) : (
										<div onClick={likeNote}>
											<ThumbUpOutlined fontSize="large" />
										</div>
									)}
								</div>
								<span>{totalLike}</span>
							</Stack>
						</div>
						<div>
							<Stack spacing={0.5} alignItems="center">
								<div>
									{isStarred ? (
										<div onClick={saveNote}>
											<Star fontSize="large" />
										</div>
									) : (
										<div onClick={saveNote}>
											<StarBorderOutlined fontSize="large" />
										</div>
									)}
								</div>
								<span>{totalSave}</span>
							</Stack>
						</div>
						<div>
							<Stack spacing={0.5} alignItems="center">
								<div
									onClick={() => {
										setReplyClicked(!replyClicked);
									}}
								>
									{isReplied ? (
										<div>
											<Comment fontSize="large" />
										</div>
									) : (
										<div>
											<CommentOutlined fontSize="large" />
										</div>
									)}
								</div>
								<span>{totalReply}</span>
							</Stack>
						</div>
					</Stack>
					<Divider textAlign="left" style={{ marginTop: "20px" }}>
						<Chip label="Comments" size="small" />
					</Divider>
					{/* new reply */}
					<form onSubmit={replySubmit}>
						{replyClicked && (
							<Fade in={replyClicked}>
								<TextField
									label="New comment"
									style={{
										marginTop: "10px",
										width: "90%",
										marginLeft: "3%",
									}}
									name="replyContent"
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton type="submit">
													<Send />
												</IconButton>
											</InputAdornment>
										),
									}}
								></TextField>
							</Fade>
						)}
					</form>
					{/* Replies */}
					<List>
						{replies.map((reply: NoteReply) => (
							<ListItem
								alignItems="flex-start"
								key={reply.noteReplyId}
								secondaryAction={
									reply.author.userId === userId && (
										<IconButton
											onClick={() =>
												deleteReply(reply.noteReplyId)
											}
										>
											<Delete />
										</IconButton>
									)
								}
							>
								<ListItemAvatar onClick={()=>{navigate('/user/'+reply.author.userId)}}>
									<Avatar
										src={reply.author.avatarUrl}
										alt={reply.author.username}
									/>
								</ListItemAvatar>
								<ListItemText
									primary={reply.author.username}
									secondary={
										<React.Fragment>
											<Typography
												sx={{ display: "inline" }}
												component="span"
												variant="body2"
												color="text.primary"
											>
												<span
													style={{
														wordWrap: "break-word",
													}}
												>
													{reply.replyContent}
												</span>
											</Typography>
										</React.Fragment>
									}
								></ListItemText>
							</ListItem>
						))}
					</List>
				</Grid>
			</Grid>
			<BookmarkDialog
				open={bookmarkDialogOpen}
				setOpen={setBookmarkDialogOpen}
				currentNoteId={currentNoteId || ""}
				setStarred={setStarred}
				dataUpdateRequired={dataUpdateRequired}
				setDataUpdateRequired={setDataUpdateRequired}
			/>
		</>
	);
};
