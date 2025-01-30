import { IPublishedBy } from "./User";

export type INews = {
	id: number;
	title: string;
	description: string;
	published_at: string;
	read: boolean;
	published_by: IPublishedBy;
};
