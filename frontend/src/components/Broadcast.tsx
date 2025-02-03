import {
	Button,
	Card,
	Checkbox,
	Divider,
	FormControlLabel,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { INewsPostData } from "../types/news";
import { api } from "../config/api";
import AsyncUserSearch from "./AsyncUserSearch";

export const Broadcast = () => {
	const [message, setMessage] = useState<string>("");
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [sendToAll, setSendToAll] = useState(false);

	const hasReceiver = selectedUsers.length > 0 || sendToAll;
	const disableSubmitBtn = loading || !message || !hasReceiver;

	const handlePublish = async () => {
		if (!message || !hasReceiver) return;

		setLoading(true);
		const postaData: INewsPostData = {
			message,
			receivers: selectedUsers,
		};

		if (sendToAll) postaData.send_to_all = true;

		try {
			await api.post("news/", { ...postaData });
			setSendToAll(false);
			setMessage("");
			setSelectedUsers([]);
		} catch (error) {
			console.error("Error publishing news:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card variant="outlined" sx={{ padding: 2 }}>
			<Typography variant="h5" gutterBottom>
				New Broadcast
			</Typography>
			<Divider />
			<Stack gap={2} mt={2}>
				<TextField
					variant="standard"
					label="Message..."
					multiline
					rows={4}
					fullWidth
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				/>
				<FormControlLabel
					control={
						<Checkbox
							name="send_to_all"
							value={sendToAll}
							onChange={(e) => setSendToAll(e.target.checked)}
						/>
					}
					label="Broadcast to all"
				/>
				<AsyncUserSearch
					disabled={sendToAll}
					selectedUsers={selectedUsers}
					onUserSelect={(users) => {
						setSelectedUsers(users);
					}}
				/>
				<Button
					fullWidth
					variant="contained"
					onClick={handlePublish}
					disabled={disableSubmitBtn}
				>
					{loading ? "Publishing..." : "Publish"}
				</Button>
			</Stack>
		</Card>
	);
};
