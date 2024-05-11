import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage.tsx";
import { NotePage } from "./pages/NotePage.tsx";
import { TestPage } from "./pages/TestPage.tsx";
import { NoteOpenPage } from "./pages/NoteOpenPage.tsx";
import { UserPage } from "./pages/UserPage.tsx";

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
		}
	]);
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
