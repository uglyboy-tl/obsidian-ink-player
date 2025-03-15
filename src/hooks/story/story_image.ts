import { create } from "zustand";

type StoryImage = {
	image: string;
	setImage: (image: string) => void;
};

const useStoryImage = create<StoryImage>((set) => ({
	image: "",
	setImage: (image) => set({ image }),
}));

export default useStoryImage;
