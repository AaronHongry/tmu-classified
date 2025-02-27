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

export const CategoriesBar: React.FC<{}> = () => {
	return (
		<div className="flex flex-wrap gap-2">
			{CATEGORIES.map((c) => (
				<Button
					key={c.value}
					className="flex gap-2 items-center"
					variant="flat"
				>
					{<c.icon className="opacity-60" size={20} />}
					{c.name}
				</Button>
			))}
		</div>
	);
};
