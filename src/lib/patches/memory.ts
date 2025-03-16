import { InkStory, Patches } from "@/lib/ink";
import { useSave } from "@/hooks";

let options = {
	memorycard_format: "session",
};

const save = (index: number, ink: InkStory) => {
	let save = {
		state: ink.story.state.toJson(),
		contents: ink.contents,
		image: ink.image,
	};
	useSave.getState().setSaves(index, save);
};
const load = (save_data: string, ink: InkStory) => {
	const save = JSON.parse(save_data);
	if (save) {
		ink.story.state.LoadJson(save.state);
		ink.clear();
		ink.contents = save.contents;
		ink.image = save.image;
		ink.continue();
	}
};

Patches.add(function () {
	useSave.getState().setFormat(options.memorycard_format);
}, options);

export default { options: options, save: save, load: load };
