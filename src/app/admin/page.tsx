"use client";

import { FeaturedGallery } from "@/components/homepage/featuredGallery";
import { db, storage } from "@/firebase/config";
import { doc, getDoc, DocumentReference } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSearchParams } from "next/navigation";
import {
	useDocument,
	useDocumentDataOnce,
} from "react-firebase-hooks/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { set, useFieldArray } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Skeleton } from "@nextui-org/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Posting, UserObject } from "@/models/user";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, Timestamp, deleteDoc } from 'firebase/firestore';
import firebase from 'firebase/app';
import ConfirmDelete from "@/components/confirm";

export default function AdminDashboard() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [ myUser, setMyUser ] = useState<UserObject | null>(null);

    const [allUsers] = useCollection(collection(db, "users"));
    const [listings] = useCollection(collection(db, "listings"));

    const [confirmationStates, setConfirmationStates] = useState<{[userid: string]: boolean}>({});
    
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
    }, [currentUser]);

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

    function handleDeleteUser( userid: string) {
        setConfirmationStates(prevState => ({
            ...prevState,
            [userid]: false
        }));
        deleteDocument("users", userid);
    };

    function handleDeleteListing( userid: string) {
        setConfirmationStates(prevState => ({
            ...prevState,
            [userid]: false
        }));
        deleteDocument("listings", userid);
    };


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
    return (
        <div >
            {(currentUser && myUser && myUser.admin) ? (
                <Card className="flex flex-col w-full min-h-96 p-6 px-60 gap-3">
                    <h1 className="pt-4 pr-8 pb-0 pl-8 text-3xl font-bold">Admin Dashboard</h1>
                    <h2 className="pt-4 pr-8 pb-0 pl-8 text-xl font-bold">Users</h2>
                    {/* This is to show all the users currently available */}
                    <Card className="flex flex-col w-full min-h-64 p-6">
                        <div className="flex overflow-x-auto">
                            <div className="flex flex-no-wrap space-x-11">
                                {allUsers?.docs.map((userObj, i) => {
                                    const user = userObj.data();
                                    return (
                                        <div className="flex flex-col items-center" key={userObj.id}>
                                            <Link
                                                className="flex pb-1 gap-3 hover:opacity-80"
                                                href={`../profile/${userObj.id}`}
                                            >
                                                <div className="flex flex-col justify-center items-center min-w-48">
                                                    <Avatar className="w-36 h-36">
                                                        <AvatarFallback className="text-5xl font-semibold bg-slate-400 text-white">
                                                            {user.name
                                                                .split(" ")
                                                                .map((v: string) => v[0].toUpperCase())}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="pt-6 flex flex-col">
                                                        <div className="capitalize font-bold text-lg">
                                                            {user.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                            {currentUser.uid != userObj.id && (
                                                <button className=" bg-red-700 w-32 m-3 p-2 text-sm text-white rounded-3xl hover:bg-red-300 hover:text-gray-800 transition-colors duration-150" onClick={() => openConfirm(userObj.id)}>Delete User</button>
                                            )}
                                            <ConfirmDelete isOpen={confirmationStates[userObj.id] || false} message={user.name} onConfirm={() => handleDeleteUser(userObj.id)} onCancel={() => closeConfirm(userObj.id)} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                    {/* Show all listings available */}
                    <h2 className="pt-4 pr-8 pb-0 pl-8 text-xl font-bold">Listings</h2>
                    <Card className="flex flex-col w-full min-h-80 p-6 items-center">
                        <div className="flex overflow-x-auto w-full">
                                        <div className="flex flex-no-wrap space-x-11">
                                        {listings?.docs.map((listingObj, i) => {
                                            const listing = listingObj.data();
                                            return (
                                                <div className="flex flex-col items-center" key={listingObj.id}>
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
                                                                <div className="capitalize">
                                                                    {listing.posterName}
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
                                                    <button className=" bg-red-700 w-32 m-3 p-2 text-sm text-white rounded-3xl hover:bg-red-300 hover:text-gray-800 transition-colors duration-150" onClick={() => openConfirm(listingObj.id)}>Delete Listing</button>
                                                    <ConfirmDelete isOpen={confirmationStates[listingObj.id] || false} message={listing.name} onConfirm={() => handleDeleteListing(listingObj.id)} onCancel={() => closeConfirm(listingObj.id)} />
                                                </div>
                                                
                                            );
                                        })}
                                        </div>
                                    </div>
                    </Card>
                </Card>
                /* Show error messsages if users are not allowed on the page! */
            ) : ((currentUser && myUser && !myUser.admin) ? (
                <Card className="flex flex-col w-full min-h-96 p-6 items-center">
                    <h1 className="text-3xl font-semibold pt-6 pb-2">Only administrators have access to this page!</h1>
                </Card>
            ) : (
                <Card className="flex flex-col w-full min-h-96 p-6 items-center">
                    <h1 className= "text-3xl font-semibold pt-6 pb-2">Only administrators have access to this page!</h1>
                    <h2 className="text-slate-400">If you are an administrator, please sign in.</h2>
                </Card>
            ))}
        </div>
    );
}