import { Video } from "../../entity/Video/Video.ts"
import { TabPanel } from "@mui/lab";
import { VideoGrid } from "../Video/VideoGrid";

type UserVideoTabProps={
    videos:Video[];
}

export const UserVideoTab=({videos}:UserVideoTabProps)=>{
    return (
		<TabPanel id="2" value="2" sx={{ padding: 0 }}>
            <VideoGrid
                videos={videos}
            />
		</TabPanel>
    )
}