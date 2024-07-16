import { CloudUpload } from "@mui/icons-material";
import {
	Dialog,
	CircularProgress,
	DialogTitle,
	DialogContent,
	DialogContentText,
	Button,
	TextField,
	DialogActions,
	Avatar,
	Stack,
} from "@mui/material";
import { CustomBackdrop } from "../UtilComponents/CustomBackdrop.tsx";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/APIResponse";
import { FUser } from "../../entity/FUser";
import ResponseCodes from "../../entity/ResponseCodes";
import axiosInstance from "../../utils/AxiosInstance";
import { useState } from "react";

type RegisterDialog2Props = {
	registerDialog2Open: boolean;
	setRegisterDialog2Open: React.Dispatch<React.SetStateAction<boolean>>;
	backdropOpen: boolean;
	setBackdropOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export const RegisterDialog2 = ({
	registerDialog2Open,
	setRegisterDialog2Open,
	backdropOpen,
	setBackdropOpen,
}: RegisterDialog2Props) => {
	const register2Submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setBackdropOpen(true);
		const formData = new FormData(event.currentTarget);
		const username = formData.get("username") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const avatar = formData.get("avatar") as File;
		const authCode = formData.get("authCode") as string;
		// check if avatar is selected
		if (avatar.size == 0) {
			swal("Error!", "Please upload your avatar", "error");
			return;
		}

		const data = new FormData();
		data.append("username", username);
		data.append("authCode", authCode);
		data.append("email", email);
		data.append("password", password);
		data.append("avatar", avatar);
		axiosInstance
			.post("/fuser/register2", data)
			.then((response: AxiosResponse<APIResponse<FUser>>) => {
				setBackdropOpen(false);
				if (response.data.code == ResponseCodes.SUCCESS) {
					localStorage.setItem("token", response.data.data.token);
					// update user data
					localStorage.setItem(
						"userInfo",
						JSON.stringify(response.data.data)
					);
					// save token
					setRegisterDialog2Open(false);
					// refresh window
					location.reload();
				} else {
					swal("Error!", response.data.message, "error");
				}
			})
			.catch((error: AxiosResponse<APIResponse<string>>) => {
				setBackdropOpen(false);
				alert("Error happened during register: " + error.data.message);
			});
	};

	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

	const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setAvatarPreview(URL.createObjectURL(file));
		}
	};
	return (
		<>
			<Dialog
				open={registerDialog2Open}
				onClose={() => {
					setRegisterDialog2Open(false);
				}}
				PaperProps={{
					component: "form",
					onSubmit: register2Submit,
				}}
			>
				<CustomBackdrop open={backdropOpen}>
					<CircularProgress color="inherit" />
				</CustomBackdrop>
				<DialogTitle>Register an account in Study Hive!</DialogTitle>
				<DialogContent>
					<DialogContentText>
						We've sent an email to your email address. Please input
						the verification code in <b>5 minutes</b> to finish the
						registration.
					</DialogContentText>
					<Stack direction="row" justifyContent="space-between">
						<label>
							<Button
								component="span"
								role={undefined}
								variant="contained"
								tabIndex={-1}
								startIcon={<CloudUpload />}
							>
								Upload your avatar
							</Button>
							<input
								type="file"
								hidden
								name="avatar"
								style={{ display: "none" }}
								onChange={handleAvatarChange}
							/>
						</label>
						{avatarPreview && (
							<Avatar
								alt="Avatar"
								src={avatarPreview}
								sx={{ width: "5rem", height: "5rem" }}
							/>
						)}
					</Stack>
					<TextField
						autoFocus
						required
						margin="dense"
						name="email"
						label="Huili Email Address"
						type="email"
						fullWidth
						variant="standard"
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						name="password"
						label="Password"
						type="password"
						fullWidth
						variant="standard"
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						name="username"
						label="Username (not real name)"
						type="text"
						fullWidth
						variant="standard"
					/>
					<TextField
						autoFocus
						required
						margin="dense"
						name="authCode"
						label="Verification Code"
						type="text"
						fullWidth
						variant="standard"
					/>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setRegisterDialog2Open(false);
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
