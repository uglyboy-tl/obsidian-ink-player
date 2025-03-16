import { useEffect } from "react";
import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { Patches, InkStory } from "@/lib/ink";

const options = {
	linedelay: 0.2,
};

type ContentComplete = {
	contentComplete: boolean;
	setContentComplete: (contentComplete: boolean) => void;
};
const useContentComplete = create<ContentComplete>((set) => ({
	contentComplete: true,
	setContentComplete: (contentComplete) => set({ contentComplete }),
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
	const originalChoose = InkStory.prototype.choose;
	this.choose = function (index: number) {
		if (this.options.linedelay != 0) {
			useContentComplete.getState().setContentComplete(false);
		}
		originalChoose.call(this, index);
	};
	Object.defineProperty(this, "choicesCanShow", {
		get() {
			return createSelectors(useContentComplete).use.contentComplete();
		},
	});
	const setDelay = () => setChoicesDelay(this);
	this.effects.push(setDelay);
}, options);
