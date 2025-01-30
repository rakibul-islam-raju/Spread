import {
	Autocomplete,
	Button,
	Card,
	Divider,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import { FC, useState } from "react";
import { ITokens } from "../types";

const options = [
	{ label: "Raju", id: 1 },
	{ label: "John", id: 2 },
];

type Props = {
	authData: ITokens;
};

export const Broadcast: FC<Props> = ({ authData }) => {
	const [message, setMessage] = useState<string>("");
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const handlePublish = async () => {
		if (!message || selectedUsers.length === 0) return;

		setLoading(true);
		try {
			await axios.post(
				"/api/news/",
				{
					message,
					receivers: selectedUsers,
				},
				{
					headers: {
						Authorization: `Bearer ${authData.access}`,
					},
				}
			);
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
				<Autocomplete
					multiple
					disablePortal
					options={options}
					value={options.filter((opt) => selectedUsers.includes(opt.id))}
					onChange={(_, newValue) => {
						setSelectedUsers(newValue.map((v) => v.id));
					}}
					sx={{ width: "100%" }}
					renderInput={(params) => (
						<TextField {...params} variant="standard" label="Users" />
					)}
				/>
				<Button
					fullWidth
					variant="contained"
					onClick={handlePublish}
					disabled={loading || !message || selectedUsers.length === 0}
				>
					{loading ? "Publishing..." : "Publish"}
				</Button>
			</Stack>
		</Card>
	);
};
