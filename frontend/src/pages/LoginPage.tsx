import {
	Box,
	Button,
	Card,
	Divider,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import authSlice from "../store/authSlice";

export const LoginPage = () => {
	const { login } = authSlice();

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

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!loginData.username || !loginData.password) {
			alert("Username and password is required!");
			return;
		}

		try {
			const { data } = await axios.post(
				`http://localhost:8000/api/token/`,
				loginData
			);
			login(data);
		} catch (err) {
			console.log("error =>", err);
		}
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
							<Button variant="contained" type="submit">
								Login
							</Button>
						</Stack>
					</form>
				</Box>
			</Card>
		</Box>
	);
};
