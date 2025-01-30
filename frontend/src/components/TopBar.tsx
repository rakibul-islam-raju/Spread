import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mui/material";

export default function Topbar() {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="open drawer"
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ display: { xs: "none", sm: "block" } }}
					>
						SPREAD
					</Typography>

					<Box sx={{ flexGrow: 1 }} />

					<Button type="submit" variant="contained" color="warning">
						Logout
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
