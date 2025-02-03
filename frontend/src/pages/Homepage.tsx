import Topbar from "../components/TopBar";
import { Container, Grid2 } from "@mui/material";
import { NewsList } from "../components/NewsList";
import { Broadcast } from "../components/Broadcast";

export const Homepage = () => {
	return (
		<>
			<Topbar />

			<Container maxWidth="xl">
				<Grid2 container spacing={2} mt={4}>
					<Grid2 size={7}>
						<NewsList />
					</Grid2>
					<Grid2 size={5}>
						<Broadcast />
					</Grid2>
				</Grid2>
			</Container>
		</>
	);
};
