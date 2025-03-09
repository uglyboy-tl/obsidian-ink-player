import { create } from "zustand";

type StoryScene = {
	background: string;
	image: string;
	sound: HTMLAudioElement | null;
	music: HTMLAudioElement | null;
	sound_handler: (() => void) | null;
	music_handler: (() => void) | null;
	setBackground: (background: string) => void;
	setImage: (image: string) => void;
	setSound: (path: string) => void;
	cleanupSound: () => void;
	setMusic: (path: string) => void;
	cleanupMusic: () => void;
	sound_stop: () => void;
};

const useStoryScene = create<StoryScene>((set, get) => ({
	background: "",
	image: "",
	sound: null,
	music: null,
	sound_handler: null,
	music_handler: null,
	setBackground: (background) => set({ background }),
	setImage: (image) => set({ image }),
	setSound: (path: string) => {
		const _sound = new Audio(path);
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
		const _music = new Audio(path);
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
}));

export default useStoryScene;
