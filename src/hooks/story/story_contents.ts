import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";

type StoryContent = {
  contents: string[];
  setContents: (contents: string[]) => void;
  empty: () => void;
  add: (content: string[]) => void;
};

const useStoryContent = create<StoryContent>((set) => ({
  contents: [],
  setContents: (contents) => set({ contents }),
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
