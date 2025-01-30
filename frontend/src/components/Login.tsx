import {
	Box,
	Button,
	Card,
	Divider,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { ChangeEvent, FC, FormEvent, useState } from "react";

type Props = {
	handleSetLoggedin: (value: boolean) => void;
};

export const Login: FC<Props> = () => {
	const [loginData, setLoginData] = useState<{
		username: string;
		password: string;
	}>({
		username: "",
		password: "",
	});

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setLoginData({ ...loginData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!loginData.username || !loginData.password) {
			alert("Username and password is required!");
			return;
		}

		console.log(loginData);
	};

	return (
		<Box
			width={"100%"}
			height={"100vh"}
			display={"flex"}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<Card variant="outlined" sx={{ width: "500px", p: 2 }}>
				<Typography variant="h5" gutterBottom>
					Login
				</Typography>
				<Divider />
				<Box mt={2}>
					<form onSubmit={handleSubmit}>
						<Stack gap={2}>
							<TextField
								variant="standard"
								label="Username"
								name="username"
								value={loginData.username}
								onChange={handleChange}
							/>
							<TextField
								variant="standard"
								label="Username"
								name="password"
								value={loginData.password}
								type="password"
								onChange={handleChange}
							/>
							<Button variant="contained">Login</Button>
						</Stack>
					</form>
				</Box>
			</Card>
		</Box>
	);
};
