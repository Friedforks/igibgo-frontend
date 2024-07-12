import { Backdrop } from "@mui/material";
import { ReactNode } from "react";

type CustomBackdropProps = {
    children: ReactNode;
    open: boolean;
};
export const CustomBackdrop = ({ children ,open}: CustomBackdropProps) => {
    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={open}
        >
            {children}
        </Backdrop>
    );
};
