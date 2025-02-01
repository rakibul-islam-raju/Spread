import { FC, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { INews } from "../types/news";

type Props = {
	selectedItem: INews;
	open: boolean;
	handleClose: () => void;
	markAsRead: (newsId: number) => void;
};

const PreviewModal: FC<Props> = ({
	selectedItem,
	open,
	handleClose,
	markAsRead,
}) => {
	useEffect(() => {
		if (selectedItem && !selectedItem.is_read) {
			markAsRead(selectedItem.id);
		}
	}, [selectedItem]);

	return (
		<Dialog open={open} onClose={() => handleClose()} maxWidth="md" fullWidth>
			<DialogTitle>
				<Stack direction={"row"} justifyContent={"space-between"}>
					<Stack direction={"row"} gap={1} alignItems={"center"}>
						<Typography variant="h5">
							{selectedItem?.sender.full_name}{" "}
						</Typography>
						<span style={{ fontSize: 15, color: "blue" }}>
							@{selectedItem?.sender.username}
						</span>
					</Stack>
					<Typography>
						Date: {new Date(selectedItem!.published_at).toLocaleString()}
					</Typography>
				</Stack>
			</DialogTitle>
			<Divider />
			<DialogContent>
				<p>
					<span>{selectedItem?.message}</span>
				</p>
			</DialogContent>
		</Dialog>
	);
};

export default PreviewModal;
