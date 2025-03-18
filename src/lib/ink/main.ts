import { Story } from "inkjs/engine/Story";
import { useContents, useChoices, useVariables } from "@/hooks/story";
import { Patches, Tags, Parser, ExternalFunctions } from "@/lib/ink";

const options = {
	debug: false,
};

export type CleanupFunction = () => void;
export type SideEffectFunction = () => void;
export type ClearFunction = () => void;

export class InkStory {
	title: string;
	story: Story;
	options: { [key: string]: any };
	_side_effects: SideEffectFunction[] = [];
	_cleanups: CleanupFunction[] = [];
	_clears: ClearFunction[] = [];
	_save_label: string[] = ["contents"];

	constructor(story: Story, title: string) {
		this.options = options;
		this.story = story;
		this.title = title;
		const content = this.story.ToJson() || "";
		bindFunctions(this);
		Patches.apply(this, content);
		this.bindExternalFunctions(content);
		this.clears.push(() => {
			this.contents.length = 0;
		});
	}

	get contents() {
		return useContents.getState().contents;
	}

	set contents(newContent: string[]) {
		useContents.getState().setContents(newContent);
	}

	get choices() {
		return useChoices.getState().choices;
	}

	get clears() {
		return this._clears;
	}

	get cleanups() {
		return this._cleanups;
	}

	get effects() {
		return this._side_effects;
	}

	get save_label() {
		return this._save_label;
	}

	continue() {
		const newContent: string[] = [];

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

			if (current_text.trim()) newContent.push(current_text);
		}
		useContents.getState().add(newContent);

		const { currentChoices, variablesState } = this.story;
		useChoices.getState().setChoices(currentChoices);
		useVariables.getState().setGlobalVars(variablesState);
	}

	choose(index: number) {
		this.story.ChooseChoiceIndex(index);
		this.continue();
	}

	clear() {
		this.clears.map((clear) => {
			clear();
		});
	}

	restart() {
		this.story.ResetState();
		this.clear();
		this.continue();
	}

	useEffect() {
		this.effects.map((effect) => {
			if (effect) {
				effect();
			}
		});
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

function bindFunctions(target: any) {
	var prototype = Object.getPrototypeOf(target);

	Object.getOwnPropertyNames(prototype).forEach(function (property) {
		if (
			property != "constructor" &&
			typeof Object.getOwnPropertyDescriptor(prototype, property)
				?.value == "function"
		) {
			(target as any)[property] = (target as any)[property].bind(target);
		}
	});
}
