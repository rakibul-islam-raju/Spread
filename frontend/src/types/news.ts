import { IPublishedBy } from "./User";

export type INews = {
	id: number;
	title: string;
	message: string;
	published_at: string;
	is_read: boolean;
	sender: IPublishedBy;
};
