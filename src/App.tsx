import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage.tsx";
import { NotePage } from "./pages/NotePage.tsx";
import { TestPage } from "./pages/TestPage.tsx";
import { NoteOpenPage } from "./pages/NoteOpenPage.tsx";

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
			path: "/note/open",
			element: <NoteOpenPage />,
		},
	]);
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
