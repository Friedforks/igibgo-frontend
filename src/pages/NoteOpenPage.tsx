import { Grid, Skeleton, Stack, Typography } from "@mui/material";
import CustomHeader from "../components/CustomHeader";
import {
	Star,
	StarBorderOutlined,
	ThumbUp,
	ThumbUpOutlined,
	VisibilityOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import APIResponse from "../entity/APIResponse";
import { Note } from "../entity/Note";
import { ShortUserInfoDisplay } from "../components/ShortUserInfoDisplay";
import { FUser } from "../entity/FUser";
import swal from "sweetalert";
import { AxiosResponse } from "axios";
import { BookmarkDialog } from "../components/BookmarkDialog";

export const NoteOpenPage = () => {
	const [currentNote, setCurrentNote] = useState<Note>();
	const [loading, setLoading] = useState(true);
	const [height, setHeight] = useState(window.innerHeight);
	const [totalLike, setTotalLike] = useState<number>(0);
	const [totalSave, setTotalSave] = useState<number>(0);
	const [totalView, setTotalView] = useState<number>(0);
	const [isLiked, setLiked] = useState(false);
	const [isStarred, setStarred] = useState(false);
	const [dataUpdateRequired, setDataUpdateRequired] = useState(false);
	const [bookmarkDialogOpen, setBookmarkDialogOpen] = useState(false);
	const currentNoteId = "56f782e9-0887-4688-9b32-64bde9d76124";
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
	}, []);

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
				console.log("saved", response.data.data);
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
				console.log("liked", response.data.data);
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
	useEffect(() => {
		if (currentNote === undefined) return;
		getTotalLike();
		getTotalSave();
		getTotalView();
	}, [currentNote]);
	window.onresize = () => {
		setHeight(window.innerHeight);
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
		console.log("clicked unlike");
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
		console.log("clicked save");
		setBookmarkDialogOpen(true);
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

	const centered = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	};
	return (
		<>
			<CustomHeader />
			<Grid
				container
				spacing={2}
				style={{
					paddingLeft: "5%",
					paddingTop: "2%",
				}}
			>
				<Grid item xs={8}>
					<Typography variant="h6">{currentNote?.title}</Typography>
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
						justifyContent="space-around"
						spacing={10}
						style={centered}
						marginTop={2}
					>
						<div>
							<Stack spacing={0.5} alignItems="center">
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
					</Stack>
				</Grid>
			</Grid>
			<BookmarkDialog
				open={bookmarkDialogOpen}
				setOpen={setBookmarkDialogOpen}
				currentNoteId={currentNoteId}
				setStarred={setStarred}
				setDataUpdateRequired={setDataUpdateRequired}
			/>
		</>
	);
};
