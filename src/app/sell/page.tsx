"use client";

import { FeaturedGallery } from "@/components/homepage/featuredGallery";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Dropzone } from "@/components/ui/dropzone";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES } from "@/data/CATEGORIES";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { auth, db, storage } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";

const MAX_FILE_SIZE = 500000;
const ACCEPTED_IMAGE_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
];
const formSchema = z.object({
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	description: z.string().min(10, {
		message: "Description must be at least 10 characters.",
	}),
	category: z.string(),
	images: z
		.any()
		.refine((files) => files?.length == 1, "Image is required.")
		.refine(
			(files) => files?.[0]?.size <= MAX_FILE_SIZE,
			`Max file size is 5MB.`
		)
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			".jpg, .jpeg, .png and .webp files are accepted."
		),
});

export default function Sell() {
	const [loading, setLoading] = useState(false);
	const [user] = useAuthState(auth);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			category: "textbooks",
			images: [],
		},
	});

	const router = useRouter();
	const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (
		data
	) => {
		if (!user) return;
		setLoading(true);
		try {
			const images = Array.from(data.images ?? []);
			const image = images.length >= 1 ? (images[0] as File) : "";
			if (image == "") return;
			const storageRef = ref(
				storage,
				`${user.uid}/${new Date().getTime()}.${
					image.type.split("/")[1]
				}`
			);

			const bytes = await image.arrayBuffer();
			const imageUpload = await uploadBytes(storageRef, bytes);
			const imageURL = await getDownloadURL(
				ref(storage, imageUpload.ref.fullPath)
			);
			const url = await addDoc(collection(db, "listings"), {
				poster: user.uid,
				posterName: user.displayName,
				name: data.name,
				image: imageURL,
				description: data.description,
				category: data.category,
				date: new Date(),
			});

			router.push(`posting/${url.id}`);
			setLoading(false);
		} catch (err) {}
	};
	// const form = useForm();
	if (!user) return <></>;
	return (
		<div className="flex min-h-screen justify-center items-start py-6">
			<Card className="container px-0">
				<CardHeader>
					<CardTitle>Create a new listing</CardTitle>
					<CardDescription>
						Listings will be posted immediately
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Intro to Astronomy Textbook"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												id="description"
												placeholder="Relatively new, minor damage on the back"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Category</FormLabel>
										<FormControl>
											<Select
												defaultValue={"textbooks"}
												onValueChange={field.onChange}
											>
												<SelectTrigger id="category">
													<SelectValue placeholder="Category" />
												</SelectTrigger>
												<SelectContent>
													{CATEGORIES.slice(1).map(
														(c) => (
															<SelectItem
																key={c.value}
																value={c.value}
															>
																<div className="flex gap-2 items-center">
																	{
																		<c.icon
																			className="opacity-60"
																			size={
																				20
																			}
																		/>
																	}
																	{c.name}
																</div>
															</SelectItem>
														)
													)}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="images"
								render={({ field }) => (
									<FormItem className="space-y-1">
										<FormLabel>Add Images</FormLabel>
										<FormControl>
											<Dropzone
												handleOnDrop={field.onChange}
												dropMessage="Drop images or click here"
											/>
										</FormControl>
										{/* <div>{field.value}</div> */}
										<FormMessage />
									</FormItem>
								)}
							/>

							{loading ? (
								<LoadingSpinner />
							) : (
								<Button type="submit">Submit</Button>
							)}
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
