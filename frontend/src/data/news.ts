import { INews } from "../types/news";

export const newsData: INews[] = [
	{
		id: 1,
		title: "New React 19 Features Released",
		description: "React 19 introduces new hooks and performance improvements.",
		published_at: "2025-01-30T10:00:00Z",
		read: false,
		published_by: { full_name: "John Doe", username: "John" },
	},
	{
		id: 2,
		title: "Next.js 15 Beta Available",
		description: "Next.js 15 beta is now available with better SSR support.",
		published_at: "2025-01-29T12:30:00Z",
		read: true,
		published_by: { full_name: "Jane Smith", username: "Jane" },
	},
	{
		id: 3,
		title: "TypeScript 5.5 Released",
		description: "TypeScript 5.5 adds better type inference and utility types.",
		published_at: "2025-01-28T09:15:00Z",
		read: false,
		published_by: {
			full_name: "Alice Johnson",
			username: "Alice",
		},
	},
	{
		id: 4,
		title: "Django 5.1 Update",
		description: "Django 5.1 brings async ORM improvements.",
		published_at: "2025-01-27T14:45:00Z",
		read: true,
		published_by: {
			full_name: "Robert Brown",
			username: "Robert",
		},
	},
	{
		id: 5,
		title: "Vite 6 Released",
		description: "Vite 6 enhances build speed and DX.",
		published_at: "2025-01-26T18:20:00Z",
		read: false,
		published_by: { full_name: "Emma Wilson", username: "Emma" },
	},
	{
		id: 6,
		title: "Node.js 20 LTS",
		description: "Node.js 20 enters LTS with improved performance.",
		published_at: "2025-01-25T11:10:00Z",
		read: true,
		published_by: {
			full_name: "Michael Scott",
			username: "Michael",
		},
	},
	{
		id: 7,
		title: "Tailwind CSS v4 Announced",
		description: "Tailwind CSS v4 introduces new utility classes.",
		published_at: "2025-01-24T07:50:00Z",
		read: false,
		published_by: { full_name: "David Lee", username: "David" },
	},
	{
		id: 8,
		title: "ESLint v9 Released",
		description: "ESLint v9 adds improved rule enforcement.",
		published_at: "2025-01-23T16:40:00Z",
		read: true,
		published_by: {
			full_name: "Sophia Martinez",
			username: "Sophia",
		},
	},
	{
		id: 9,
		title: "New AI Features in VS Code",
		description: "VS Code integrates AI-powered coding assistance.",
		published_at: "2025-01-22T13:30:00Z",
		read: false,
		published_by: { full_name: "Chris Evans", username: "Chris" },
	},
	{
		id: 10,
		title: "GraphQL Federation 2.0",
		description: "GraphQL Federation 2.0 improves scalability.",
		published_at: "2025-01-21T08:25:00Z",
		read: true,
		published_by: {
			full_name: "Olivia Taylor",
			username: "Olivia",
		},
	},
];
