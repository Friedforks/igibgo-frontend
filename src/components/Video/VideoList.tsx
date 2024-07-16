import {
	Avatar,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Stack,
	Typography,
} from "@mui/material";
import { Video } from "../../entity/Video.ts";

// later to pass prop. Now only placeholder so no need.
type VideoListProps = {
	video: Video;
};
export const VideoList = () => {
	// export const VideoCard = ({video}:VideoCardProps) => {
	return (
		<>
			<Card sx={{ width: "100%", maxWidth: "20rem" }}>
				<CardActionArea>
					<CardMedia
						component="img"
						height="100%"
						image="https://mui.com/static/images/cards/contemplative-reptile.jpg"
						alt="green iguana"
					/>
					<CardContent>
						<Stack direction="row" spacing={2}>
							<Avatar src="https://mui.com/static/images/avatar/1.jpg"></Avatar>
							<div>
								<Typography
									gutterBottom
									variant="subtitle1"
									component="div"
								>
									Video title
								</Typography>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Author name
								</Typography>
							</div>
						</Stack>
					</CardContent>
				</CardActionArea>
			</Card>
		</>
	);
};
