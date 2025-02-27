"use client";
import { LINKS } from "@/data/LINKS";
import { Button, buttonVariants } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
	getAdditionalUserInfo,
} from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "@/firebase/config";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { addDoc, doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export const NavbarAuth: React.FC<{}> = () => {
	const googleProvider = new GoogleAuthProvider();
	//
	const [user, loading] = useAuthState(auth);
	// addDoc(collection(db,'messages'), {
	// 	user1: user.uid,
	// 	// user2: uid2
	// 	sender: user.uid,
	// 	message: "Hello"
	//   })

	// const [messages] = useCollection(
	// 	query(collection(db,'messages'), where("user1", "==", user.uid), where('user2', '==', other person id))
	// )
	const router = useRouter();

	const authenticate = async () => {
		const result = await signInWithPopup(auth, googleProvider);
		const additionalInfo = getAdditionalUserInfo(result);
		const address = result.user.email?.split("@")[1];
		if (address != "torontomu.ca") {
			await signOut(auth);
			router.push("/tmu-only");
			return;
		}
		if (additionalInfo?.isNewUser) {
			setDoc(doc(db, "users", result.user.uid), {
				name: result.user.email?.split("@")[0].split(".").join(" "),
				dateJoined: new Date(),
				userid: result.user.uid
			});
		}
		// additionalInfo.
	};
	if (loading) return <></>;
	if (!user)
		return (
			<div className="">
				<button onClick={authenticate}>Login or Register</button>
				<Avatar>
					<AvatarImage alt="@shadcn" />
				</Avatar>
			</div>
		);
	return (
		<div className="flex flex-col items-end">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<div className="flex items-center gap-2 pr-0 ">
						<div className="text-lg">{user.displayName}</div>
						<Avatar>
							<AvatarFallback className="bg-slate-400 text-white">
								{(user.displayName ?? " ")
									.split(" ")
									.map((v) => v[0].toUpperCase())}
							</AvatarFallback>
						</Avatar>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<Link href={`../profile/${user.uid}`}><DropdownMenuItem>Profile</DropdownMenuItem></Link>
					<DropdownMenuItem onClick={() => signOut(auth)}>
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<div className="flex gap-4">
				{LINKS.map((link) => (
					<Link
						key={link.name}
						href={link.href}
						className={`${buttonVariants({
							variant: "link",
						})} "text-sm opacity-80"`}
					>
						{link.name}
					</Link>
				))}
			</div>
		</div>
	);
};
