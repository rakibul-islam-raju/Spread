// AsyncUserSearch.tsx
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useDebounce } from "../hooks/useDebounce";
import { IUser } from "../types/User";
import { api } from "../config/api";

type AsyncUserSearchProps = {
	disabled?: boolean;
	selectedUsers: number[];
	onUserSelect: (userIds: number[]) => void;
	apiEndpoint?: string;
};

const AsyncUserSearch: React.FC<AsyncUserSearchProps> = ({
	disabled = false,
	selectedUsers,
	onUserSelect,
	apiEndpoint = "/users/",
}) => {
	const [inputValue, setInputValue] = useState<string>("");
	const [options, setOptions] = useState<IUser[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedOptions, setSelectedOptions] = useState<IUser[]>([]);

	const fetchUsers = async (searchQuery: string) => {
		try {
			setLoading(true);
			const { data } = await api.get(
				`${apiEndpoint}?search=${encodeURIComponent(searchQuery)}`
			);
			setOptions(data?.results || []);
		} catch (error) {
			console.error("Error fetching users:", error);
			setOptions([]);
		} finally {
			setLoading(false);
		}
	};

	// Initial fetch on component mount
	useEffect(() => {
		fetchUsers("");
	}, []);

	// Use custom debounce hook for search
	const debouncedFetch = useDebounce(fetchUsers, 300);

	// Keep selected users in options
	useEffect(() => {
		setSelectedOptions(
			options.filter((user) => selectedUsers.includes(user.id))
		);
	}, [selectedUsers, options]);

	return (
		<Autocomplete
			multiple
			disabled={disabled}
			options={options}
			value={selectedOptions}
			loading={loading}
			inputValue={inputValue}
			onInputChange={(_, newInputValue) => {
				setInputValue(newInputValue);
				debouncedFetch(newInputValue);
			}}
			onChange={(_, newValue) => {
				onUserSelect(newValue.map((user) => user.id));
			}}
			getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
			isOptionEqualToValue={(option, value) => option.id === value.id}
			renderInput={(params) => (
				<TextField
					{...params}
					variant="standard"
					label="Users"
					placeholder="Search users..."
				/>
			)}
			filterOptions={(x) => x}
			noOptionsText={
				inputValue === "" ? "Start typing to search..." : "No users found"
			}
		/>
	);
};

export default AsyncUserSearch;
