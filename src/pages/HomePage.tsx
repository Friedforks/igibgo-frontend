 import { NotePage } from "./NotePage.tsx";

export const HomePage = () => {
	// const [noteList, setNoteList] = useState<Note[]>([]);
	// useEffect(() => {
	// 	axiosInstance
	// 		.get("/note/get/order", {
	// 			params: {
	// 				page: 0,
	// 				size: 10,
	// 				orderBy: "uploadDate",
	// 				ascending: false,
	// 			},
	// 		})
	// 		.then((resp) => {
	// 			if (resp.data.code == ResponseCodes.SUCCESS) {
	// 				setNoteList(resp.data.data.content);
	// 			} else {
	// 				sweetAlert("Error", resp.data.message, "error");
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			sweetAlert("Error", err.message, "error");
	// 		});
	// }, []);
	return (
        <NotePage/>
		// <>
		// 	<CustomHeader />

		// 	<div style={{ margin: "5vh" }}>
		// 		<Divider textAlign="left" sx={{ marginTop: "2vh" }}>
		// 			<Chip label="Videos" />
		// 		</Divider>
		// 		{/* <Grid
		// 			container
		// 			spacing={2}
		// 			sx={{ marginTop: "2vh", marginLeft: "2vw" }}
		// 		>
		// 			{[0, 1, 2, 3].map(() => (
		// 				<Grid item>
		// 					<Card sx={{ width: "200px", height: "250px" }}>
		// 						<CardActionArea>
		// 							<CardMedia
		// 								component="img"
		// 								height="150px"
		// 								image="https://source.unsplash.com/random"
		// 								alt="video cover"
		// 							/>
		// 							<CardContent>
		// 								<Typography variant="h6">
		// 									{" "}
		// 									title
		// 								</Typography>
		// 								<Typography
		// 									variant="body2"
		// 									color="text.secondary"
		// 								>
		// 									asdfasdf
		// 								</Typography>
		// 								<Box
		// 									display="flex"
		// 									alignItems="center"
		// 									sx={{ marginTop: "2px" }}
		// 								>
		// 									<VisibilityOutlinedIcon
		// 										fontSize="small"
		// 										sx={{ marginRight: "3px" }}
		// 									/>
		// 									<Typography
		// 										variant="body2"
		// 										color="text.secondary"
		// 										sx={{ marginRight: "20px" }}
		// 									>
		// 										123
		// 									</Typography>
		// 									<ThumbUpAltOutlinedIcon
		// 										fontSize="small"
		// 										sx={{ marginRight: "3px" }}
		// 									/>
		// 									<Typography
		// 										variant="body2"
		// 										color="text.secondary"
		// 									>
		// 										123
		// 									</Typography>
		// 								</Box>
		// 							</CardContent>
		// 						</CardActionArea>
		// 					</Card>
		// 				</Grid>
		// 			))}
		// 		</Grid> */}


        //         {/* notes */}
        //         <Divider textAlign="right" sx={{ marginTop: "2vh" }}>
		// 			<Chip label="Notes" />
		// 		</Divider>
		// 		<List sx={{ width: "100%", bgcolor: "background.paper" }}>
		// 			{noteList.map((value:Note) => (
		// 				<ListItem
		// 					key={value.noteId}
		// 					alignItems="flex-start"
		// 					disablePadding
		// 				>
		// 					<ListItemButton>
		// 						<ListItemAvatar>
		// 							<Avatar
		// 								alt={value.author.username+" avatar"}
		// 								src={value.author.avatarUrl}
		// 							/>
		// 						</ListItemAvatar>
		// 						<ListItemText
		// 							primary={value.title}
		// 							secondary={
		// 								<Stack
		// 									direction="row"
		// 									divider={
		// 										<Divider
		// 											orientation="vertical"
		// 											flexItem
		// 										/>
		// 									}
		// 									spacing={1}
		// 								>
		// 									<>
		// 										<VisibilityOutlinedIcon
		// 											fontSize="small"
		// 											sx={{ marginRight: "3px" }}
		// 										/>
		// 										<Typography
		// 											variant="body2"
		// 											color="text.secondary"
		// 											sx={{ marginRight: "20px" }}
		// 										>
		// 											123
		// 										</Typography>
		// 									</>
		// 									<>
		// 										<ThumbUpAltOutlinedIcon
		// 											fontSize="small"
		// 											sx={{ marginRight: "3px" }}
		// 										/>
		// 										<Typography
		// 											variant="body2"
		// 											color="text.secondary"
		// 										>
		// 											123
		// 										</Typography>
		// 									</>
		// 								</Stack>
		// 							}
		// 						/>
		// 						<Stack direction="row" spacing={1}>
		// 							{[0, 1, 2, 3].map(() => (
		// 								<Chip label="IBDP"></Chip>
		// 							))}
		// 						</Stack>
		// 					</ListItemButton>
		// 				</ListItem>
		// 			))}
		// 		</List>


        //         {/* forum */}
		// 		{/* <Divider textAlign="left" sx={{ marginTop: "2vh" }}>
		// 			<Chip label="Forum" />
		// 		</Divider>
		// 		<List sx={{ width: "100%", bgcolor: "background.paper" }}>
		// 			{[0, 1, 2, 3].map((value) => (
		// 				<ListItem
		// 					key={value}
		// 					alignItems="flex-start"
		// 					disablePadding
		// 				>
		// 					<ListItemButton>
		// 						<ListItemAvatar>
		// 							<Avatar
		// 								alt="user avatar"
		// 								src="https://source.unsplash.com/random"
		// 							/>
		// 						</ListItemAvatar>
		// 						<ListItemText
		// 							primary={`Question ${value + 1}`}
		// 							secondary={
		// 								<Stack
		// 									direction="row"
		// 									divider={
		// 										<Divider
		// 											orientation="vertical"
		// 											flexItem
		// 										/>
		// 									}
		// 									spacing={1}
		// 								>
		// 									<>
		// 										<VisibilityOutlinedIcon
		// 											fontSize="small"
		// 											sx={{ marginRight: "3px" }}
		// 										/>
		// 										<Typography
		// 											variant="body2"
		// 											color="text.secondary"
		// 											sx={{ marginRight: "20px" }}
		// 										>
		// 											123
		// 										</Typography>
		// 									</>
		// 									<>
		// 										<ThumbUpAltOutlinedIcon
		// 											fontSize="small"
		// 											sx={{ marginRight: "3px" }}
		// 										/>
		// 										<Typography
		// 											variant="body2"
		// 											color="text.secondary"
		// 										>
		// 											123
		// 										</Typography>
		// 									</>
		// 								</Stack>
		// 							}
		// 						/>
		// 						<Stack direction="row" spacing={1}>
		// 							{[0, 1, 2, 3].map(() => (
		// 								<Chip label="IBDP"></Chip>
		// 							))}
		// 						</Stack>
		// 					</ListItemButton>
		// 				</ListItem>
		// 			))}
		// 		</List> */}
		// 	</div>
		// </>
	);
};
