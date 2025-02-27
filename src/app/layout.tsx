import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import "./custom.css";
import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer";

const inter = Quicksand({ subsets: ["latin"] });
import { NextUIProvider } from "@nextui-org/react";
export const metadata: Metadata = {
	title: "TMU Classified",
	description: "Buy, Sell & Save with TMU's #1 Local Classifieds",
	icons: {
		icon: "/icon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${inter.className} flex flex-col items-stretch bg-slate-200`}
			>
				<Navbar />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
