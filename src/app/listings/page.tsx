import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import MyListings from "@/components/data/myListingCollection";

export default function Listings() {
	return (
		<div className="flex flex-col min-h-screen containered">
			<Card>
				<CardHeader>
					<CardTitle>My Listings</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription className="flex flex-col gap-4">
						<MyListings />
					</CardDescription>
				</CardContent>
			</Card>
		</div>
	);
}
