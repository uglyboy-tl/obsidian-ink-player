import { useFile } from "@/hooks";
import { useImage } from "@/hooks/story";
import { Tags } from "@/lib/ink";

const getPath = (path: string) => {
	return useFile.getState().resourcePath + "/" + path;
};

Tags.add("image", (val: string | null) => {
	if (val) {
		useImage.getState().setImage(getPath(val));
	} else {
		useImage.getState().setImage("");
	}
});
