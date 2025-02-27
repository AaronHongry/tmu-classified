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
import { useFieldArray } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { LoadingSpinner } from "@/components/ui/spinner";
import { Skeleton } from "@nextui-org/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Posting, UserObject } from "@/models/user";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, Timestamp } from 'firebase/firestore';
import firebase from 'firebase/app';

interface confirmProps {
    isOpen: boolean,
    message: string,
    onConfirm: () => void,
    onCancel: () => void;
}

const ConfirmDelete: React.FC<confirmProps> = ({ isOpen, message, onConfirm, onCancel }) => {
    return (
        <div>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <p className="mb-4">Are you sure you want to delete <b className="capitalize">{message}</b>?</p>
                    <div className="flex justify-center">
                    <button onClick={onConfirm} className="mr-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">
                        Yes
                    </button>
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none">
                        No
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
}


export default ConfirmDelete;