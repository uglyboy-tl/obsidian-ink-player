import { useFile } from "@/hooks";
import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { Tags, Patches } from "@/lib/ink";

declare module "@/lib/ink" {
	interface InkStory {
		image: string;
		useImage: string;
	}
}

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

Tags.add("image", (val: string | null) => {
	if (val) {
		useStoryImage.getState().setImage(getPath(val));
	} else {
		useStoryImage.getState().setImage("");
	}
});

Patches.add(function () {
	Object.defineProperty(this, "image", {
		get() {
			return useStoryImage.getState().image;
		},

		set(path: string) {
			useStoryImage.getState().setImage(path);
		},
	});
	Object.defineProperty(this, "useImage", {
		get() {
			return createSelectors(useStoryImage).use.image();
		},
	});
	this.save_label.push("image");
	this.clears.push(() => {
		this.image = "";
	});
}, {});
