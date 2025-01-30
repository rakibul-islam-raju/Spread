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
import { newsData } from "../data/news";

const CustomListItem = styled(ListItem, {
	shouldForwardProp: (prop) => prop !== "read",
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
})<{ read?: boolean; checked?: boolean }>(({ theme, read, checked }) => ({
	cursor: "pointer",
	backgroundColor: checked ? "#ddefff" : "transparent",
	borderLeft: !read ? "5px solid" : "none",
	borderColor: theme.palette.primary.main,
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
					sx={{
						width: "100%",
						maxHeight: 500,
						bgcolor: "background.paper",
						overflowY: "auto",
					}}
				>
					{newsData?.map((news) => (
						<CustomListItem key={news.id} alignItems="flex-start">
							<ListItemAvatar>
								<Avatar
									alt={news.published_by.full_name}
									src="/static/images/avatar/1.jpg"
								/>
							</ListItemAvatar>
							<ListItemText
								primary={news.title}
								secondary={
									<React.Fragment>
										<Typography
											component="span"
											variant="body2"
											sx={{ color: "text.primary", display: "inline" }}
										>
											Ali Connors
										</Typography>
										{news.description}
									</React.Fragment>
								}
							/>
							<Checkbox />
						</CustomListItem>
					))}
				</List>
			</Card>
		</>
	);
};
