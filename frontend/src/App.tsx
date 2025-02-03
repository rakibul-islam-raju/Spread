import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicRoute from "./components/PublicRoute";
import { Homepage } from "./pages/Homepage";
import { LoginPage } from "./pages/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import { CssBaseline } from "@mui/material";

const App = () => {
	return (
		<>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route
						path="/login"
						element={
							<PublicRoute>
								<LoginPage />
							</PublicRoute>
						}
					/>
					<Route
						path="/"
						element={
							<PrivateRoute>
								<Homepage />
							</PrivateRoute>
						}
					/>
				</Routes>
			</BrowserRouter>
		</>
	);
};

export default App;
