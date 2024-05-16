import { TabPanel } from "@mui/lab";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/APIResponse";
import { Bookmark } from "../../entity/Bookmark";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { NoteBookmark } from "../../entity/NoteBookmark";
import { useNavigate } from "react-router-dom";
import { Note } from "../../entity/Note";
import { NoteList } from "../Note/NoteList";

type UserBookmarkTabProps = {
	userId: number;
};
export const UserBookmarkTab = ({ userId }: UserBookmarkTabProps) => {
	const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
	const [noteList, setNoteList] = useState<Note[][]>([[]]);
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
				const respData = response.data.data;
				// decompose bookmark list's note field into a list of notes (to be used in the NoteList component)
				const extractedNotes = respData.map((item) => item.noteBookmarks.map((noteBookmark: NoteBookmark) => noteBookmark.note));
				setNoteList(extractedNotes);
			});
	};
	const navigate = useNavigate();
	const handleNoteListItemClick = (noteId: string) => {
		navigate(`/note/open/${noteId}`);
	};
	return (
		<TabPanel id="5" value="5" sx={{ padding: 0 }}>
			{bookmarks.map((bookmark: Bookmark, index: number) => (
				<Accordion>
					<AccordionSummary
						expandIcon={<ExpandMoreOutlined />}
						id={bookmark.bookmarkId.toString()}
					>
						{bookmark.bookmarkName}
					</AccordionSummary>
					<AccordionDetails sx={{ padding: 0 }}>
						<NoteList
							noteList={noteList[index]}
							handleNoteListItemClick={handleNoteListItemClick}
						/>
					</AccordionDetails>
				</Accordion>
			))}
		</TabPanel>
	);
};
