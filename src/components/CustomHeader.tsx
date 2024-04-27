import {
	AppBar,
	Avatar,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
	TextField,
	Toolbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/AxiosInstance.ts";
import { AxiosResponse } from "axios";
import { CloudUpload } from "@mui/icons-material";
import APIResponse from "../entity/APIResponse.ts";
import ResponseCodes from "../entity/ResponseCodes.ts";
import swal from "sweetalert";
import { FUser } from "../entity/FUser.ts";
import { useNavigate } from "react-router-dom";

const CustomHeader = () => {
	// button onclick alert
	const [userData, setUserData] = useState<FUser>();
	const [loginStatus, setLoginStatus] = useState<boolean>();
	const [registerDialog2Open, setRegisterDialog2Open] =
		useState<boolean>(false);
	const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
	const [registerDialogOpen, setRegisterDialogOpen] = useState<boolean>(false);
	const handleLoginClick = () => {
		// 1. open modal
		setLoginDialogOpen(true);
	};
	const handleClose = () => {
		setLoginDialogOpen(false);
	};

	const handleRegisterClick = () => {
		setRegisterDialogOpen(true);
	};

	const loginSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		axiosInstance
			.post("/fuser/login", 0, {
				params: {
					email: email,
					password: password,
				},
			})
			.then((response: AxiosResponse<APIResponse<FUser>>) => {
				if (response.data.code == ResponseCodes.SUCCESS) {
					localStorage.setItem("token", response.data.data.token);
					localStorage.setItem("userInfo",JSON.stringify(response.data.data));
					swal(
						"Success!",
						"Login successfully! Welcome :" + response.data.data.username,
						"success"
					);
					setUserData(response.data.data);
					setLoginStatus(true);
					handleClose();
				} else {
					swal("Error!", response.data.message, "error");
				}
			})
			.catch((error: AxiosResponse<string>) => {
				swal("Error!", error.data, "error");
				setLoginStatus(false);
				handleClose();
			});
	};

	const register1Submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		console.log("formdata: " + formData);
		axiosInstance
			.post("/fuser/register1", 0, {
				params: {
					email: email,
					password: password,
				},
			})
			.then((response: AxiosResponse<APIResponse<string>>) => {
				if (response.data.code == ResponseCodes.SUCCESS) {
					swal(
						"Success!",
						"We've sent an email to your email address." +
							" Please check your email and follow the instructions to finish the registration.",
						"success"
					);
					setRegisterDialogOpen(false);
					setRegisterDialog2Open(true); // open next
				} else {
					swal("Error!", response.data.message, "error");
				}
			})
			.catch((error: AxiosResponse<string>) => {
				swal("Error!", error.data, "error");
				setLoginStatus(false);
				setRegisterDialogOpen(false);
			});
	};

	const register2Submit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const username = formData.get("username") as string;
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;
		const avatar = formData.get("avatar") as File;
		const authCode = formData.get("authCode") as string;

		const data = new FormData();
		data.append("username", username);
		data.append("authCode", authCode);
		data.append("email", email);
		data.append("password", password);
		data.append("avatar", avatar);
		axiosInstance
			.post("/fuser/register2", data)
			.then((response: AxiosResponse<APIResponse<FUser>>) => {
				if (response.data.code == ResponseCodes.SUCCESS) {
					swal("Success!", "You are registered now.", "success");
					localStorage.setItem("token", response.data.data.token);
					// update user data
					setUserData(response.data.data);
					// save token
					setRegisterDialog2Open(false);
					setLoginStatus(true);
				} else {
					swal("Error!", response.data.message, "error");
				}
			})
			.catch((error: AxiosResponse<APIResponse<string>>) => {
				alert("Error happened during register: " + error.data.message);
				setLoginStatus(false);
			});
	};

	const handleLogoutClick = () => {
		axiosInstance
			.post("/fuser/logout", 0, {
				params: {
					token: localStorage.getItem("token"),
				},
			})
			.then((response: AxiosResponse<boolean>) => {
				if (response.data) {
					swal("Success!", "Logout successfully!", "success");
					localStorage.removeItem("token");
					setLoginStatus(false);
				} else {
					swal("Error!", "Logout failed!", "error");
				}
			});
	};
	const navigate = useNavigate();

	useEffect(()=>{
		// check login status
		if(localStorage.getItem("token")!==null){
			axiosInstance.post("/fuser/checkLogin",0,{
				params:{
					token:localStorage.getItem("token")
				}
			}).then((response:AxiosResponse<APIResponse<FUser>>)=>{
				if(response.data.code==ResponseCodes.SUCCESS){
					localStorage.setItem("userInfo",JSON.stringify(response.data.data));
					setUserData(response.data.data);
					setLoginStatus(true);
				}else{
					setLoginDialogOpen(true);
					setLoginStatus(false);
				}
			})
		}
	},[])

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar position="static">
					<Toolbar>
						<Grid container justifyContent="space-between">
							<Grid item>
								<Box display="flex" alignItems="center">
									<div onClick={()=>{
										navigate("/")
									}}> Welcome to Study Hive!</div>
									{/*</Typography>*/}
									<Button
										color="inherit"
										onClick={() => {
											navigate("/note");
										}}
									>
										Notes
									</Button>
									<Button color="inherit">Videos</Button>
									<Button color="inherit">Forum</Button>
								</Box>
							</Grid>
							<Grid item>
								{!loginStatus && (
									<>
										<Button color="inherit" onClick={handleLoginClick}>
											Login
										</Button>
										<Button color="inherit" onClick={handleRegisterClick}>
											Register
										</Button>
									</>
								)}
								{loginStatus && (
									<Box display="flex" alignItems="center">
										<Avatar
											alt="avatar"
											src={userData?.avatarUrl}
											sx={{ marginRight: "1vw" }}
										/>
										<div>{userData?.username}</div>
										<Button color="inherit" onClick={handleLogoutClick}>
											Logout
										</Button>
									</Box>
								)}
							</Grid>
						</Grid>
					</Toolbar>
				</AppBar>
			</Box>
			<Dialog
				open={loginDialogOpen}
				onClose={() => {
					setLoginDialogOpen(false);
				}}
				PaperProps={{
					component: "form",
					onSubmit: loginSubmit,
				}}
			>
				<DialogTitle>Login to Study Hive!</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Please input your <b>Huili email </b>address and password to login.
						We promise that we won't share your email with anyone else and the
						password will be one-way encrypted.
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
					<Button onClick={handleClose}>Cancel</Button>
					<Button type="submit">Login</Button>
				</DialogActions>
			</Dialog>

			{/*register 1*/}
			<Dialog
				open={registerDialogOpen}
				onClose={() => {
					setRegisterDialogOpen(false);
				}}
				PaperProps={{
					component: "form",
					onSubmit: register1Submit,
				}}
			>
				<DialogTitle>Register an account in Study Hive!</DialogTitle>

				<DialogContent>
					<DialogContentText>
						Please input your <b>Huili email </b>address and password to
						register. We promise that we won't share your email with anyone else
						and the password will be one-way encrypted.
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
							setRegisterDialogOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button type="submit">Register</Button>
				</DialogActions>
			</Dialog>

			{/*register 2*/}
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
				<DialogTitle>Register an account in Study Hive!</DialogTitle>
				<DialogContent>
					<DialogContentText>
						We've sent an email to your email address. Please input the
						verification code in <b>5 minutes</b> to finish the registration.
					</DialogContentText>
					<label>
						<Button
							component="span"
							role={undefined}
							variant="contained"
							tabIndex={-1}
							startIcon={<CloudUpload/>}
						>
							Upload your avatar
						</Button>
						<input
							type="file"
							hidden
							name="avatar"
							style={{ display: "none" }}
						/>
					</label>
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

export default CustomHeader;
