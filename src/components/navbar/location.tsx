import { CiLocationOn } from "react-icons/ci";
import { Button } from "../ui/button";

export const LocationSelect: React.FC<{}> = () => {
	return (
		<div className="flex">
			<Button variant="flat">
				<div className="flex items-center gap-2 opacity-80">
					<CiLocationOn size={20} />
					<div className="text-sm">City of Toronto, Ontario</div>
				</div>
			</Button>
		</div>
	);
};
