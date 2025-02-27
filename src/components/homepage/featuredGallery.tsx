"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { FaSearch } from "react-icons/fa";
import { useCollection } from "react-firebase-hooks/firestore";

export const FeaturedGallery: React.FC<{}> = () => {
	// const [postings] = useCollection(()=>c)
	return (
		<div className="flex-col w-full q-mx-auto flex items-center py-8 bg-slate-700">
			<div className="min-h-[100px] containered flex flex-col gap-8">
				<div className="flex justify-between items-center">
					<div className="text-2xl font-bold text-white ">
						Featured Gallery
					</div>
					<Button
						variant="link"
						className="text-white flex gap-2 items-center"
					>
						View more
						<FaSearch />
					</Button>
				</div>
				<div className="flex flex-wrap gap-4">
					{/* TODO */}
					{[...new Array(6)].map((_, i) => (
						<div
							key={i}
							className="h-[150px] min-w-[150px] bg-slate-800 flex-auto"
						/>
					))}
				</div>
			</div>
		</div>
	);
};
