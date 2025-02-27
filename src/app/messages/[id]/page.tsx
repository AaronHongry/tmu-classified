"use client";

import { FeaturedGallery } from "@/components/homepage/featuredGallery";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Dropzone } from "@/components/ui/dropzone";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/data/CATEGORIES";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useState } from "react";
import { addDoc, setDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db, storage } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument, useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { doc, DocumentReference } from "firebase/firestore";
import { Posting, UserObject } from "@/models/user";
import MyMessages from "@/components/data/myMessagesCollection";


const formSchema = z.object({
	message: z.string().min(1, {
		message: "Message must be at least 1 character.",
	}),
});


export default function Message({ params }: { params: { id: string } }) {

	const [loading, setLoading] = useState(false);
	const [user] = useAuthState(auth);
	const [receiver] = useDocumentDataOnce<UserObject>(
        doc(db, `users/${params.id}`) as DocumentReference<UserObject>
    );
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			message: "",
		},
	});

	const router = useRouter();
	const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
		data
	) => {
		if (!receiver || !user) return;
		setLoading(true);
		try {
			const url = await addDoc(collection(db, "messages"), {
                sender: user.uid,
                senderName: user.displayName,
                receiver: params.id,
                receiverName: receiver.name,
                message: data.message,
                date: new Date(),
			});
			const url2 = await setDoc(doc(db, "chats", user.uid + '_' + params.id), {
				sender: user.uid,
				senderName: user.displayName,
				receiver: params.id,
				receiverName: receiver.name,
				participants: [user.uid, params.id],
				date: new Date(),
			});
			const url3 = await setDoc(doc(db, "chats", params.id + '_' + user.uid), {
				sender: params.id,
				senderName: receiver.name,
				receiver: user.uid,
				receiverName: user.displayName,
				participants: [params.id, user.uid],
				date: new Date(),
			});
			setLoading(false);
		} catch (err) {}
	};

	if (!receiver) return <></>;
	return (
		<div className="flex min-h-screen justify-center items-start py-6">
			<Card className="container px-0">
				<CardHeader>
					<CardTitle>Send a message to {receiver.name}</CardTitle>
				</CardHeader>
				<CardContent>
					<CardDescription><MyMessages params={{ id: params.id }} /></CardDescription>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												placeholder="Type a message here"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{loading ? (
								<LoadingSpinner />
							) : (
								<Button type="submit">Send</Button>
							)}
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
