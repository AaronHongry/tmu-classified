import { Button } from "./ui/button";
import Link from "next/link";
export const Footer: React.FC<{}> = () => {
	return (
		<div className="bg-white w-full flex justify-center items-center">
			<div className="containered q-mx-auto flex sm:flex-row flex-col justify-between gap-y-4  py-8">
				<div className="flex gap-2 justify-center md:justify-end items-center">
					<img className="h-[60px]" alt="logo" src="/logo.png"></img>
				</div>
				<div className="flex flex-col items-center md:items-end pb-4 text-p0 gap-2">
					<div className="flex flex-col items-end">
						<div className=" mb-[-3px]">© 2023 TMU Classified</div>
						<div className="opacity-40 text-xs">
							All rights reserved
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
