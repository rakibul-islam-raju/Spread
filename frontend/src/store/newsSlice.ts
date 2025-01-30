import { create } from "zustand";
import { INews } from "../types/news";

interface NewsState {
	news: INews[];
	setNews: (news: INews[]) => void;
	addNews: (news: INews) => void;
	updateReadStatus: (newsId: number, read: boolean) => void;
	markAllRead: () => void;
}

export const useNewsStore = create<NewsState>((set) => ({
	news: [],
	setNews: (news) => set({ news }),
	addNews: (news) => set((state) => ({ news: [news, ...state.news] })),
	updateReadStatus: (newsId, read) =>
		set((state) => ({
			news: state.news.map((n) => (n.id === newsId ? { ...n, read } : n)),
		})),
	markAllRead: () =>
		set((state) => ({
			news: state.news.map((n) => ({ ...n, read: true })),
		})),
}));
