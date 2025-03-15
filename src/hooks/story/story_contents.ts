import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";

type StoryContent = {
	contents: string[];
	last_content: string;
	setContents: (contents: string[]) => void;
	setLastContent: () => void;
	empty: () => void;
	add: (content: string[]) => void;
};

const useStoryContent = create<StoryContent>((set, get) => ({
	contents: [],
	last_content: "",
	setContents: (contents) => set({ contents }),
	setLastContent: () => {
		if (get().contents.length === 0) return;
		const last_content = get().contents[get().contents.length - 1];
		set({ last_content });
	},
	empty: () => {
		set({ contents: [] });
	},
	add: (content) => {
		set((state) => ({
			contents: [...state.contents, ...content],
		}));
	},
}));

export default createSelectors(useStoryContent);
