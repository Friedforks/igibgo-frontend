import { LinearProgress } from "@mui/material";

type LineProgressBufferProps = {
	progress: number;
	buffer: number;
};
export const LineProgressBuffer = ({
	progress,
	buffer,
}: LineProgressBufferProps) => {
	return (
		<LinearProgress
			variant="buffer"
			value={progress}
			valueBuffer={buffer}
		/>
	);
};
