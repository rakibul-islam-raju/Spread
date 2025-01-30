import {
	Avatar,
	Card,
	Checkbox,
	Divider,
	FormControlLabel,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import React from "react";

const CustomListItem = styled(ListItem, {
	shouldForwardProp: (prop) => prop !== "read",
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
})<{ read?: boolean }>(({ theme, read }) => ({
	cursor: "pointer",
	backgroundColor: read ? "#accdec" : "transparent",
}));

export const NewsList = () => {
	return (
		<>
			<Card variant="outlined" sx={{ padding: 2 }}>
				<Stack direction={"row"} justifyContent="space-between" gap={4}>
					<Typography variant="h5" gutterBottom>
						Recent News
					</Typography>

					<Stack direction={"row"} gap={2}>
						<FormControlLabel control={<Checkbox />} label="Mark All" />
					</Stack>
				</Stack>
				<Divider />
				<List
					sx={{ width: "100%", maxHeight: 500, bgcolor: "background.paper" }}
				>
					<CustomListItem alignItems="flex-start">
						<ListItemAvatar>
							<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
						</ListItemAvatar>
						<ListItemText
							primary="Brunch this weekend?"
							secondary={
								<React.Fragment>
									<Typography
										component="span"
										variant="body2"
										sx={{ color: "text.primary", display: "inline" }}
									>
										Ali Connors
									</Typography>
									{" — I'll be in your neighborhood doing errands this…"}
								</React.Fragment>
							}
						/>
						<Checkbox />
					</CustomListItem>
					<CustomListItem alignItems="flex-start" read>
						<ListItemAvatar>
							<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
						</ListItemAvatar>
						<ListItemText
							primary="Brunch this weekend?"
							secondary={
								<React.Fragment>
									<Typography
										component="span"
										variant="body2"
										sx={{ color: "text.primary", display: "inline" }}
									>
										Ali Connors
									</Typography>
									{" — I'll be in your neighborhood doing errands this…"}
								</React.Fragment>
							}
						/>
						<Checkbox />
					</CustomListItem>
				</List>
			</Card>
		</>
	);
};
