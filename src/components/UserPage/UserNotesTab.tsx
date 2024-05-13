import { RemoveRedEye, ThumbUpAltOutlined } from "@mui/icons-material";
import { TabPanel } from "@mui/lab";
import {
	List,
	ListItem,
	ListItemButton,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Stack,
	Divider,
	Typography,
	Chip,
} from "@mui/material";
import { Note } from "../../entity/Note";
import { useNavigate } from "react-router-dom";

type UserNotesTabProps = {
	noteList: Note[];
};
export const UserNotesTab = ({ noteList }: UserNotesTabProps) => {
	const navigate = useNavigate();
	const handleNoteListItemClick = (noteId: string) => {
		navigate(`/note/open/${noteId}`);
	};
	return (
		<TabPanel value="1" sx={{ padding: 0 }}>
			<List sx={{ width: "100%" }}>
				{noteList.map((value) => (
					<ListItem
						key={value.noteId}
						alignItems="flex-start"
						disablePadding
					>
						<ListItemButton
							onClick={() =>
								handleNoteListItemClick(value.noteId)
							}
						>
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
													marginRight: "3px",
												}}
											/>
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{
													marginRight: "20px",
												}}
											>
												{value.viewCount}
											</Typography>
										</>
										<>
											<ThumbUpAltOutlined
												fontSize="small"
												sx={{
													marginRight: "3px",
												}}
											/>
											<Typography
												variant="body2"
												color="text.secondary"
											>
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
		</TabPanel>
	);
};
