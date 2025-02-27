"use client";
import { auth, db } from "@/firebase/config";
import { collection, query, where } from "firebase/firestore";
import {
    useCollection,
    useCollectionData,
} from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "../ui/button";
import Link from "next/link";
export default function AllListings() {
    const [listings] = useCollection(collection(db, "listings"));


    return (
        <>
            {listings?.docs.map((listingObj, i) => {
                const listing = listingObj.data();
                return (
                    <Link
                        className="flex gap-2 hover:opacity-80"
                        href={`posting/${listingObj.id}`}
                        key={listingObj.id}
                    >
                        <img
                            className="w-[200px] h-[200px] rounded-xl object-cover"
                            src={listing.image}
                        />
                        <div className="flex flex-col">
                            <div className="font-bold text-lg">
                                {listing.name}
                            </div>
                            <div className="capitalize">
                                {listing.posterName}
                            </div>
                            <div className="capitalize">
                                {
                                    listing.date
                                        ?.toDate()
                                        .toISOString()
                                        .split("T")[0]
                                }
                            </div>
                            <div className="opacity-80 pt-4">
                                {listing.description}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </>
    );
}
