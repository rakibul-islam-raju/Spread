import {
	Autocomplete,
	Button,
	Card,
	Divider,
	Stack,
	TextField,
	Typography,
} from "@mui/material";

const options = [
	{ label: "The Godfather", id: 1 },
	{ label: "Pulp Fiction", id: 2 },
];

export const UserList = () => {
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
				/>
				<Autocomplete
					multiple
					disablePortal
					options={options}
					sx={{ width: "100%" }}
					renderInput={(params) => (
						<TextField {...params} variant="standard" label="Users" />
					)}
				/>
				<Button fullWidth variant="contained">
					Publish
				</Button>
			</Stack>
		</Card>
	);
};
