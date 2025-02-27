"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; 
import { FeaturedGallery } from "@/components/homepage/featuredGallery";
import { SearchSection } from "@/components/navbar/search";
import AllListings from "@/components/data/allListingCollection";

export default function Home() {
    const router = useRouter();

    const onSearch = (query: any) => {
        // Navigate to the search results page with the query as a URL parameter
        router.push(`/search/${encodeURIComponent(query)}`);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <SearchSection onSearch={onSearch} />
            <div className="containered flex flex-col gap-4 p-8">
                <AllListings />
            </div>
        </div>
    );
}