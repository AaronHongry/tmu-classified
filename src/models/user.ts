import { getFirestore, Timestamp } from 'firebase/firestore';

export interface UserObject {
	name: string;
	dateJoined: Timestamp;
	userid: string;
	admin: boolean;
}

export interface Posting {
	name: string;
	description: string;
	image: string;
	poster: string;
	posterName: string;
	category: string;
}
