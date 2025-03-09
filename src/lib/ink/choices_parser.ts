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
	private static _tags: { [key: string]: Function };
	private static _components: { [key: string]: FC };

	static get tags() {
		if (!ChoiceParser._tags) ChoiceParser._tags = {};
		return ChoiceParser._tags;
	}

	static get components() {
		if (!ChoiceParser._components) ChoiceParser._components = {};
		return ChoiceParser._components;
	}
	static add = (
		tag: string,
		callback: (choice: Choice, val?: string) => void,
		component?: FC
	) => {
		ChoiceParser.tags[tag] = callback;
		if (component) {
			ChoiceParser.components[tag] = component;
		}
	};

	static process = (item: inkChoice, choice: Choice) => {
		if (!item.text) return choice;

		if (
			item.tags &&
			item.tags.length &&
			Object.keys(ChoiceParser.tags).length
		) {
			// process each
			item.tags.forEach(function (tag) {
				// split up the tag into tag and property
				let splitTag = splitAtCharacter(tag, ":");

				// if the tag exists in our tags,
				if (splitTag && splitTag.before in ChoiceParser.tags) {
					// then we process our line with the tag
					ChoiceParser.tags[splitTag.before](choice, splitTag.after);
				}
			});
		}
	};
}

ChoiceParser.add("unclickable", (new_choice, val) => {
	new_choice.type = "unclickable";
});
