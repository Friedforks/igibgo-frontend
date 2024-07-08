import {
	Dialog,
	CircularProgress,
	DialogTitle,
	DialogContent,
	DialogContentText,
	TextField,
	DialogActions,
	Button,
} from "@mui/material";
import { FormBackdrop } from "../FormBackdrop";
import axiosInstance from "../../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/APIResponse";
import ResponseCodes from "../../entity/ResponseCodes";

type RegisterDialog1Props = {
	registerDialog1Open: boolean;
	setRegisterDialog1Open: React.Dispatch<React.SetStateAction<boolean>>;
    setRegisterDialog2Open: React.Dispatch<React.SetStateAction<boolean>>;
    backdropOpen: boolean;
    setBackdropOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setLoginStatus: React.Dispatch<React.SetStateAction<boolean>>;
};

export const RegisterDialog1 = ({
	registerDialog1Open,
	setRegisterDialog1Open,
    setBackdropOpen,
    backdropOpen,
    setRegisterDialog2Open,
    setLoginStatus
}:RegisterDialog1Props) => {
	const register1Submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
        setBackdropOpen(true);
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		axiosInstance
			.post("/fuser/register1", 0, {
				params: {
					email: email,
					password: password,
				},
			})
			.then((response: AxiosResponse<APIResponse<string>>) => {
				setBackdropOpen(false);
				if (response.data.code == ResponseCodes.SUCCESS) {
					swal(
						"Success!",
						"We've sent an email to your email address." +
							" Please check your email and follow the instructions to finish the registration.",
						"success"
					);
					setRegisterDialog1Open(false);
					setRegisterDialog2Open(true); // open next
				} else {
					swal("Error!", response.data.message, "error");
				}
			})
			.catch((error: AxiosResponse<string>) => {
				setBackdropOpen(false);
				swal("Error!", error.data, "error");
				setLoginStatus(false);
				setRegisterDialog1Open(false);
			});
	};

	return (
		<>
			<Dialog
				open={registerDialog1Open}
				onClose={() => {
					setRegisterDialog1Open(false);
				}}
				PaperProps={{
					component: "form",
					onSubmit: register1Submit,
				}}
			>
				<FormBackdrop open={backdropOpen}>
					<CircularProgress color="inherit" />
				</FormBackdrop>
				<DialogTitle>Register an account in Study Hive!</DialogTitle>

				<DialogContent>
					<DialogContentText>
						Please input your <b>Huili email </b>address and
						password to register. We promise that we won't share
						your email with anyone else and the password will be
						one-way encrypted.
					</DialogContentText>

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
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							setRegisterDialog1Open(false);
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
