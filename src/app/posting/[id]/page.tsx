"use client";
import Link from "next/link";
import { FeaturedGallery } from "@/components/homepage/featuredGallery";
import { db, storage } from "@/firebase/config";
import { doc, DocumentReference, getDoc } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import {
	useDocument,
	useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useFieldArray } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Skeleton } from "@nextui-org/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Posting, UserObject } from "@/models/user";

export default function Page({ params }: { params: { id: string } }) {
	const [posting] = useDocumentDataOnce<Posting>(
		doc(db, `listings/${params.id}`) as DocumentReference<Posting>
	);

	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [ myUser, setMyUser ] = useState<UserObject | null>(null);

	// Effect to listen for when authentication state changes
    useEffect(() => {
        const auth = getAuth();
        const unsubcribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => {
            unsubcribe();
        };
    }, []);

    // Collects database infromation when admin page loads
    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                const myUserRef = doc(db, `users/${currentUser.uid}`);
                const myUserDoc = await getDoc(myUserRef);
                if (myUserDoc.exists()) {
                    setMyUser(myUserDoc.data() as UserObject);
                }
            }
        }
        fetchData();
    }, [currentUser, params.id, myUser]);


	return (
		<div className="min-h-screen containered">
			{!posting ? (
				<div className="flex justify-center flex-1 py-4">
					<LoadingSpinner></LoadingSpinner>
				</div>
			) : (
				<Card>
					<CardHeader>
						<div className="flex flex-row items-center">
							<CardTitle className="text-6xl font-bold">
								{posting.name}
							</CardTitle>
							{ myUser && myUser.admin ? (
                            	<Link href="../admin" className="h-full w-40 ml-4"><button className="bg-indigo-500 p-2 text-white w-full rounded-3xl hover:bg-slate-300 hover:text-gray-600 transition-colors duration-150">Manage Listings</button></Link>
                        	) : (
                            	<Link href="" className="w-40 invisible"><button disabled className="w-full invisible cursor-default"></button></Link>
                        	)}
						</div>
						
						<Link href={`../profile/${posting.poster}`}>
							<CardDescription className="flex gap-2 items-center ">
								<Avatar>
									<AvatarFallback className="bg-slate-400 text-white">
										{posting.posterName
											.split(" ")
											.map((v) => v[0].toUpperCase())}
									</AvatarFallback>
								</Avatar>
								<div className="capitalize">
									{posting.posterName}
								</div>
							</CardDescription>
						</Link>
						
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<img
							className="aspect-square max-h-[450px] object-cover"
							src={posting.image}
						></img>
						<CardDescription>{posting.description}</CardDescription>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
