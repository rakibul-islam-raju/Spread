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
import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNewsStore } from "../store/newsSlice";
import { ITokens } from "../types";
import AudioSound from "../assets/beep.wav";
import { INews } from "../types/news";
import PreviewModal from "./PreviewModal";

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

type Props = {
	authData: ITokens;
};

export const NewsList: FC<Props> = ({ authData }) => {
	const {
		news,
		setNews,
		// updateReadStatus, markAllRead
	} = useNewsStore();

	const listRef = useRef<HTMLUListElement>(null);

	const [audio] = useState<HTMLAudioElement>(new Audio(AudioSound));
	const [newItems, setNewItems] = useState<Set<number>>(new Set());
	const [selectedItem, setSelectedItem] = useState<INews | null>(null);

	const playSound = () => {
		audio.play();
	};

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
		const ws = new WebSocket(
			`ws://127.0.0.1:8000/ws/news/?token=${authData.access}`
		);

		ws.onopen = () => {
			console.log("WebSocket connected! 🎉");
		};

		ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

		ws.onclose = (event) => {
			console.log("WebSocket closed:", event.code, event.reason);
		};

		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			// Add new news to the store
			playSound();
			// new Audio(AudioSound).play();
			useNewsStore.getState().addNews(message);

			// Scroll to top when new message arrives
			if (listRef.current) {
				listRef.current.scrollTo({ top: 0, behavior: "smooth" });
			}

			// Mark the new item for 3 seconds
			setNewItems((prev) => {
				const updated = new Set(prev);
				updated.add(message.id);
				return updated;
			});

			setTimeout(() => {
				setNewItems((prev) => {
					const updated = new Set(prev);
					updated.delete(message.id);
					return updated;
				});
			}, 5000);
		};

		return () => {
			ws.close();
		};
	}, [setNews]);

	// const handleReadChange = async (newsId: number, read: boolean) => {
	// 	try {
	// 		await axios.patch(`/api/news/${newsId}/`, { read });
	// 		updateReadStatus(newsId, read);
	// 	} catch (error) {
	// 		console.error("Error updating read status:", error);
	// 	}
	// };

	// const handleMarkAllRead = async () => {
	// 	try {
	// 		await axios.post("/api/news/mark-all-read/");
	// 		markAllRead();
	// 	} catch (error) {
	// 		console.error("Error marking all as read:", error);
	// 	}
	// };

	return (
		<>
			<Card variant="outlined" sx={{ padding: 2 }}>
				<Stack direction="row" justifyContent="space-between" gap={4}>
					<Typography variant="h5" gutterBottom>
						Recent News
					</Typography>

					<Stack direction="row" gap={2}>
						<Button>Select all as read</Button>
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
							read={newsItem.read}
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
				/>
			)}
		</>
	);
};
