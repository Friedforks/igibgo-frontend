import { Backdrop } from "@mui/material";
import { ReactNode } from "react";

type FormBackdropProps = {
	children: ReactNode;
	open: boolean;
};
export const FormBackdrop = ({ children ,open}: FormBackdropProps) => {
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
