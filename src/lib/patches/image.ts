import { useScene, useFile } from "@/hooks";
import { Tags } from "@/lib/ink";

const getPath = (path: string) => {
	return useFile.getState().resourcePath + "/" + path;
};

Tags.add("image", (val: string | null) => {
	if (val) {
		useScene.getState().setImage(getPath(val));
	} else {
		useScene.getState().setImage("");
	}
});
