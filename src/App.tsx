import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./pages/HomePage.tsx";
import { NotePage } from "./pages/NotePage.tsx";

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
	]);
	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
