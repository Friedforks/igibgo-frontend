import { useParams } from "react-router-dom";
import { FUser } from "../entity/FUser";
import { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader";
import { Box, Grid, Skeleton, Tab } from "@mui/material";
import axiosInstance from "../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/APIResponse";
import { ShortUserInfoDisplay } from "../components/ShortUserInfoDisplay";
import { TabContext, TabList } from "@mui/lab";
import { Note } from "../entity/Note";
import { UserNotesTab } from "../components/UserPage/UserNotesTab";
import { UserBookmarkTab } from "../components/UserPage/UserBookmarkTab";

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
	}, []);

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
										{/* {isCurrentUser && ( */}
										{/* <Tab
												label="User settings"
												value="4"
											/>
										)} */}
										{isCurrentUser && (
											<Tab
												label="Note bookmarks"
												value="5"
											/>
										)}
									</TabList>
								</Box>
								<UserNotesTab noteList={noteList} />
								{/* <TabPanel value="2">Item Two</TabPanel> */}
								{/* <TabPanel value="3">Item Three</TabPanel> */}
								{/* <TabPanel value="4">settings</TabPanel> */}
								<UserBookmarkTab userId={currentUserId} />
							</TabContext>
						</Box>
					</Grid>
				</Grid>
			</div>
		</>
	);
};
