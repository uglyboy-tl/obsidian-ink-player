import { useFile } from "@/hooks";
import { Tags, Patches } from "@/lib/ink";

export class audio {
	private static _sound: HTMLAudioElement | null;
	private static _music: HTMLAudioElement | null;
	private static _sound_handler: () => void;
	private static _music_handler: () => void;

	static get sound() {
		return this._sound;
	}
	static get music() {
		return this._music;
	}

	static get sound_handler() {
		return this._sound_handler;
	}

	static get music_handler() {
		return this._music_handler;
	}

	static set_music(path: string) {
		this._music = new Audio(path);
		this._music_handler = () => {
			this._music?.play();
		};
		this._music.addEventListener("canplaythrough", this._music_handler);
	}

	static set_sound(path: string) {
		this._sound = new Audio(path);
		this._sound_handler = () => {
			this._sound?.play();
		};
		this._sound.addEventListener("canplaythrough", this._sound_handler);
	}
	static cleanupSound() {
		if (this.sound) {
			this.sound.pause();
			this.sound.currentTime = 0;
			this.sound.removeEventListener(
				"canplaythrough",
				this.sound_handler
			);
			this.sound.src = "";
		}
		this._sound = null;
		this._sound_handler = () => null;
	}
	static cleanupMusic() {
		if (this.music) {
			this.music.pause();
			this.music.currentTime = 0;
			this.music.removeEventListener(
				"canplaythrough",
				this.music_handler
			);
			this.music.src = "";
		}
		this._music = null;
		this._music_handler = () => null;
	}
}

Tags.add("sound", (val: string | null) => {
	if (val) {
		audio.set_sound(getPath(val));
	} else {
		audio.cleanupSound();
	}
});

Tags.add("music", (val: string | null) => {
	if (val) {
		audio.set_music(getPath(val));
	} else {
		audio.cleanupMusic();
	}
});

Patches.add(function () {
	this.audio = audio;
	this.cleanups.push(() => {
		audio.cleanupSound();
		audio.cleanupMusic();
	});
}, {});
const getPath = (path: string) => {
	return useFile.getState().resourcePath + "/" + path;
};
