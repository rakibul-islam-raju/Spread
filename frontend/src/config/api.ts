import axios from "axios";
import { API_BASE_URL } from ".";
import { ITokens } from "../types";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add Bearer token if available
api.interceptors.request.use(
	(config) => {
		const authData = localStorage.getItem("spread_auth")
			? (JSON.parse(localStorage.getItem("spread_auth")!) as ITokens)
			: null;
		const token = authData?.access;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export { api };
