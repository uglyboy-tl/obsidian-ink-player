import { useScene, useFile } from "@/hooks";
import { Tags } from "@/lib/ink";

Tags.add("sound", (val: string | null) => {
	if (val) {
		useScene.getState().setSound(getPath(val));
	} else {
		useScene.getState().cleanupSound();
	}
});

Tags.add("music", (val: string | null) => {
	if (val) {
		useScene.getState().setMusic(getPath(val));
	} else {
		useScene.getState().cleanupMusic();
	}
});

Tags.add("image", (val: string | null) => {
	if (val) {
		useScene.getState().setImage(getPath(val));
	} else {
		useScene.getState().setImage("");
	}
});

Tags.add("background", (val: string | null) => {
	if (val) {
		useScene.getState().setBackground(getPath(val));
	} else {
		useScene.getState().setBackground("");
	}
});

Tags.add("linkopen", (val: string | null) => {
	if (val) {
		window.open(val);
	}
});

const getPath = (path: string) => {
	return useFile.getState().resourcePath + "/" + path;
};
