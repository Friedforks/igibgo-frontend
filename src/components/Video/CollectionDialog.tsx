import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";
import { AxiosResponse } from "axios";
import APIResponse from "../../entity/APIResponse";
import { FUser } from "../../entity/FUser";
import ResponseCodes from "../../entity/ResponseCodes";
import axiosInstance from "../../utils/AxiosInstance";
import swal from "sweetalert";

type CollectionDialogProps = {
    addCollectionDialogOpen: boolean;
    setAddCollectionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    collectionListUpdateFlag: boolean;
    setCollectionListUpdateFlag: React.Dispatch<React.SetStateAction<boolean>>;
};
export const CollectionDialog = ({
    addCollectionDialogOpen,
    setAddCollectionDialogOpen,
    collectionListUpdateFlag,
    setCollectionListUpdateFlag,
}: CollectionDialogProps) => {
    const addCollectionSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const collectionName = formData.get("collectionName") as string;
        const userInfo = localStorage.getItem("userInfo");
        if (collectionName.trim() === "") {
            swal("Error", "Collection name cannot be empty", "error");
        }
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
                            "success",
                        );
                        setAddCollectionDialogOpen(false); // close the dialog
                        // update the availableCollections
                        setCollectionListUpdateFlag(!collectionListUpdateFlag);
                    } else {
                        swal("Error", resp.data.message, "error");
                    }
                });
        } else {
            swal("Error", "Please refresh the page", "error");
        }
    };

    return (
        <>
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
