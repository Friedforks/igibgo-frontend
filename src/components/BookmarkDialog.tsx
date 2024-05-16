import {
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	FormGroup,
	InputAdornment,
	InputLabel,
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
import { AddOutlined } from "@mui/icons-material";
import { Bookmark } from "../entity/Bookmark";

type BookmarkDialogProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	currentNoteId: string;
	setStarred: React.Dispatch<React.SetStateAction<boolean>>;
	dataUpdateRequired: boolean;
	setDataUpdateRequired: React.Dispatch<React.SetStateAction<boolean>>;
};
export const BookmarkDialog = ({
	open,
	setOpen,
	currentNoteId,
	setStarred,
	dataUpdateRequired,
	setDataUpdateRequired,
}: BookmarkDialogProps) => {
	const [bookmarked, setBookmarked] = useState<NoteBookmark[]>([]);
	const [availableBookmarks, setAvailableBookmarks] = useState<Bookmark[]>(
		[]
	);
	const [checkedStatus, setCheckedStatus] = useState<boolean[]>([]);
	const userInfo = JSON.parse(
		localStorage.getItem("userInfo") as string
	) as FUser;
	const userId = userInfo.userId;
	useEffect(() => {
		getUserBookmarks(); // the user's bookmarks already available
		getBookmarked(); // the user's already saved bookmarks for this note
	}, []);
	useEffect(() => {
		// const start = performance.now();

		// O(N^3)
		setCheckedStatus(
			availableBookmarks.map((bookmark) =>
				bookmark.noteBookmarks.some((noteBookmark) =>
					bookmarked.some(
						(bm) =>
							bm.noteBookmarkId === noteBookmark.noteBookmarkId
					)
				)
			)
		);

		// const end = performance.now();
		// console.log(
		// 	`Time consuming function setCheckedStatus execution time: ${
		// 		end - start
		// 	} ms`
		// );
	}, [bookmarked, availableBookmarks]);

	const getBookmarked = () => {
		axiosInstance
			.get("/bookmark/get/note/page", {
				params: {
					noteId: currentNoteId,
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<NoteBookmark[]>>) => {
				setBookmarked(response.data.data);
			});
	};
	const getUserBookmarks = () => {
		axiosInstance
			.get("/bookmark/get/by/userId", {
				params: {
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<Bookmark[]>>) => {
				// console.log(
				// 	"BookmarkDialog.tsx getUserBookmarks response.data.data",
				// 	response.data.data
				// );
				setAvailableBookmarks(response.data.data);
			});
	};
	const bookmarkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const extraFolder = formData.get("extraFolder") as string;

		const selectedFolders: string[] = availableBookmarks
			.filter((_, index) => checkedStatus[index])
			.map((bookmark) => bookmark.bookmarkName);
		const newFolders: string[] = extraFolder
			.split(",")
			.map((folder) => folder.trim());

		// join new folders with selected folders
		selectedFolders.push(...newFolders);

		axiosInstance
			.post("/bookmark/new", 0, {
				params: {
					noteId: currentNoteId,
					userId: userId,
					folder: selectedFolders.join(","), // join all folders with comma
				},
			})
			.then((response: AxiosResponse<APIResponse<boolean>>) => {
				if (response.data.code == ResponseCodes.SUCCESS) {
					swal("Success", "Note added to bookmark", "success");
					setOpen(false); // close the dialog
					setStarred(true);
					setDataUpdateRequired(!dataUpdateRequired); // update short user info display
					getBookmarked();
					getUserBookmarks();
				} else {
					// don't close the dialog
					swal(
						"Error",
						"Error in bookmarking this note: " +
							response.data.message,
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

	const handleCheckboxChange = (index: number) => {
		setCheckedStatus(
			checkedStatus.map((checked, i) =>
				i === index ? !checked : checked
			)
		);
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
				<DialogTitle>Bookmark this note</DialogTitle>
				<DialogContent>
					<FormGroup>
						{availableBookmarks.map((bookmark, index) => (
							<FormControlLabel
								control={
									<Checkbox
										checked={checkedStatus[index]}
										onChange={() =>
											handleCheckboxChange(index)
										}
									/>
								}
								key={bookmark.bookmarkId}
								label={bookmark.bookmarkName}
							/>
						))}
					</FormGroup>
					<label>
						<InputLabel id="demo-multiple-chip-label">
							Others folders: (new folder will be created,
							separate by comma ',')
						</InputLabel>
						<TextField
							fullWidth
							variant="standard"
							name="extraFolder"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<AddOutlined />
									</InputAdornment>
								),
							}}
						/>
					</label>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button type="submit">Submit</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
