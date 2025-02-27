"use client";

import { db } from "@/firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Posting, UserObject } from "@/models/user";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, Timestamp, deleteDoc } from 'firebase/firestore';
import ConfirmDelete from "@/components/confirm";

export default function Profile({ params }: { params: { id: string } }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [ myUser, setMyUser ] = useState<UserObject | null>(null);
    const [ user, setUser ] = useState<UserObject | null>(null);

    const [listings] = useCollection(collection(db, "listings"));
    const [myListingsCount, setMyListingsCount] = useState(0);

    // Confirmation state for confirmation pop up when deleting listings
    const [confirmationStates, setConfirmationStates] = useState<{[userid: string]: boolean}>({});

    // Helper function to handle deleting document from collection and corresponding functions to
    // delete user or listing
    const deleteDocument = async (collectionName: string, documentId: string) => {
        try {
            const docRef = doc(db, collectionName, documentId);
            await deleteDoc(docRef);
            console.log('Document successfully deleted!');
        } catch (error) {
            console.error('Error deleting document:', error);
        }
    };


    function handleDeleteListing( userid: string) {
        setConfirmationStates(prevState => ({
            ...prevState,
            [userid]: false
        }));
        deleteDocument("listings", userid);
    }


    // Helper functions to change state of confirmation pop up
    function openConfirm(userid: string) {
        setConfirmationStates(prevState => ({
            ...prevState,
            [userid]: true
        }));
    }

    function closeConfirm(userid: string) {
        setConfirmationStates(prevState => ({
            ...prevState,
            [userid]: false
        }));
    }
    
    // Effect listener for when user signs in and out
    useEffect(() => {
        const auth = getAuth();
        const unsubcribe = onAuthStateChanged(auth, (i) => {
            setCurrentUser(i);
        });
        return () => {
            unsubcribe();
        };
    }, []);


    // Collects database infromation when profile auth changes
    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                const myUserRef = doc(db, `users/${currentUser.uid}`);
                const myUserDoc = await getDoc(myUserRef);
                if (myUserDoc.exists()) {
                    setMyUser(myUserDoc.data() as UserObject);
                }
            }
    
            const userRef = doc(db, `users/${params.id}`);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                setUser(userDoc.data() as UserObject);
            }
            console.log(listings);
            // Checks amount of listings
            if (listings) {
                const listingData = listings.docs.map(doc => doc.data() as ListingRaw);
                for (let i = 0; i < listingData.length; i++) {
                    if (listingData[i].poster == params.id) {
                        console.log("hi");
                        setMyListingsCount(i => i + 1);
                    }
                }
            }

        }
    
        fetchData();
    }, [currentUser, params.id, listings]);


    // Helper function for capitalizing name
    function capitalizeName( name: string ) {
        const splitName = name.split(" ");
        if (splitName.length == 1) {
            return splitName[0][0].toUpperCase() + splitName[0].slice(1);
        }
        else {
            return splitName[0][0].toUpperCase() + splitName[0].slice(1) + " " + splitName[1][0].toUpperCase() + splitName[1].slice(1);
        }
    }

    // Helper function for formatting join date
    function getDateJoined( time: Timestamp) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const dateJoined = time.toDate();
        const year = dateJoined.getFullYear();
        const month = dateJoined.getMonth();
        const day = dateJoined.getDate();
        return ` ${monthNames[month]} ${day}, ${year}`;
    }

    return (
        <div >
            {/* This checks if user database is not loaded, it applies the spinner. */}
            {!user ? (
                <div className="flex justify-center flex-1 py-4">
                    <LoadingSpinner></LoadingSpinner>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row lg:space-x-3 p-6 px-48">
                    {/* Loads the corresponding profile name and image */}
                    <Card className="flex flex-col w-full lg:w-1/5 min-h-96 p-6 items-center">
                        <Avatar className="h-40 w-40">
							<AvatarFallback className="text-7xl font-semibold bg-slate-400 text-white">
								{user.name
									.split(" ")
									.map((v) => v[0].toUpperCase())}
							</AvatarFallback>
						</Avatar>
                        <h1 className="pt-4 pr-8 pb-0 pl-8 text-2xl font-semibold">{ capitalizeName(user.name) }</h1>
                        <h2 className="pb-10 text-sm text-slate-400">Joined {getDateJoined(user.dateJoined)}</h2>
 
                        {/* Checks if user is logged in and if user is admin. Shows corresponding buttons */}
                        { !currentUser ? (
                            <h2 className="font-semibold">Log in to Message</h2>
                        ) : ( currentUser.uid == params.id ? (
                            <Link href="" className="h-full w-full invisible"><button disabled className="h-full w-full invisible cursor-default"></button></Link>
                        ) : (
                            <Link href={`../messages/${params.id}`} className="w-full"><button className="bg-slate-400 p-2 text-white w-full rounded-3xl hover:bg-slate-300 hover:text-gray-600 transition-colors duration-150">Message User</button></Link>
                        ))}

                        { myUser && myUser.admin ? (
                            <Link href="../admin" className="h-full w-full pt-4"><button className="bg-indigo-500 p-2 text-white w-full rounded-3xl hover:bg-slate-300 hover:text-gray-600 transition-colors duration-150">Manage Users</button></Link>
                        ) : (
                            <Link href="" className="w-full invisible"><button disabled className="w-full invisible cursor-default"></button></Link>
                        )}   
                    </Card>
                    {/* Shows the profile listings */}
                    <Card className="w-full lg:w-4/5 min-h-96 p-6">
                        {/* If profile being viewed matches the current user, show the correct name for listing title */}
                        { currentUser && currentUser.uid == params.id ? (
                            <h1 className="text-3xl font-semibold pb-8">My Listings</h1>
                        ) : (
                            <h1 className="text-3xl font-semibold pb-8">{capitalizeName(user.name).split(" ")[0]}'s Listings</h1>
                        ) }
                        { !currentUser ? (
                            /* If the user is not signed in, give prompt instead of showing listings */
                            <div className="flex flex-col justify-center items-center w-full">
                                <h2 className="flex text-2xl p-2 font-semibold items-center">Sign in to View Listings</h2>
                            </div>
                        ) : (
                            /* If the listing count is 0, show the corresponding messages */
                            myListingsCount == 0 ? (
                                <div className="flex flex-col justify-center items-center w-full">
                                    { currentUser.uid == params.id ? (
                                        <div className="flex flex-col items-center">
                                            <h2 className="flex text-2xl p-2 font-semibold items-center">You have no listings!</h2>
                                            <Link href="../sell"><button className="bg-slate-400 p-2 px-24 w-full text-white rounded-3xl hover:bg-slate-300 hover:text-gray-600 transition-colors duration-150">Start Listing</button></Link>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <h2 className="flex text-2xl p-2 font-semibold items-center">There are no listings</h2>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Display all the listings that match the user's profile */
                                <div className="flex overflow-x-auto">
                                    <div className="flex flex-no-wrap space-x-4">
                                    {listings?.docs.map((listingObj, i) => {
                                        const listing = listingObj.data();
                                        if (listing.poster == params.id) {
                                            return (
                                                <div>
                                                    <Link
                                                    className="flex gap-2 hover:opacity-80"
                                                    href={`../posting/${listingObj.id}`}
                                                    key={listingObj.id}
                                                    >
                                                    <div className="flex flex-col">
                                                        <img
                                                            className="w-[200px] h-[200px] rounded-xl object-cover"
                                                            src={listing.image}
                                                        />
                                                        <div className="flex flex-col">
                                                            <div className="font-bold text-lg">
                                                                {listing.name}
                                                            </div>
                                                            <div className="capitalize text-sm text-slate-400">
                                                                {
                                                                    listing.date
                                                                        ?.toDate()
                                                                        .toISOString()
                                                                        .split("T")[0]
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </Link>
                                                    {/* If the user is signed in and it's their profile, give option to delete listings */}
                                                    { (currentUser.uid == params.id) && 
                                                        <div>
                                                            <button className=" bg-red-700 w-32 m-3 p-2 text-sm text-white rounded-3xl hover:bg-red-300 hover:text-gray-800 transition-colors duration-150" onClick={() => openConfirm(listingObj.id)}>Delete Listing</button>
                                                            <ConfirmDelete isOpen={confirmationStates[listingObj.id] || false} message={listing.name} onConfirm={() => handleDeleteListing(listingObj.id)} onCancel={() => closeConfirm(listingObj.id)} />
                                                    </div>}
                                                </div>
                                            );
                                        }
                                    })}
                                    </div>
                                </div>
                            )
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
}