import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { useFile } from "@/hooks";

type StoryScene = {
	stats: string[];
	background: string;
	image: string;
	sound: HTMLAudioElement | null;
	music: HTMLAudioElement | null;
	setStats: (stats: string[]) => void;
	setBackground: (background: string) => void;
	setImage: (image: string) => void;
	setSound: (path: string) => void;
	setMusic: (path: string) => void;
	sound_stop: () => void;
	processTag: (tag: string, val: string) => void;
};

const getPath = (path: string) => {
	const dir_path = useFile.getState().sourcePath
	return dir_path + "/" + path;
};

const useStoryScene = create<StoryScene>((set, get) => ({
	stats: [],
	background: "",
	image: "",
	sound: null,
	music: null,
	setStats: (stats) => set({ stats }),
	setBackground: (background) => set({ background }),
	setImage: (image) => set({ image }),
	setSound: (path: string) => {
		get().sound?.pause();
		set({ sound: new Audio(getPath(path)) || null });
		let audio = get().sound;
		audio?.addEventListener("canplaythrough", () => {
			audio.play();
		});
	},
	setMusic: (path: string) => {
		get().music?.pause();
		set({ music: new Audio(getPath(path)) || null });
		let music = get().music;
		music?.addEventListener("canplaythrough", () => {
			music.loop = true;
			music.play();
		});
	},
	sound_stop: () => {
		// TODO: 现在有问题，声音停不了
		get().sound?.pause();
		get().music?.pause();
	},
	processTag: (tag, val = "") => {
		if (tag == "AUDIO") {
			if (val) {
				get().setSound(getPath(val));
			}
			else {
				get().setSound("");
			}

		}
		// AUDIOLOOP: src
		else if (tag == "AUDIOLOOP") {
			if (val) {
			get().setMusic(val);
		}
		else {
			get().setMusic("");
		}
		}
		// LINKOPEN: url
		else if (tag == "LINKOPEN") {
			window.open(val);
		}
		// IMAGE: src
		else if (tag == "IMAGE") {
			if (val ) {
				get().setImage(getPath(val));
			}
			else {
				get().setImage("");
			}

		}
		// BACKGROUND: src
		else if (tag == "BACKGROUND") {
			if (val ) {
				get().setBackground(getPath(val));
			}
			else {
				get().setBackground("");
			}
		}
		// STATS: stat1,stat2,stat3
		else if (tag == "STATS") {
			get().setStats(val.split(",").map((stat) => stat.trim()));
		}
	},
}));

export default createSelectors(useStoryScene);
