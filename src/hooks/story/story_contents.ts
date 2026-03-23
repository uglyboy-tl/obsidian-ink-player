import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";

export const CHOICE_SEPARATOR = "\x00ink-divider\x00";

type StoryContent = {
	contents: string[];
	setContents: (contents: string[]) => void;
	add: (content: string[]) => void;
};

const useStoryContent = create<StoryContent>((set, get) => ({
	contents: [],
	setContents: (contents) => set({ contents }),
	add: (content) => {
		set((state) => ({
			contents: [...state.contents, ...content],
		}));
	},
}));

export default createSelectors(useStoryContent);
