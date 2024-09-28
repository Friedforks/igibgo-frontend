import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {HomePage} from "./pages/HomePage.tsx";
import {NotePage} from "./pages/NotePage.tsx";
import {TestPage} from "./pages/TestPage.tsx";
import {NoteOpenPage} from "./pages/NoteOpenPage.tsx";
import {UserPage} from "./pages/UserPage.tsx";
import {VideoPage} from "./pages/VideoPage.tsx";
import CustomHeader1 from "./components/HomePage/CustomHeader1.tsx";
import {VideoOpenPage} from "./pages/VideoOpenPage.tsx";
import {ForumPage} from "./pages/ForumPage.tsx";
import {PostEditPage} from "./pages/PostEditPage.tsx";
import {PostOpenPage} from "./pages/PostOpenPage.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage/>,
        },
        {
            path: "/note",
            element: <NotePage/>,
        },
        {
            path: "/video/search/:title",
            element: <VideoPage/>,
        },
        {
            path: "/video/search",
            element: <VideoPage/>,
        },
        {
            path: "/video/open/:videoId",
            element: <VideoOpenPage/>
        },
        {
            path: "/test",
            element: <TestPage/>,
        },
        {
            path: "/note/open/:noteId",
            element: <NoteOpenPage/>,
        },
        {
            path: "/user/:userId",
            element: <UserPage/>,
        },
        {
            path: "/forum/search",
            element: <ForumPage/>
        },
        {
            path: "/forum/search/:keywords",
            element: <ForumPage/>
        },
        {
            path: "/forum/new",
            element: <PostEditPage/>
        },
        {
            path: "/forum/open/:postId",
            element: <PostOpenPage/>
        }
    ]);
    return (
        <>
            <CustomHeader1>
                <RouterProvider router={router}/>
            </CustomHeader1>
        </>
    );
}

export default App;
