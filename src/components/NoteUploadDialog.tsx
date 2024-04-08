import { CloudUpload } from "@mui/icons-material";
import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	Input,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../entity/APIResponse";
import swal from "sweetalert";
import ResponseCodes from "../entity/ResponseCodes";
import { FUser } from "../entity/FUser";

type NoteUploadDialogProps = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const NoteUploadDialog: React.FC<NoteUploadDialogProps> = ({
	open,
	setOpen,
}) => {
	const [avaliableTags, setAvaliableTags] = useState<string[]>([]);
	const [tagFieldValue, setTagFieldValue] = useState<string[]>([]);

	useEffect(() => {
		// fetch tags
		axiosInstance
			.get("/note/get/allTags")
			.then((response: AxiosResponse<APIResponse<string[]>>) => {
				if (response.data.code == ResponseCodes.SUCCESS) {
					setAvaliableTags(response.data.data);
				} else {
					swal("Error", response.data.message, "error");
				}
			});
	}, []);

	const noteUplaodSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const noteFile = formData.get("noteFile") as File;
        const title = formData.get("title") as string;
        const tags=tagFieldValue.join(",");
        const userInfo=JSON.parse(localStorage.getItem("userInfo") as string) as FUser;
        if (noteFile == null) {
            swal("Error", "Please select a file to upload", "error");
            return;
        }
        const data=new FormData();
        data.append("note",noteFile);
        data.append("title",title);
        data.append("authorId",userInfo.userId.toString());
        data.append("tags",tags);
        data.append("collectionId","");
        // TBD
	};

	const handleTagSelectChange = (event: SelectChangeEvent) => {
		const {
			target: { value },
		} = event;
		setTagFieldValue(typeof value === "string" ? value.split(",") : value);
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
					onSubmit: noteUplaodSubmit,
				}}
			>
				<DialogTitle>Upload your own note!</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Study hive is a platform for sharing knowledges.
						<b>Every user </b>can share their notes with others. Please upload
						your note <b>in .pdf format</b> here.
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
						<input type="file" hidden name="e" style={{ display: "none" }} />
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
					<label>
						<InputLabel id="demo-multiple-chip-label">
							Tags for the note*:
						</InputLabel>
						<Select
							labelId="demo-multiple-chip-label"
							label="Tags"
							multiple
							name="tags"
							value={tagFieldValue}
							sx={{ width: "100%" }}
							onChange={handleTagSelectChange}
							input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
							renderValue={(selected) => (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
									{selected.map((value) => (
										<Chip key={value} label={value} />
									))}
								</Box>
							)}
						>
							{["asdf", "22", "4"].map((name, id) => (
								<MenuItem key={id} value={name}>
									{name}
								</MenuItem>
							))}
						</Select>
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
					<Button type="submit">Register</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
