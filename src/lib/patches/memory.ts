import { InkStory, Patches } from "@/lib/ink";
import { useSave } from "@/hooks";
import { useContents } from "@/hooks/story";

var options = {
	memorycard_format: "session",
};

const save = (
	index: number,
	ink: InkStory,
	format = ink.options.memorycard_format
) => {
	var save = {
		state: ink.story.state.toJson(),
		contents: useContents.getState().contents,
	};
	useSave.getState().setFormat(format as string);
	useSave.getState().setSaves(index, save);
};
const load = (save_data: string, ink: InkStory) => {
	const save = JSON.parse(save_data);
	if (save) {
		ink.story.state.LoadJson(save.state);
		ink.clear();
		useContents.getState().setContents(save.contents);
		ink.continue();
	}
};

Patches.add(null, options);

export default { options: options, save: save, load: load };
