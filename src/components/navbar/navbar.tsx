import Link from "next/link";
import { NavbarAuth } from "./navbarAuth";
export const Navbar: React.FC<{}> = () => {
	return (
		<div className="containered q-mx-auto flex flex-col gap-2 justify-center pt-8">
			<div className="flex gap-8 justify-between items-center py-6">
				{/* TITLE */}
				<Link href="/">
					<img className=" h-[80px]" src="/logo.png"></img>
				</Link>
				<NavbarAuth />
			</div>
		</div>
	);
};
