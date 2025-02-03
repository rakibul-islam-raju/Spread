import { Navigate } from "react-router-dom";

import { ReactNode } from "react";
import authSlice from "../store/authSlice";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
	const isAuthenticated = authSlice((state) => state.isAuthenticated);

	return !isAuthenticated ? <Navigate to="/login" /> : children;
};

export default PrivateRoute;
