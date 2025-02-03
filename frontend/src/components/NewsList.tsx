import {
	Avatar,
	Button,
	Card,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	styled,
	Tooltip,
	Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNewsStore } from "../store/newsSlice";
import AudioSound from "../assets/beep.wav";
import { INews } from "../types/news";
import PreviewModal from "./PreviewModal";
import { WS_BASE_URL } from "../config";
import { api } from "../config/api";
import authSlice from "../store/authSlice";

const CustomListItem = styled(ListItem, {
	shouldForwardProp: (prop) => prop !== "read",
})<{ read?: boolean }>(({ theme, read }) => ({
	cursor: "pointer",
	backgroundColor: !read ? "#ddefff" : "transparent",
	borderLeft: !read ? "5px solid" : "none",
	borderColor: theme.palette.primary.main,
	marginBottom: 2,
	transition: "all 0.1s ease-in-out",

	"&:hover": {
		backgroundColor: "#cde8ff",
	},
}));

export const NewsList = () => {
	const { access } = authSlice();
	const { news, setNews, updateReadStatus, markAllRead } = useNewsStore();

	const listRef = useRef<HTMLUListElement>(null);

	const [audio] = useState<HTMLAudioElement>(new Audio(AudioSound));
	const [newItems, setNewItems] = useState<Set<number>>(new Set());
	const [selectedItem, setSelectedItem] = useState<INews | null>(null);
	const [socket, setSocket] = useState<WebSocket | null>(null);

	const playSound = () => {
		audio.play();
	};

	// Function to mark a single news as read
	const markAsRead = (newsId: number) => {
		if (socket) {
			socket.send(JSON.stringify({ action: "mark_as_read", news_id: newsId }));
		}
	};

	// Function to mark all news as read
	const markAllAsRead = () => {
		const confirmed = window.confirm(
			"Are you sure you want to mark all as read?"
		);
		if (confirmed) {
			if (socket) {
				socket.send(JSON.stringify({ action: "mark_all_as_read" }));
			}
		}
	};

	useEffect(() => {
		// Fetch initial news

		const fetchNews = async () => {
			try {
				const response = await api.get("/news/");
				setNews(response.data?.results);
			} catch (error) {
				console.error("Error fetching news:", error);
			}
		};
		fetchNews();

		// Setup WebSocket
		const ws = new WebSocket(`${WS_BASE_URL}/news/?token=${access}`);

		ws.onopen = () => {
			setSocket(ws);
			console.log("WebSocket connected! 🎉");
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		ws.onclose = (event) => {
			console.log("WebSocket closed:", event.code, event.reason);
		};

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.status !== "success") {
				console.log("error =>", data.message);
				return;
			}

			switch (data.type) {
				case "news_message":
					// Add new news to the store
					playSound();
					useNewsStore.getState().addNews(data.data);

					// Scroll to top when new message arrives
					if (listRef.current) {
						listRef.current.scrollTo({ top: 0, behavior: "smooth" });
					}

					// Mark the new item for 3 seconds
					setNewItems((prev) => {
						const updated = new Set(prev);
						updated.add(data.data.id);
						return updated;
					});

					setTimeout(() => {
						setNewItems((prev) => {
							const updated = new Set(prev);
							updated.delete(data.data.id);
							return updated;
						});
					}, 5000);
					break;

				case "mark_as_read":
					updateReadStatus(data.data.id);
					break;

				case "mark_all_as_read":
					markAllRead();
					break;

				default:
					break;
			}
		};

		return () => {
			ws.close();
		};
	}, [setNews]);

	return (
		<>
			<Card variant="outlined" sx={{ padding: 2 }}>
				<Stack direction="row" justifyContent="space-between" gap={4}>
					<Typography variant="h5" gutterBottom>
						Recent News
					</Typography>

					<Stack direction="row" gap={2}>
						<Button onClick={markAllAsRead}>Select all as read</Button>
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
					ref={listRef}
				>
					{news?.map((newsItem) => (
						<CustomListItem
							key={newsItem.id}
							alignItems="flex-start"
							read={newsItem.is_read}
							onClick={() => setSelectedItem(newsItem)}
						>
							<ListItemAvatar>
								<Avatar
									alt={newsItem.sender.full_name}
									src="/static/images/avatar/1.jpg"
								/>
							</ListItemAvatar>
							<ListItemText
								primary={
									<Stack direction="row" alignItems="center" gap={1}>
										<Typography
											variant="body1"
											sx={{
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{newsItem.message}
										</Typography>
										{newItems.has(newsItem.id) && (
											<Typography
												variant="caption"
												sx={{
													backgroundColor: "red",
													color: "white",
													padding: "2px 6px",
													borderRadius: "4px",
													fontWeight: "bold",
													fontSize: 12,
												}}
											>
												New
											</Typography>
										)}
									</Stack>
								}
								secondary={
									<Stack direction={"row"} justifyContent={"space-between"}>
										<Typography
											component="span"
											variant="body2"
											sx={{ color: "blue" }}
										>
											<Tooltip title={newsItem.sender.full_name}>
												<span>@{newsItem.sender.username}</span>
											</Tooltip>
										</Typography>
										<Typography variant="body2" fontSize={12}>
											{new Date(newsItem.published_at).toLocaleString()}
										</Typography>
									</Stack>
								}
							/>
						</CustomListItem>
					))}
				</List>
			</Card>

			{!!selectedItem && (
				<PreviewModal
					open={!!selectedItem}
					handleClose={() => setSelectedItem(null)}
					selectedItem={selectedItem}
					markAsRead={markAsRead}
				/>
			)}
		</>
	);
};
