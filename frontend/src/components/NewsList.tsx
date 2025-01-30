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
import { FC, useEffect } from "react";
import axios from "axios";
import { useNewsStore } from "../store/newsSlice";
import { ITokens } from "../types";

const CustomListItem = styled(ListItem, {
	shouldForwardProp: (prop) => prop !== "read",
})<{ read?: boolean; checked?: boolean }>(({ theme, read, checked }) => ({
	cursor: "pointer",
	backgroundColor: checked ? "#ddefff" : "transparent",
	borderLeft: !read ? "5px solid" : "none",
	borderColor: theme.palette.primary.main,
}));

type Props = {
	authData: ITokens;
};

export const NewsList: FC<Props> = ({ authData }) => {
	const { news, setNews, updateReadStatus, markAllRead } = useNewsStore();

	useEffect(() => {
		// Fetch initial news

		const fetchNews = async () => {
			try {
				const response = await axios.get("http://localhost:8000/api/news/", {
					headers: {
						Authorization: `Bearer ${authData.access}`,
					},
				});
				setNews(response.data?.results);
			} catch (error) {
				console.error("Error fetching news:", error);
			}
		};
		fetchNews();

		// Setup WebSocket
		const socket = new WebSocket(`ws://${window.location.host}/ws/news/`);

		socket.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.type === "news_message") {
				// Add new news to the store
				useNewsStore.getState().addNews(message.data);
			}
		};

		return () => {
			socket.close();
		};
	}, [setNews]);

	const handleReadChange = async (newsId: number, read: boolean) => {
		try {
			await axios.patch(`/api/news/${newsId}/`, { read });
			updateReadStatus(newsId, read);
		} catch (error) {
			console.error("Error updating read status:", error);
		}
	};

	const handleMarkAllRead = async () => {
		try {
			await axios.post("/api/news/mark-all-read/");
			markAllRead();
		} catch (error) {
			console.error("Error marking all as read:", error);
		}
	};

	return (
		<>
			<Card variant="outlined" sx={{ padding: 2 }}>
				<Stack direction="row" justifyContent="space-between" gap={4}>
					<Typography variant="h5" gutterBottom>
						Recent News
					</Typography>

					<Stack direction="row" gap={2}>
						<FormControlLabel
							control={<Checkbox onChange={handleMarkAllRead} />}
							label="Mark All"
						/>
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
					{news?.map((newsItem) => (
						<CustomListItem
							key={newsItem.id}
							alignItems="flex-start"
							read={newsItem.read}
						>
							<ListItemAvatar>
								<Avatar
									alt={newsItem.sender.full_name}
									src="/static/images/avatar/1.jpg"
								/>
							</ListItemAvatar>
							<ListItemText
								primary={newsItem.message}
								secondary={
									<Typography
										component="span"
										variant="body2"
										sx={{ color: "text.primary" }}
									>
										{newsItem.sender.full_name} -{" "}
										{new Date(newsItem.published_at).toLocaleString()}
									</Typography>
								}
							/>
							<Checkbox
								checked={newsItem.read}
								onChange={(e) =>
									handleReadChange(newsItem.id, e.target.checked)
								}
							/>
						</CustomListItem>
					))}
				</List>
			</Card>
		</>
	);
};
