import { Avatar, Stack, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import APIResponse from "../entity/APIResponse";
import { FUser } from "../entity/FUser";
import axiosInstance from "../utils/AxiosInstance";
import {
	ThumbUpOutlined,
	VisibilityOutlined,
	StarBorderOutlined,
} from "@mui/icons-material";

type ShortUserInfoDisplayProps = {
	userId: number | undefined;
	dataUpdateRequired: boolean;
};
export const ShortUserInfoDisplay: React.FC<ShortUserInfoDisplayProps> = ({
	userId,
	dataUpdateRequired,
}) => {
	const [user, setUser] = useState<FUser>();
	const [totalView, setTotalView] = useState<number>(0);
	const [totalLike, setTotalLike] = useState<number>(0);
	const [totalSave, setTotalSave] = useState<number>(0);
	useEffect(() => {
		axiosInstance
			.get("/fuser/userId", {
				params: {
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<FUser>>) => {
				setUser(response.data.data);
			});
		axiosInstance
			.get("/fuser/total/like", {
				params: {
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<number>>) => {
				setTotalLike(response.data.data);
			});

		axiosInstance
			.get("/fuser/total/save", {
				params: {
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<number>>) => {
				setTotalSave(response.data.data);
			});
		axiosInstance
			.get("/fuser/total/view", {
				params: {
					userId: userId,
				},
			})
			.then((response: AxiosResponse<APIResponse<number>>) => {
				setTotalView(response.data.data);
			});
	}, [dataUpdateRequired, userId]);
	return (
		<Stack direction="row" spacing={2}>
			<Avatar alt="Author avatar" src={user?.avatarUrl} />
			<div>
				<Typography variant="h6">{user?.username}</Typography>
				<Stack direction="row" spacing={2}>
					<div>
						<Stack direction="row" spacing={0.5}>
							<ThumbUpOutlined fontSize="small" />
							<span>{totalLike}</span>
						</Stack>
					</div>
					<div>
						<Stack direction="row" spacing={0.5}>
							<VisibilityOutlined fontSize="small" />
							<span>{totalView}</span>
						</Stack>
					</div>
					<div>
						<Stack direction="row" spacing={0.5}>
							<StarBorderOutlined fontSize="small" />
							<span>{totalSave}</span>
						</Stack>
					</div>
				</Stack>
			</div>
		</Stack>
	);
};
