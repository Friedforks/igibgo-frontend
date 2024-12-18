import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button,
} from "@mui/material";
import React from "react";
import axiosInstance from "../../utils/AxiosInstance";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/UtilEntity/APIResponse.ts";
import { FUser } from "../../entity/FUser";
import ResponseCodes from "../../entity/UtilEntity/ResponseCodes.ts";
import Link from "@mui/material/Link";

type LoginDialogProps = {
    loginDialogOpen: boolean;
    setLoginDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setRegisterDialog1Open: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoginDialog = ({
    loginDialogOpen,
    setLoginDialogOpen,
    setRegisterDialog1Open,
}: LoginDialogProps) => {
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
                // login success
                if (response.data.code == ResponseCodes.SUCCESS) {
                    localStorage.setItem("token", response.data.data.token);
                    localStorage.setItem(
                        "userInfo",
                        JSON.stringify(response.data.data)
                    );
                    setLoginDialogOpen(false);
                    // reload the page with the user logged in
                    location.reload();
                }
                // login failed
                else {
                    sweetAlert("Error!", response.data.message, "error");
                }
            })
            .catch((error: AxiosResponse<string>) => {
                sweetAlert("Error!", error.data, "error");
            });
    };

    const handleGoToRegister = () => {
        setLoginDialogOpen(false);
        setRegisterDialog1Open(true);
    };
    return (
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
                    Please input your <b>Huili email </b>address and password to
                    login. We promise that we won't share your email with anyone
                    else and the password will be one-way encrypted.
                    <div>
                        Don't have an account?{" "}
                        <Link
                            style={{ cursor: "pointer" }}
                            onClick={handleGoToRegister}
                        >
                            Register now!
                        </Link>
                    </div>
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
                <Button onClick={() => setLoginDialogOpen(false)}>
                    Cancel
                </Button>
                <Button type="submit">Login</Button>
            </DialogActions>
        </Dialog>
    );
};
export default LoginDialog;
