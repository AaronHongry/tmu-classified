// <div className="containered flex flex-col gap-4">
// 	<Card className="">
// 		<CardHeader>
// 			<CardTitle>Create a new listing</CardTitle>
// 			<CardDescription>
// 				Listings will be posted immediately
// 			</CardDescription>
// 		</CardHeader>
// 		<CardContent>
// 			<form onSubmit={handleSubmit(onSubmit)}>
// 				<div className="grid w-full items-center gap-4">
// 					<div className="flex flex-col space-y-1.5">
// 						<Label htmlFor="name">Name</Label>
// 						<Input
// 							{...register("name")}
// 							ref={null}
// 							id="name"
// 							placeholder="Name of your project"
// 						/>
// 					</div>
// 					<div className="flex flex-col space-y-1.5">
// 						<Label htmlFor="description">Description</Label>
// 						<Textarea
// 							{...register("description")}
// 							ref={null}
// 							id="description"
// 							placeholder="Relatively new, minor damage on the back"
// 						/>
// 					</div>
// 					<div className="flex flex-col space-y-1.5">
// 						<Label htmlFor="images">Images</Label>
// 						{/* <Dropzone
//                         dropMessage="Drop files or click here"
//                         handleOnDrop={() => {}}
//                     /> */}
// 					</div>

// 					<div className="flex flex-col space-y-1.5">
// 						<Label htmlFor="category">Category</Label>
// 						<Select
// 							defaultValue="textbooks"
// 							// {...register("category")}
// 						>
// 							<SelectTrigger id="category">
// 								<SelectValue placeholder="Category" />
// 							</SelectTrigger>
// 							<SelectContent>
// 								{CATEGORIES.slice(1).map((c, i) => (
// 									<SelectItem key={i} value={c.value}>
// 										<div className="flex gap-2 items-center">
// 											{
// 												<c.icon
// 													className="opacity-60"
// 													size={20}
// 												/>
// 											}
// 											{c.name}
// 										</div>
// 									</SelectItem>
// 								))}
// 							</SelectContent>
// 						</Select>
// 					</div>

// 					<div className="flex flex-col space-y-1.5">
// 						<Button type="submit">Post Listing</Button>
// 					</div>
// 				</div>
// 			</form>
// 		</CardContent>
// 	</Card>
// </div>;
