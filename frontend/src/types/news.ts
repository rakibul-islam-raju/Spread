import { IPublishedBy } from "./User";

export type INews = {
	id: number;
	title: string;
	message: string;
	published_at: string;
	read: boolean;
	sender: IPublishedBy;
};
