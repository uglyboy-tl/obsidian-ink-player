import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { Story } from "inkjs";
import { useError, Save, useSave } from "@/hooks";
import { useScene, useChoices, useContents, useVariables } from "@/hooks/story";
import { splitTag } from "@/lib/utils/splitTag";

interface StoryState {
	story: Story | null;
	setStory: (story: any) => void;
	save: (index: number) => void;
	load: (save: string) => void;
	clear: () => void;
	continue: () => void;
	restart: () => void;
	handleChoice: (choice: number) => void;
}

const useStory = create<StoryState>((set, get) => {
	const errorHandler = useError.getState().errorHandler;

	return {
		story: null,
		setStory: (story) => {
			set({ story });
		},
		save: (index: number) => {
			const story = get().story;
			if (!story) {
				errorHandler("No story to load");
				return;
			}
			const newData = {
				save: story.state.toJson(),
				contents: useContents.getState().contents,
			};
			const newSave = new Save(index, JSON.stringify(newData));
			useSave.getState().setSaves(index, newSave);
		},
		load: (save: string) => {
			const story = get().story;
			const saveData = JSON.parse(save);

			if (!story) {
				errorHandler("No story to load");
				return;
			}
			story.state.LoadJson(saveData.save ? saveData.save : "{}");
			get().clear();
			// 其他资源的处理
			useContents.getState().setContents(saveData.contents);
			get().continue();
		},
		clear: () => {
			useScene.getState().setImage("");
			useContents.getState().empty();
		},
		continue: () => {
			const story = get().story;
			if (!story) return;
			const newContent: string[] = [];

			// 处理故事段落
			while (story.canContinue) {
				let current_text = story.Continue() || "";
				if (process_tags(story.currentTags)) {
					newContent.length = 0;
				}
				newContent.push(current_text);
			}
			useContents.getState().add(newContent);

			const { currentChoices, variablesState } = story;
			useChoices.getState().setChoices(currentChoices);
			useVariables.getState().getGlobalVars(variablesState);
		},
		restart: () => {
			const story = get().story;
			story?.ResetState();
			useScene.getState().sound_stop();
			useScene.getState().setBackground("");
			get().clear();
			get().continue();
		},
		handleChoice: (index: number) => {
			const story = get().story;
			story?.ChooseChoiceIndex(index);
			get().continue();
		},
	};
});

export default createSelectors(useStory);

const process_tags = (tags: string[] | null): boolean => {
	let flag = false;
	if (!tags || tags.length == 0) {
		return flag;
	}
	for (let i = 0; i < tags.length; i++) {
		const tag = tags[i];
		const splited_tag = splitTag(tag);

		if (splited_tag) {
			useScene
				.getState()
				.processTag(splited_tag.property, splited_tag.val);
		} else {
			const TAG = tag.toUpperCase();
			if (TAG == "CLEAR") {
				useStory.getState().clear();
				flag = true;
			} else if (TAG == "RESTART") {
				useStory.getState().restart();
				flag = true;
			}
		}
	}
	return flag;
};
