import { create } from "zustand";
import { INews } from "../types/news";

interface NewsState {
	news: INews[];
	setNews: (news: INews[]) => void;
	addNews: (news: INews) => void;
	updateReadStatus: (newsId: number) => void;
	markAllRead: () => void;
}

export const useNewsStore = create<NewsState>((set) => ({
	news: [],
	setNews: (news) => set({ news }),
	addNews: (news) => set((state) => ({ news: [news, ...state.news] })),
	updateReadStatus: (newsId) =>
		set((state) => ({
			news: state.news.map((n) =>
				n.id === newsId ? { ...n, is_read: true } : n
			),
		})),
	markAllRead: () =>
		set((state) => ({
			news: state.news.map((n) => ({ ...n, is_read: true })),
		})),
}));
