import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { InkStory } from "@/lib/ink";

interface StoryState {
	ink: InkStory | null;
	setStory: (story: any) => void;
}

const useStory = create<StoryState>((set, get) => {
	return {
		ink: null,
		setStory: (story) => {
			get().ink?.dispose();
			set({ ink: new InkStory(story) });
		},
	};
});

export default createSelectors(useStory);
