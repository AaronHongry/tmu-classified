import * as React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "next/dist/lib/metadata/types/metadata-types";
import { IconType } from "react-icons";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	icon?: IconType;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, icon: Zicon, ...props }, ref) => {
		return (
			<div
				className={cn(
					"flex gap-2 items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
			>
				{Zicon && <Zicon size={20} className="pr opacity-60" />}
				<input
					type={type}
					className="w-full bg-transparent placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					ref={ref}
					{...props}
				/>
			</div>
		);
	}
);
Input.displayName = "Input";

export { Input };
