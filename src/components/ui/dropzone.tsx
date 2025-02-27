import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface DropzoneProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"value" | "onChange"
	> {
	classNameWrapper?: string;
	className?: string;
	dropMessage: string;
	handleOnDrop: (acceptedFiles: FileList | null) => void;
}

export const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
	(
		{ className, classNameWrapper, dropMessage, handleOnDrop, ...props },
		ref
	) => {
		const inputRef = useRef<HTMLInputElement | null>(null);
		const [images, setImages] = useState<FileList | null>(null);
		// Function to handle drag over event
		const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			handleOnDrop(null);
		};

		// Function to handle drop event
		const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			const { files } = e.dataTransfer;
			if (inputRef.current) {
				inputRef.current.files = files;
				handleOnDrop(files);
				setImages(files);
				console.log(images);
			}
		};

		// Function to simulate a click on the file input element
		const handleButtonClick = () => {
			if (inputRef.current) {
				inputRef.current.click();
			}
		};
		return (
			<Card
				ref={ref}
				className={cn(
					`border-2 border-dashed bg-muted hover:cursor-pointer hover:border-muted-foreground/50`,
					classNameWrapper
				)}
			>
				<CardContent
					className="flex flex-col items-center justify-center space-y-2 px-2 py-4 text-xs"
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onClick={handleButtonClick}
				>
					<div className="flex items-center justify-center text-muted-foreground">
						<span className="font-medium">{dropMessage}</span>
						<Input
							{...props}
							value={undefined}
							ref={inputRef}
							type="file"
							className={cn("hidden", className)}
							onChange={(e: ChangeEvent<HTMLInputElement>) => {
								handleOnDrop(e.target.files);
								setImages(e.target.files);
							}}
						/>
					</div>
				</CardContent>
				<CardContent>
					<div className="flex">
						{Array.from(images ?? []).map((c: File, i) => (
							<BufferToImg file={c} key={`img-${i}`} />
						))}
					</div>
				</CardContent>
			</Card>
		);
	}
);

export const BufferToImg: React.FC<{ file: File }> = ({ file }) => {
	// const [img, setImg] = useState<ArrayBuffer | null>(null);
	// useEffect(() => {
	// 	(async () => {
	// 		const _img = await file.arrayBuffer();
	// 		var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
	// 		var urlCreator = window.URL || window.webkitURL;
	// 		var imageUrl = urlCreator.createObjectURL( blob );
	// 		setImg(imageUrl);
	// 	})();
	// }, []);
	const imgFile = URL.createObjectURL(file);
	// if (!img) return <></>;
	return (
		<img
			src={imgFile}
			className="h-[300px] object-cover aspect-square"
		></img>
	);
};
