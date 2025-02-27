export const LINKS: Link[] = [
	{
		name: "Sell",
		href: "/sell",
	},
	{
		name: "Listings",
		href: "/listings",
	},
	{
		name: "Offerings",
		href: "tel:678-790-6651",
	},
	{
		name: "Messages",
		href: "/messageboard",
	},
];

export interface Link {
	name: string;
	href: string;
}
