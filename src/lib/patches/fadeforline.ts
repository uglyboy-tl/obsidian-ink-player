import { useEffect } from "react";
import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { Patches, InkStory } from "@/lib/ink";

declare module "@/lib/ink" {
	interface InkStory {
		choicesCanShow: boolean;
	}
}

const options = {
	linedelay: 0.2,
};

type ContentComplete = {
	contentComplete: boolean;
	last_content: string;
	setContentComplete: (contentComplete: boolean) => void;
	setLastContent: (contents: string[]) => void;
};
const useContentComplete = create<ContentComplete>((set) => ({
	contentComplete: true,
	last_content: "",
	setContentComplete: (contentComplete) => set({ contentComplete }),
	setLastContent: (contents) => {
		if (contents.length === 0) return;
		const last_content = contents[contents.length - 1];
		set({ last_content });
	},
}));
const setChoicesDelay = (ink: InkStory) => {
	useEffect(() => {
		if (ink.options.linedelay == 0) return;
		const timer = setTimeout(() => {
			useContentComplete.getState().setContentComplete(true);
		}, (ink.contents.length - ink.visibleLines) * ink.options.linedelay * 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [ink.contents]);
};

Patches.add(function () {
	const originalChoose = this.choose;
	this.choose = function (index: number) {
		if (this.options.linedelay != 0) {
			useContentComplete.getState().setContentComplete(false);
			useContentComplete.getState().setLastContent(this.contents);
		}
		return originalChoose.call(this, index);
	};
	Object.defineProperty(this, "visibleLines", {
		get() {
			const last_content = useContentComplete.getState().last_content;
			return this.contents.lastIndexOf(last_content);
		},
	});
	Object.defineProperty(this, "choicesCanShow", {
		get() {
			return createSelectors(useContentComplete).use.contentComplete();
		},
	});
	const setDelay = () => setChoicesDelay(this);
	this.effects.push(setDelay);
}, options);
