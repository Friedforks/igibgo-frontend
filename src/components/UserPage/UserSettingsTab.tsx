import { CloudUpload } from "@mui/icons-material";
import { TabPanel } from "@mui/lab";
import { Avatar, Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/UtilEntity/APIResponse.ts";
import ResponseCodes from "../../entity/UtilEntity/ResponseCodes.ts";

export const UserSettingsTab = () => {
    const [avatar, setAvatar] = useState<File>();
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null; // Safely access files array
        if (file) {
            setAvatar(file);
        }
    };

    const handlePasswordChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        axiosInstance
            .post("/fuser/update/password", 0, {
                params: {
                    token: localStorage.getItem("token"),
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                },
            })
            .then((response: AxiosResponse<APIResponse<void>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    sweetAlert(
                        "Success!",
                        "Password changed successfully",
                        "success"
                    ).then(() => {
                        window.location.reload();
                    });
                } else {
                    sweetAlert("Error!", response.data.message, "error");
                }
            });
    };

    const handleUsernameChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newUsername = formData.get("newUsername") as string;
        console.log(newUsername);
        axiosInstance
            .post("/fuser/update/username", 0, {
                params: {
                    token: localStorage.getItem("token"),
                    newUsername: newUsername,
                },
            })
            .then((response: AxiosResponse<APIResponse<void>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    sweetAlert(
                        "Success!",
                        "Username changed successfully",
                        "success"
                    ).then(() => {
                        window.location.reload();
                    });
                } else {
                    sweetAlert("Error!", response.data.message, "error");
                }
            });
    };

    const handleAvatarChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData();
        data.append("avatar", avatar as Blob);

        axiosInstance
            .post("/fuser/update/avatar", data, {
                params: {
                    token: localStorage.getItem("token"),
                },
            })
            .then((response: AxiosResponse<APIResponse<void>>) => {
                if (response.data.code == ResponseCodes.SUCCESS) {
                    sweetAlert(
                        "Success!",
                        "Avatar changed successfully",
                        "success"
                    ).then(() => {
                        window.location.reload();
                    });
                } else {
                    sweetAlert("Error!", response.data.message, "error");
                }
            });
    }
    return (
        <TabPanel value="5" id="5" sx={{ padding: 0, marginTop: "1rem" }}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography variant="h6">Change password</Typography>
                    <form onSubmit={handlePasswordChange}>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            name="currentPassword"
                            label="Your current password"
                            type="password"
                            fullWidth
                            variant="standard"
                        />
                        <br />
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            name="newPassword"
                            label="Your new password"
                            fullWidth
                            type="password"
                            variant="standard"
                        />
                        <br />
                        <br />
                        <Button type="submit" variant="contained">
                            Change password
                        </Button>
                    </form>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6">Change username</Typography>
                    <form onSubmit={handleUsernameChange}>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            name="newUsername"
                            label="New username"
                            fullWidth
                            type="text"
                            variant="standard"
                        />
                        <br />
                        <br />
                        <Button type="submit" variant="contained">
                            Change username
                        </Button>
                    </form>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6">Change avatar</Typography>
                    <form onSubmit={handleAvatarChange}>
                        <label>
                            {avatar && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Avatar
                                        alt="Avatar"
                                        src={URL.createObjectURL(avatar)}
                                        sx={{ width: "5rem", height: "5rem" }}
                                    />
                                </div>
                            )}
                            <br />
                            <Typography
                                variant="caption"
                                style={{ marginLeft: "5px" }}
                            >
                                {avatar && avatar.name}
                            </Typography>
                            <br />
                            <Button
                                variant="contained"
                                component="span"
                                startIcon={<CloudUpload />}
                            >
                                1. Upload new avatar
                            </Button>
                            <input
                                name="avatar"
                                type="file"
                                hidden
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </label>
                        <br />
                        <br />
                        <Button type="submit" variant="contained">
                            2. Submit
                        </Button>
                    </form>
                </Grid>
            </Grid>
        </TabPanel>
    );
};
