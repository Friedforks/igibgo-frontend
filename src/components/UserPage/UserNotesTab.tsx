import { TabPanel } from "@mui/lab";
import { Note } from "../../entity/Note";
import { useNavigate } from "react-router-dom";
import { NoteList } from "../Note/NoteList";

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
			<NoteList
				noteList={noteList}
				handleNoteListItemClick={handleNoteListItemClick}
			/>
		</TabPanel>
	);
};
