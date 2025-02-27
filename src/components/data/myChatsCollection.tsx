"use client";
import { auth, db } from "@/firebase/config";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { UserObject } from "@/models/user";
import { doc, DocumentReference } from "firebase/firestore";
import Link from "next/link";




export default function MyChats() {
	const [user] = useAuthState(auth);


    //const [chats] = useCollectionData(user && query(collection(db, "chats"), where('participants[0]', '==', user.uid), ));
	const [chats] = useCollectionData(user && query(collection(db, "chats")));
	
	if (!chats || !user) {
		return;
	}

	const userChats = chats.filter(chat => chat.participants[0] === user.uid);
	const sortedChats = userChats ? userChats.sort((a, b) => b.date.toMillis() - a.date.toMillis()) : [];

	return (
		<>
			{sortedChats?.map((chat) => (
				<div className={`flex gap-2`}>
					<div className={`flex flex-col w-full`}>
						<div className="capitalize text-black font-bold text-lg">{chat.receiverName}
						<div className="text-sm text-gray-500 text-right">
                            {chat.date?.toDate().toISOString().split("T")[0]}
                    	</div>
						<Link href={`/messages/${chat.receiver}`} className="w-full"><button className="bg-slate-400 p-2 text-white w-full rounded-3xl hover:bg-slate-300 hover:text-gray-600 transition-colors duration-150">Message</button></Link>
						</div>
					</div>
				</div>
			))}
		</>
	);
}