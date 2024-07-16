import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage.tsx";
import { NotePage } from "./pages/NotePage.tsx";
import { TestPage } from "./pages/TestPage.tsx";
import { NoteOpenPage } from "./pages/NoteOpenPage.tsx";
import { UserPage } from "./pages/UserPage.tsx";
import { VideoPage } from "./pages/VideoPage.tsx";
import CustomHeader1 from "./components/HomePage/CustomHeader1.tsx";
import { VideoSearchPage } from "./pages/VideoSearchPage.tsx";
import { VideoOpenPage } from "./pages/VideoOpenPage.tsx";

function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <HomePage />,
        },
        {
            path: "/note",
            element: <NotePage />,
        },
        {
            path: "/video",
            element: <VideoPage />,
        },
        {
            path: "/video/open/:videoId",
            element: <VideoOpenPage/>
        },
        {
            path: "/video/search",
            element: <VideoSearchPage/>
        },
        {
            path: "/test",
            element: <TestPage />,
        },
        {
            path: "/note/open/:noteId",
            element: <NoteOpenPage />,
        },
        {
            path: "/user/:userId",
            element: <UserPage />,
        },
    ]);
    return (
        <>
            <CustomHeader1>
                <RouterProvider router={router} />
            </CustomHeader1>
        </>
    );
}

export default App;
