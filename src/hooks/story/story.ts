import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { InkStory } from "@/lib/ink";

interface StoryState {
	ink: InkStory | null;
	setStory: (story: any, title: string) => void;
}

const useStory = create<StoryState>((set, get) => {
	return {
		ink: null,
		setStory: (story, title) => {
			get().ink?.dispose();
			set({ ink: new InkStory(story, title) });
		},
	};
});

export default createSelectors(useStory);
