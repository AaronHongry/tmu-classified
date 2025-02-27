"use client";

import { useRouter } from 'next/navigation';
import { FeaturedGallery } from "@/components/homepage/featuredGallery";
import { SearchSection } from "@/components/navbar/search";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
export default function TmuOnly() {
	const router = useRouter();

	// Checks for when user logs out or logs back in into correct account
	const [currentUser, setCurrentUser] = useState<User | null>(null);


	useEffect(() => {
        const auth = getAuth();
        const unsubcribe = onAuthStateChanged(auth, (i) => {
            setCurrentUser(i);
        });
        return () => {
            unsubcribe();
        };
    }, []);

	// When user successfully logs in with TMU account, reroute to main page
	useEffect(() => {
        if (currentUser) {
            router.back(); // Go back one page
        }
    }, [currentUser, router]);

	return (
		<div className="flex flex-col min-h-screen containered">
			<Card>
				<CardHeader>
					<CardTitle>TMU Only!</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<CardDescription>
						Sorry! This website is only for TMU students and staff
						only!
					</CardDescription>
				</CardContent>
			</Card>
		</div>
	);
}
