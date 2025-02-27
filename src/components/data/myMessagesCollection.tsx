"use client";
import { auth, db } from "@/firebase/config";
import { collection, query, where, orderBy } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { UserObject } from "@/models/user";
import { doc, DocumentReference } from "firebase/firestore";



export default function MyMessages({ params }: { params: { id: string } }) {
	const [user] = useAuthState(auth);
	/*
	const [messages] = useCollectionData(
		user &&
		query(
			collection(db, "messages"), 
			where("sender", "in", [user.uid, params.id]),
    		where("receiver", "in", [user.uid, params.id]),
			orderBy("date"),
		)
	);
	*/
	if (!user) {
		return <div>Loading or not authenticated...</div>;
	}

	const sentMessagesQuery = query(collection(db, "messages"), where("sender", "==", user.uid), where("receiver", "==", params.id));
  	const receivedMessagesQuery = query(collection(db, "messages"), where("sender", "==", params.id), where("receiver", "==", user.uid));
  
  	const [sentMessages] = useCollectionData(sentMessagesQuery);
  	const [receivedMessages] = useCollectionData(receivedMessagesQuery);

  	const allMessages = [...(sentMessages || []), ...(receivedMessages || [])].sort((a, b) => a.date.toMillis() - b.date.toMillis());
	
	return (
		<>
			{allMessages?.map((message) => (
				<div className={`flex gap-2 ${message.sender === user.uid ? 'justify-end' : ''}`}>
					<div className={`flex flex-col ${message.sender === user.uid ? 'items-end' : ''}`}>
						<div className="capitalize">
							{message.date?.toDate().toLocaleString('en-US', {
							year: 'numeric', month: 'short', day: 'numeric',
							hour: '2-digit', minute: '2-digit',
							hour12: true
							})}
						</div>
						<div className="text-black">{message.message}</div>
					</div>
				</div>
			))}
		</>
	);
}