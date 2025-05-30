import { FC } from "react";
import { Choice as inkChoice } from "inkjs/engine/Choice";
import { splitAtCharacter } from "./tags";

export interface ChoiceProps {
	val: string;
	onClick: () => void;
	className?: string;
	children?: React.ReactNode;
}

export class Choice {
	text: string;
	index: number;
	type: string;
	val?: string;
	constructor(text: string, index: number, type: string = "default") {
		this.text = text || "";
		this.index = index;
		this.type = type;
	}
}

export class ChoiceParser {
	private static _tags: Map<string, Function> = new Map();
	private static _components: Map<string, FC> = new Map();
	private static readonly excludeKeys: Set<string> = new Set(["unclickable"]);
	static get tags() {
		return ChoiceParser._tags;
	}

	static get components() {
		return ChoiceParser._components;
	}

	static clear = () => {
		ChoiceParser._components.clear();
		for (const [key, _] of this._tags.entries()) {
			if (!this.excludeKeys.has(key)) {
				this._tags.delete(key);
			}
		}
	};

	static add = (
		tag: string,
		callback: (choice: Choice, val?: string) => void,
		component?: FC
	) => {
		ChoiceParser.tags.set(tag, callback);
		if (component) {
			ChoiceParser.components.set(tag, component);
		}
	};

	static process = (item: inkChoice, choice: Choice) => {
		if (!item.text) return choice;

		if (item.tags && item.tags.length && ChoiceParser.tags.size) {
			item.tags.forEach(function (tag) {
				let splitTag = splitAtCharacter(tag, ":");

				if (splitTag && ChoiceParser.tags.has(splitTag.before)) {
					ChoiceParser.tags.get(splitTag.before)?.(
						choice,
						splitTag.after
					);
				}
			});
		}
	};
}

ChoiceParser.add("unclickable", (new_choice, val) => {
	new_choice.type = "unclickable";
});
