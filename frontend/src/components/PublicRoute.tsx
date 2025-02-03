import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import authSlice from "../store/authSlice";

const PublicRoute = ({ children }: { children: ReactNode }) => {
	const isAuthenticated = authSlice((state) => state.isAuthenticated);

	return !isAuthenticated ? children : <Navigate to="/" />;
};

export default PublicRoute;
