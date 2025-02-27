import { Alert } from "@/game/gameAtoms";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { PrimitiveAtom, useAtom } from "jotai";
import { useEffect, useState } from "react";

const variants = {
	visible: { opacity: 1, scale: 1 },
	hidden: { opacity: 0, scale: 0 },
};

// MESSAGE
export const Message: React.FC<{
	messageAtom: PrimitiveAtom<Alert>;
}> = ({ messageAtom }) => {
	const [message] = useAtom(messageAtom);
	const [isOpen, setIsOpen] = useState(false);

	// UPDATES MESSAGE BASED ON ATOM
	useEffect(() => {
		if (message.time == 0) return;
		setIsOpen(true);

		// animate();

		const int = setTimeout(() => {
			setIsOpen(false);
		}, 1000);
		return () => {
			clearInterval(int);
		};
	}, [message]);

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					variants={variants}
					initial="hidden"
					animate="visible"
					// animate={controls}
					exit="hidden"
				>
					<div
						className={`rounded font-bold py-3 px-4 uppercase text-white ${message.color}`}
					>
						{message.message}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
