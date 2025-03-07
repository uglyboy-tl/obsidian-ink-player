import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { useFile } from "@/hooks";

type StoryScene = {
	stats: string[];
	background: string;
	image: string;
	sound: HTMLAudioElement | null;
	music: HTMLAudioElement | null;
	sound_handler: (() => void) | null;
	music_handler: (() => void) | null;
	setStats: (stats: string[]) => void;
	setBackground: (background: string) => void;
	setImage: (image: string) => void;
	setSound: (path: string) => void;
	cleanupSound: () => void;
	setMusic: (path: string) => void;
	cleanupMusic: () => void;
	sound_stop: () => void;
	processTag: (tag: string, val: string) => void;
};

const getPath = (path: string) => {
	return useFile.getState().resourcePath + "/" + path;
};

const useStoryScene = create<StoryScene>((set, get) => ({
	stats: [],
	background: "",
	image: "",
	sound: null,
	music: null,
	sound_handler: null,
	music_handler: null,
	setStats: (stats) => set({ stats }),
	setBackground: (background) => set({ background }),
	setImage: (image) => set({ image }),
	setSound: (path: string) => {
		const _sound = new Audio(getPath(path));
		const handler = () => {
			_sound.play();
		};
		_sound?.addEventListener("canplaythrough", handler);
		set({ sound: _sound, sound_handler: handler });
	},
	cleanupSound: () => {
		const { sound, sound_handler } = get();
		if (sound && sound_handler) {
			sound.pause();
			sound.currentTime = 0;
			sound.removeEventListener("canplaythrough", sound_handler);
			sound.src = "";
		}
		set({ sound: null, sound_handler: () => null });
	},
	setMusic: (path: string) => {
		const { music, cleanupMusic } = get();
		if (music) {
			cleanupMusic();
		}
		const _music = new Audio(getPath(path));
		const handler = () => {
			_music.loop = true;
			_music.play();
		};
		_music?.addEventListener("canplaythrough", handler);
		set({ music: _music || null, music_handler: handler });
	},
	cleanupMusic: () => {
		const { music, music_handler } = get();
		if (music && music_handler) {
			music.pause();
			music.currentTime = 0;
			music.removeEventListener("canplaythrough", music_handler);
			music.src = "";
		}
		set({ music: null, music_handler: () => null });
	},
	sound_stop: () => {
		const { music, sound } = get();
		if (sound) {
			sound.pause();
		}
		if (music) {
			music.pause();
		}
	},

	processTag: (tag, val = "") => {
		if (tag == "AUDIO") {
			if (val) {
				get().setSound(getPath(val));
			} else {
				get().setSound("");
			}
		}
		// AUDIOLOOP: src
		else if (tag == "AUDIOLOOP") {
			if (val) {
				get().setMusic(val);
			} else {
				get().setMusic("");
			}
		}
		// LINKOPEN: url
		else if (tag == "LINKOPEN") {
			window.open(val);
		}
		// IMAGE: src
		else if (tag == "IMAGE") {
			if (val) {
				get().setImage(getPath(val));
			} else {
				get().setImage("");
			}
		}
		// BACKGROUND: src
		else if (tag == "BACKGROUND") {
			if (val) {
				get().setBackground(getPath(val));
			} else {
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
