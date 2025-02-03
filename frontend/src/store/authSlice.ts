import { create } from "zustand";
import { ITokens } from "../types";

type AuthState = {
	isAuthenticated: boolean;
	access?: string;
	login: (tokens: ITokens) => void;
	logout: () => void;
};

const authData = localStorage.getItem("spread_auth")
	? JSON.parse(localStorage.getItem("spread_auth")!)
	: null;

const authSlice = create<AuthState>((set) => ({
	isAuthenticated: !!authData?.access,
	access: authData?.access,
	login: (tokens: ITokens) => {
		set({
			isAuthenticated: true,
			access: tokens.access,
		});
		localStorage.setItem("spread_auth", JSON.stringify(tokens));
	},
	logout: () => {
		set({ isAuthenticated: false });
		localStorage.clear();
	},
}));

export default authSlice;
