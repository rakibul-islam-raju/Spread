import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container, CssBaseline, Grid2 } from "@mui/material";
import Topbar from "./components/TopBar";
import { NewsList } from "./components/NewsList";
import { Broadcast } from "./components/Broadcast";
import { useEffect, useLayoutEffect, useState } from "react";
import { Login } from "./components/Login";
import { ITokens } from "./types";

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [authData, setAuthData] = useState<ITokens | undefined>(undefined);

	const handleSetLoggedin = (value: boolean) => {
		setIsLoggedIn(value);
	};

	useEffect(() => {
		// Fetch token from localStorage (if authentication is needed)
		const authData = localStorage.getItem("spread_auth")
			? JSON.parse(localStorage.getItem("spread_auth")!)
			: null;
		const token = authData?.token;

		// Construct WebSocket URL with token (if needed)
		const wsUrl = `ws://127.0.0.1:8000/ws/news/?token=${token}`;

		// Create WebSocket connection
		const socket = new WebSocket(wsUrl);

		socket.onopen = () => {
			console.log("WebSocket connected!");
		};

		socket.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log("Received:", data);
		};

		socket.onerror = (error) => {
			console.error("WebSocket Error:", error);
		};

		socket.onclose = () => {
			console.log("WebSocket Disconnected");
		};

		// Cleanup on component unmount
		return () => {
			socket.close();
		};
	}, []);

	useLayoutEffect(() => {
		const authData = localStorage.getItem("spread_auth")
			? JSON.parse(localStorage.getItem("spread_auth")!)
			: null;
		if (authData) {
			setIsLoggedIn(true);
			setAuthData(authData as ITokens);
		}
	}, []);

	if (!isLoggedIn) {
		return <Login handleSetLoggedin={handleSetLoggedin} />;
	}

	return (
		<div>
			<CssBaseline />
			<Topbar />

			<Container maxWidth="xl">
				<Grid2 container spacing={2} mt={4}>
					<Grid2 size={7}>
						<NewsList authData={authData!} />
					</Grid2>
					<Grid2 size={5}>
						<Broadcast authData={authData!} />
					</Grid2>
				</Grid2>
			</Container>
		</div>
	);
};

export default App;
