import { InkStory } from "./main";

export class Patches {
	private static _patches: Function[];
	private static _options: {
		[key: string]: any;
	} = {};
	static get patches() {
		if (!Patches._patches) Patches._patches = [];
		return Patches._patches;
	}

	static set patches(value) {
		Patches._patches = value;
	}

	static add(
		callback: Function | null,
		patchOptions: { [key: string]: any } = {}
	) {
		Object.assign(this._options, patchOptions);
		if (callback) Patches.patches.push(callback);
	}

	static apply(story: InkStory, content: string) {
		story.options = Object.assign(story.options, Patches._options);
		for (let patch of Patches.patches) {
			if (patch) {
				patch.bind(story, content)();
			}
		}
	}
}
