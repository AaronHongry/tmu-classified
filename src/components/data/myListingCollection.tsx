"use client";
import { auth, db } from "@/firebase/config";
import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
export default function MyListings() {
    const [user] = useAuthState(auth);
    const [listings] = useCollectionData(
        user &&
            query(collection(db, "listings"), where("poster", "==", user.uid))
    );
    return (
        <>
            {listings?.map((listing) => (
                <div className="flex gap-2">
                    <img
                        className="w-[200px] h-[200px] rounded-xl object-cover"
                        src={listing.image}
                    />
                    <div className="flex flex-col">
                        <div className="font-bold text-lg">{listing.name}</div>
                        <div className="capitalize">{listing.posterName}</div>
                        <div className="capitalize">
                            {listing.date?.toDate().toISOString().split("T")[0]}
                        </div>
                        <div className="opacity-80 pt-4">
                            {listing.description}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

