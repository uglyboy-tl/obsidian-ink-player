import { useEffect, useRef } from "react";
import { Patches, Choice } from "@/lib/ink";
const scrollAfterChoice = (choices: Choice[]) => {
	const lastButtonRef = useRef<HTMLElement | null>(null);
	useEffect(() => {
		lastButtonRef.current = document.querySelector(
			"ul#ink-choices > li:last-child"
		) as HTMLElement;

		if (lastButtonRef.current) {
			const element = document.querySelector("#ink-story") as HTMLElement;
			element.scrollTo({
				top: lastButtonRef.current.offsetTop,
				behavior: "smooth",
			});
		}
	}, [choices]);
};
const load = () => {
	Patches.add(function () {
		const scroll = () => scrollAfterChoice(this.choices);
		this.effects.push(scroll);
	}, {});
};

export default load;
