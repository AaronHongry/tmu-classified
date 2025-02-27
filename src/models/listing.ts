interface ListingRaw {
	name: string;
	description: string;
	location: string;
	poster: string; // UID
	date: number; //
}

interface User {
    uid: any;
}

interface Listing {
	name: string;
	lister: User;
}
