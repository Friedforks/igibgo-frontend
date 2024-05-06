import { Grid, Skeleton, Stack, Typography } from "@mui/material";
import CustomHeader from "../components/CustomHeader";
import {
	StarBorderOutlined,
	ThumbUpOutlined,
	VisibilityOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/APIResponse";
import { Note } from "../entity/Note";
import { ShortUserInfoDisplay } from "../components/ShortUserInfoDisplay";
import { FUser } from "../entity/FUser";

export const NoteOpenPage = () => {
	const [currentNote, setCurrentNote] = useState<Note>();
	const [loading, setLoading] = useState(true);
	const [height, setHeight] = useState(window.innerHeight);
	const [totalLike, setTotalLike] = useState<number>(0);
	const [totalSave, setTotalSave] = useState<number>(0);
	const [totalView, setTotalView] = useState<number>(0);
	const currentNoteId = "56f782e9-0887-4688-9b32-64bde9d76124";
	useEffect(() => {
		setHeight(window.innerHeight);
		const userInfo = JSON.parse(
			localStorage.getItem("userInfo") as string
		) as FUser;
		const userId = userInfo.userId;
		axiosInstance
			.get("/note/get/noteId", {
				params: {
					noteId: currentNoteId,
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<Note>>) => {
				const resposneData = response.data.data;
				const date = new Date(resposneData.uploadDate);
				const formated_date =
					date.toLocaleDateString("zh-Hans-CN") +
					" " +
					date.toLocaleTimeString();
				resposneData.uploadDate = formated_date;
				setCurrentNote(resposneData);
				setLoading(false);
			});

		// query for note statistics
		axiosInstance
			.get("/note/total/like", {
				params: {
					noteId: currentNoteId,
				},
			})
			.then((response) => {
				setTotalLike(response.data.data);
			});

		axiosInstance
			.get("/note/total/save", {
				params: {
					noteId: currentNoteId,
				},
			})
			.then((response) => {
				setTotalSave(response.data.data);
			});
		axiosInstance
			.get("/note/total/view", {
				params: {
					noteId: currentNoteId,
				},
			})
			.then((response) => {
				setTotalView(response.data.data);
			});
	}, []);

	useEffect(() => {
		if (currentNote === undefined) return;
		axiosInstance
			.get("/fuser/total/like", {
				params: {
					userId: currentNote?.author.userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<number>>) => {
				setTotalLike(response.data.data);
			});

		axiosInstance
			.get("/fuser/total/save", {
				params: {
					userId: currentNote?.author.userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<number>>) => {
				setTotalSave(response.data.data);
			});
	}, [currentNote]);
	window.onresize = () => {
		setHeight(window.innerHeight);
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
					<ShortUserInfoDisplay userId={currentNote?.author.userId} />
					<Stack
						direction="row"
						justifyContent="space-around"
						spacing={10}
						style={centered}
						marginTop={2}
					>
						<div>
							<Stack spacing={0.5} alignItems="center">
								{}
								<ThumbUpOutlined fontSize="large" />
								<span>{totalLike}</span>
							</Stack>
						</div>
						<div>
							<Stack spacing={0.5} alignItems="center">
								<StarBorderOutlined fontSize="large" />
								<span>{totalSave}</span>
							</Stack>
						</div>
					</Stack>
				</Grid>
			</Grid>
		</>
	);
};
