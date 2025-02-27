import { IconType } from "react-icons";
import {
	FaBook,
	FaPencilAlt,
	FaLaptop,
	FaChalkboardTeacher,
} from "react-icons/fa";
import { MdOutlinePiano } from "react-icons/md";
import { IoGridOutline, IoPersonSharp } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
export const CATEGORIES: Category[] = [
	{
		name: "All Categories",
		value: "all",
		icon: IoGridOutline,
	},
	{
		name: "Textbooks",
		value: "textbooks",
		icon: FaBook,
	},
	{
		name: "Tutoring",
		value: "tutoring",
		icon: IoPersonSharp,
	},
	{
		name: "Study Group",
		value: "study group",
		icon: FaUserGroup,
	},

	{
		name: "Stationaries",
		value: "stationaries",
		icon: FaPencilAlt,
	},
	{
		name: "Devices",
		value: "devices",
		icon: FaLaptop,
	},
	{
		name: "Instruments",
		value: "instruments",
		icon: MdOutlinePiano,
	},
];

export interface Category {
	name: string;
	value: string;
	icon: IconType;
}
