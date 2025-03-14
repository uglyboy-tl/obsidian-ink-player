import { Story } from "inkjs/engine/Story";
import { useScene, useContents, useChoices, useVariables } from "@/hooks/story";
import { Patches, Tags, Parser, ExternalFunctions } from "@/lib/ink";

const options = {
	linedelay: 0.2,
	debug: false,
};

export class InkStory {
	story: Story;
	options: { [key: string]: any };
	_cleanups: Function[] = [];
	constructor(story: Story) {
		this.options = options;
		this.story = story;
		const content = this.story.ToJson() || "";
		Patches.apply(this, content);
		this.bindExternalFunctions(content);
	}
	get cleanups() {
		return this._cleanups;
	}
	continue() {
		const newContent: string[] = [];

		// 处理故事段落
		while (this.story.canContinue) {
			let current_text = this.story.Continue() || "";
			if (this.story.currentTags) {
				this.story.currentTags.forEach((tag) => {
					Tags.process(this, tag);
					if (tag === "clear" || tag === "restart") {
						newContent.length = 0;
					}
				});
				if (current_text && this.story.currentTags.length) {
					current_text = Parser.process(
						current_text,
						this.story.currentTags
					);
				}
			}

			newContent.push(current_text);
		}
		useContents.getState().add(newContent);

		const { currentChoices, variablesState } = this.story;
		useChoices.getState().setChoices(currentChoices);
		useVariables.getState().setGlobalVars(variablesState);
	}
	choose(index: number) {
		useContents.getState().setLastContent();
		this.story.ChooseChoiceIndex(index);
		this.continue();
	}
	clear() {
		useScene.getState().setImage("");
		useContents.getState().empty();
	}
	restart() {
		this.story.ResetState();
		this.clear();
		this.continue();
	}
	dispose() {
		this.cleanups.map((cleanup) => {
			if (cleanup) {
				cleanup();
			}
		});
	}
	bindExternalFunctions = (content: string) => {
		new Set(
			Array.from(content.matchAll(/\"x\(\)\":\"(\w+)/gi), (m) => m["1"])
		).forEach((match) => {
			ExternalFunctions.bind(this, match);
		});
	};
}
