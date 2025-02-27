import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { auth, db, storage } from "@/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import MyChats from "@/components/data/myChatsCollection";
import MyListings from "@/components/data/myListingCollection";


export default function Chats() {
	return (
		<div className="flex flex-col min-h-screen containered">
			<Card>
				<CardHeader>
					<CardTitle>My Messages</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription className="flex flex-col gap-4">
						<MyChats />
					</CardDescription>
				</CardContent>
			</Card>
		</div>
	);
}