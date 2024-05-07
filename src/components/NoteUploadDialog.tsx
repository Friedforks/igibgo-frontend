import { AddOutlined, CloudUpload } from "@mui/icons-material";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import APIResponse from "../entity/APIResponse";
import swal from "sweetalert";
import ResponseCodes from "../entity/ResponseCodes";
import { FUser } from "../entity/FUser";
import { Collection } from "../entity/Collection";
import { AxiosResponse } from "axios";

type NoteUploadDialogProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NoteUploadDialog: React.FC<NoteUploadDialogProps> = ({
	open,
	setOpen,
}) => {
	const [availableTags, setAvailableTags] = useState<string[]>([]);
	const [tagFieldValue, setTagFieldValue] = useState<string[]>([]);
	const [collectionValue, setCollectionValue] = useState<string>("");
	const [availableCollections, setAvailableCollections] = useState<
		Collection[]
	>([]);
	const [addCollectionDialogOpen, setAddCollectionDialogOpen] =
		useState(false);

	const getCollections = () => {
		// get collections
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			const userId = (JSON.parse(userInfo) as FUser).userId;
			axiosInstance
				.get("/collection/get/userId", {
					params: {
						userId: userId,
					},
				})
				.then((response: AxiosResponse<APIResponse<Collection[]>>) => {
					if (response.data.code == ResponseCodes.SUCCESS) {
						setAvailableCollections(response.data.data);
					} else {
						swal("Error", response.data.message, "error");
					}
				});
		} else {
			swal(
				"Error",
				"You didn't successfully login. Please refresh the page",
				"error"
			);
		}
	};

	const getTags = () => {
		// fetch tags
		axiosInstance
			.get("/note/get/allTags")
			.then((response: AxiosResponse<APIResponse<string[]>>) => {
				if (response.data.code == ResponseCodes.SUCCESS) {
					setAvailableTags(response.data.data);
				} else {
					swal("Error", response.data.message, "error");
				}
			});
	};

	useEffect(() => {
		getCollections();
		getTags();
	}, []);

	const addCollectionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const collectionName = formData.get("collectionName") as string;
		const userInfo = localStorage.getItem("userInfo");
		if (userInfo) {
			axiosInstance
				.post("/collection/add", 0, {
					params: {
						collectionName: collectionName,
						userId: (JSON.parse(userInfo) as FUser).userId,
					},
				})
				.then((resp: AxiosResponse<APIResponse<null>>) => {
					if (resp.data.code == ResponseCodes.SUCCESS) {
						swal(
							"Success",
							"Collection added successfully",
							"success"
						);
						setAddCollectionDialogOpen(false); // close the dialog
						// update the availableCollections
						getCollections();
					} else {
						swal("Error", resp.data.message, "error");
					}
				});
		} else {
			swal("Error", "Please refresh the page", "error");
		}
	};

	const noteUploadSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const noteFile = formData.get("noteFile") as File;
		const title = formData.get("title") as string;
		const tags = formData.get("tags") as string;
		const userInfo = JSON.parse(
			localStorage.getItem("userInfo") as string
		) as FUser;
		if (userInfo == null) {
			swal("Error", "Please login first", "error");
			return;
		}
		if (noteFile == null) {
			swal("Error", "Please select a file to upload", "error");
			return;
		}
		const collectionId = collectionValue;
		const data = new FormData();
		data.append("note", noteFile);
		data.append("authorId", userInfo.userId.toString());
		data.append("collectionId", collectionId);
		data.append("title", title);
		data.append("tags", tags);
		console.log("collectionId" + collectionId);
		axiosInstance
			.post("/note/upload", data)
			.then((resp: AxiosResponse<APIResponse<null>>) => {
				if (resp.data.code == ResponseCodes.SUCCESS) {
					swal("Success", "Note uploaded successfully", "success");
					setOpen(false);
				} else {
					swal("Error", resp.data.message, "error");
				}
			});
	};

	// const handleTagSelectChange = (event: SelectChangeEvent) => {
	// 	const {
	// 		target: { value },
	// 	} = event;
	// 	setTagFieldValue(typeof value === "string" ? value.split(",") : value);
	// };

	return (
		<>
			{/* Note upload dialog */}
			<Dialog
				open={open}
				onClose={() => {
					setOpen(false);
					console.log("open");
				}}
				PaperProps={{
					component: "form",
					onSubmit: noteUploadSubmit,
				}}
			>
				<DialogTitle>Upload your own note!</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Study hive is a platform for sharing knowledges.
						<b>Every user </b>can share their notes with others.
						Please upload your note <b>in .pdf format</b> here.
					</DialogContentText>
					<label>
						<Button
							component="span"
							variant="contained"
							tabIndex={-1}
							startIcon={<CloudUpload />}
						>
							Upload Note (PDF)
						</Button>
						<input
							name="noteFile"
							type="file"
							hidden
							style={{ display: "none" }}
						/>
					</label>
					<TextField
						autoFocus
						required
						margin="dense"
						name="title"
						label="Note Title:"
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						name="tags"
						label="Tags (separate with comma):"
						type="text"
						fullWidth
						variant="standard"
					/>
					<label>
						<InputLabel id="demo-multiple-chip-label">
							Collection:
						</InputLabel>
						<Select
							name="collection"
							value={collectionValue}
							fullWidth
							onChange={(event) => {
								setCollectionValue(
									event.target.value as string
								);
							}}
						>
							{availableCollections.map((collection) => (
								<MenuItem value={collection.collectionId}>
									{collection.collectionName}
								</MenuItem>
							))}
						</Select>
					</label>
					<Button
						variant="outlined"
						startIcon={<AddOutlined />}
						sx={{ marginTop: "10px" }}
						onClick={() => {
							setAddCollectionDialogOpen(true);
						}}
					>
						Add collection
					</Button>
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

			{/* Add collection dialog */}
			<Dialog
				open={addCollectionDialogOpen}
				onClose={() => {
					setAddCollectionDialogOpen(false);
				}}
				PaperProps={{
					component: "form",
					onSubmit: addCollectionSubmit,
				}}
			>
				<DialogTitle>Add a new collection</DialogTitle>
				<DialogContent>
					<DialogContentText>
						You can use collections to organize your notes into
						series. Such as "IBDP CS notes"
					</DialogContentText>
					<TextField
						required
						margin="dense"
						name="collectionName"
						label="Collection name:"
						type="text"
						fullWidth
						variant="standard"
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setAddCollectionDialogOpen(false);
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
