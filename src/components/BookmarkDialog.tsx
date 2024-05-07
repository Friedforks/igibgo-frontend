import {
	Autocomplete,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { FUser } from "../entity/FUser";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/APIResponse";
import { NoteBookmark } from "../entity/NoteBookmark";
import swal from "sweetalert";
import ResponseCodes from "../entity/ResponseCodes";

type BookmarkDialogProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	currentNoteId: string;
	setStarred: React.Dispatch<React.SetStateAction<boolean>>;
	setDataUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
};
export const BookmarkDialog = ({
	open,
	setOpen,
	currentNoteId,
	setStarred,
	setDataUpdateRequired,
}: BookmarkDialogProps) => {
	const [folderName, setFolderName] = useState<string>("");
	const [availableBookmarks, setAvailableBookmarks] = useState<
		NoteBookmark[]
	>([]);
	const userInfo = JSON.parse(
		localStorage.getItem("userInfo") as string
	) as FUser;
	const userId = userInfo.userId;
	useEffect(() => {
		getUserFolders();
	}, []);
	const getUserFolders = () => {
		axiosInstance
			.get("/note/get/bookmarks", {
				params: {
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<NoteBookmark[]>>) => {
				console.log("bookmarks available", response.data.data);
				setAvailableBookmarks(response.data.data);
			});
	};
	const bookmarkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const folder = formData.get("folder") as string;
		if (folder == "" || folder == null) {
			swal("Error", "Please select or enter a folder", "error");
			return;
		}
		axiosInstance
			.get("/note/bookmark", {
				params: {
					noteId: currentNoteId,
					userId: userId,
					folder: folder,
				},
			})
			.then((response: AxiosResponse<APIResponse<boolean>>) => {
				if (response.data.code==ResponseCodes.SUCCESS) {
					swal("Success", "Note added to bookmark", "success");
					setOpen(false); // close the dialog
					setStarred(true);
					setDataUpdateRequired(true); // update short user info display
				} else {
					// don't close the dialog
					swal(
						"Error",
						"Error in bookmarking this note: " + response.data.message,
						"error"
					);
				}
			})
			.catch((error) => {
				// don't close the dialog
				swal(
					"Error",
					"Error in bookmarking this note: " + error,
					"error"
				);
			});
	};
	return (
		<>
			<Dialog
				open={open}
				onClose={() => {
					setOpen(false);
				}}
				PaperProps={{
					component: "form",
					onSubmit: bookmarkSubmit,
				}}
			>
				<DialogTitle>Add this note to bookmark</DialogTitle>
				<DialogContent>
					<Autocomplete
						value={folderName}
						fullWidth
						options={availableBookmarks.map(
							(bookmark) => bookmark.folder
						)}
						renderInput={(params) => (
							<TextField
								name="folder"
								{...params}
								label="folder"
							/>
						)}
					/>
				</DialogContent>
			</Dialog>
			;
		</>
	);
};
