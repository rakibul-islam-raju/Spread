import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";

export default function Topbar() {
	const handleLogout = () => {
		localStorage.clear();
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton size="large" edge="start" color="inherit" sx={{ mr: 1 }}>
						<CampaignIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						Spreadit
					</Typography>

					<Box sx={{ flexGrow: 1 }} />

					<Button variant="contained" color="warning" onClick={handleLogout}>
						Logout
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
