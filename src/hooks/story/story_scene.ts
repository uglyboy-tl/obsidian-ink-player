import { create } from "zustand";

type StoryScene = {
	image: string;
	setImage: (image: string) => void;
};

const useStoryScene = create<StoryScene>((set) => ({
	image: "",
	setImage: (image) => set({ image }),
}));

export default useStoryScene;
