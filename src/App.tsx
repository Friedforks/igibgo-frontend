import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage.tsx";
import { NotePage } from "./pages/NotePage.tsx";
import { TestPage } from "./pages/TestPage.tsx";

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
	]);
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
