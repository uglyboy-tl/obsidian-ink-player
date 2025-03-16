import { useFile } from "@/hooks";
import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { InkStory, Tags, Patches } from "@/lib/ink";

type StoryImage = {
	image: string;
	setImage: (image: string) => void;
};

const useStoryImage = create<StoryImage>((set) => ({
	image: "",
	setImage: (image) => set({ image }),
}));

const getPath = (path: string) => {
	return useFile.getState().resourcePath + "/" + path;
};

Tags.add("image", (val: string | null, ink: InkStory) => {
	if (val) {
		ink.image = getPath(val);
	} else {
		ink.image = "";
	}
});

Patches.add(function () {
	Object.defineProperty(this, "image", {
		get() {
			return createSelectors(useStoryImage).use.image();
		},

		set(path: string) {
			useStoryImage.getState().setImage(path);
		},
	});
}, {});
