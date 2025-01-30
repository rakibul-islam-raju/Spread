import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Container, CssBaseline, Grid2 } from "@mui/material";
import Topbar from "./components/TopBar";
import { NewsList } from "./components/NewsList";
import { UserList } from "./components/UserList";
import { useState } from "react";
import { Login } from "./components/Login";

const App = () => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

	const handleSetLoggedin = (value: boolean) => {
		setIsLoggedIn(value);
	};

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
						<NewsList />
					</Grid2>
					<Grid2 size={5}>
						<UserList />
					</Grid2>
				</Grid2>
			</Container>
		</div>
	);
};

export default App;
