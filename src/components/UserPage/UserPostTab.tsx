import { TabPanel } from "@mui/lab";
import {Post} from "../../entity/Post/Post.ts";
import {PostList} from "../Post/PostList.tsx";

type UserVideoTabProps={
    posts:Post[];
}

export const UserPostTab=({posts}:UserVideoTabProps)=>{
    return (
		<TabPanel id="3" value="3" sx={{ padding: 0 }}>
            <PostList postList={posts}/>
		</TabPanel>
    )
}