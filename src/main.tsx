import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material";
import theme from "./theme.ts";
import { CssOutlined } from "@mui/icons-material";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<ThemeProvider theme={theme}>
		<CssOutlined/>
		<App />
	</ThemeProvider>
);
