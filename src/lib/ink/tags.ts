import { InkStory } from "./main";

export type TagFunction = (val: string, ink: InkStory) => void;

export class Tags {
	private static _functions: Map<string, Function> = new Map();
	private static readonly excludeKeys: Set<string> = new Set([
		"clear",
		"restart",
	]);

	static get functions() {
		if (!Tags._functions) Tags._functions = new Map();
		return Tags._functions;
	}

	static clear() {
		for (const [key, _] of this._functions.entries()) {
			if (!this.excludeKeys.has(key)) {
				this._functions.delete(key);
			}
		}
	}

	// function executed once the story detects that tag
	static add(tagName: string, callback: TagFunction) {
		Tags.functions.set(tagName, callback);
	}
	static process = (ink: InkStory, inputString: string) => {
		let splitTag = splitAtCharacter(inputString, ":");
		if (splitTag) {
			if (Tags.functions.has(splitTag.before)) {
				Tags.functions.get(splitTag.before)?.(splitTag.after, ink);
			} else if (ink.options[splitTag.before] != undefined) {
				let newValue: any = splitTag.after;
				// make sure we convert it
				switch (typeof ink.options[splitTag.before]) {
					case "string":
						break;
					case "number":
						if (typeof newValue === "string") {
							newValue = parseFloat(newValue);
						} else {
							newValue = undefined;
						}
						break;
					case "boolean":
						newValue = !!newValue;
						break;
					default:
						newValue = undefined;
				}
				if (newValue !== undefined && !Number.isNaN(newValue)) {
					ink.options[splitTag.before] = newValue;
				}
			}
		}
	};
}

export const splitAtCharacter = (text: string, character: string) => {
	// if we don't have any text, return nothing?
	if (!text) {
		return;
	}

	// find first occurence of character
	let splitIndex = text.indexOf(character);

	// if the text doesn't contain that character,
	if (splitIndex == -1) {
		// return it
		return {
			before: text.trim().toLowerCase(),
		};
	}
	// otherwise,
	else {
		// return it, and the value after
		return {
			before: text.slice(0, splitIndex).trim().toLowerCase(),
			after: text.slice(splitIndex + 1).trim(),
		};
	}
};

Tags.add("clear", (_: string, ink: InkStory) => {
	ink.clear();
});

Tags.add("restart", (_: string, ink: InkStory) => {
	ink.restart();
});
