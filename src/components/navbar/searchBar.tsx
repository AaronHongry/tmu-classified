"use client";
import React, { useState } from 'react';
import { Button } from "../ui/button"; 
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { CATEGORIES } from "@/data/CATEGORIES";
import { IoSearchOutline } from "react-icons/io5";


export const SearchBar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
	const [ searchQuery, setSearchQuery ] = useState('');

	const handleSubmit = () => {
		onSearch(searchQuery);
	}


	return (
		<div className="flex md:flex-row flex-col gap-2">
			<Input
				type="text"
				icon={IoSearchOutline}
				placeholder="What are you looking for?"
				className="flex-12"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<div className="flex gap-2">
				<Select defaultValue="all">
					<SelectTrigger className="md:w-[200px]">
						<SelectValue placeholder="Category" />
					</SelectTrigger>
					<SelectContent>
						{CATEGORIES.map((c) => (
							<SelectItem
								key={`search-${c.value}`}
								value={c.value}
							>
								<div className="flex gap-2 items-center">
									{
										<c.icon
											className="opacity-60"
											size={20}
										/>
									}
									{c.name}
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Button variant="simple" onClick={handleSubmit}>Submit</Button>
			</div>
		</div>
	);
};