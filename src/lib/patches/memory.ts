import { InkStory, Patches } from "@/lib/ink";
import { default as useStorage } from "./storage";

let options = {
	memory_format: "session",
};

const show = (title: string) => {
	return useStorage.getState().storage.get(title) || null;
};
const save = (index: number, ink: InkStory) => {
	let save = {
		state: ink.story.state.toJson(),
	};
	ink.save_label.forEach((label) => {
		if (label in ink && typeof ink[label as keyof InkStory] !== "undefined")
			Object.assign(save, {
				[label]: ink[label as keyof InkStory],
			});
	});
	useStorage.getState().setStorage(ink.title, index, save);
};
const load = (save_data: string, ink: InkStory) => {
	const save = JSON.parse(save_data);
	if (save) {
		ink.story.state.LoadJson(save.state);
		ink.clear();
		ink.save_label.forEach((label) => {
			if (
				label in ink &&
				typeof ink[label as keyof InkStory] !== "undefined" &&
				label in save
			)
				// @ts-ignore
				ink[label as keyof InkStory] = save[label];
		});
		ink.continue();
	}
};

export default { save: save, load: load, show: show };

export const load_memory = () => {
	Patches.add(function () {
		useStorage.getState().changeFormat(options.memory_format);
	}, options);
};
