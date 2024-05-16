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
import { VisibilityOutlined, ThumbUpAltOutlined } from "@mui/icons-material";

type NoteListProps = {
	noteList: Note[];
	handleNoteListItemClick: (noteId: string) => void;
};

export const NoteList = ({
	noteList,
	handleNoteListItemClick,
}: NoteListProps) => {
	return (
		<List sx={{ width: "100%" }}>
			{noteList.map((value: Note) => (
				<>
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
											<VisibilityOutlined
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
							<Stack
								direction="row"
								spacing={1}
								flexWrap="wrap"
								useFlexGap
								justifyContent="flex-end"
							>
								{value.tags.map((tag) => (
									<Chip label={tag.tagText}></Chip>
								))}
							</Stack>
						</ListItemButton>
					</ListItem>
					{/* <Divider component="li" /> */}
				</>
			))}
		</List>
	);
};
