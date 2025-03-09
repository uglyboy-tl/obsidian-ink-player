import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { Choice as inkChoice } from "inkjs/engine/Choice";
import { splitAtCharacter } from "@/lib/ink";

export class Choice {
	type: string;
	text: string;
	index: number;
	cd: number;
	constructor(
		type: string,
		text: string | null,
		index: number,
		cd: number = 0
	) {
		this.type = type;
		this.text = text || "";
		this.index = index;
		this.cd = cd;
	}
}

type StoryChoices = {
	choices: Choice[];
	setChoices: (choices: inkChoice[]) => void;
};

const useStoryChoices = create<StoryChoices>((set) => ({
	choices: [],
	setChoices: (ink_choices) => {
		let choices: Choice[] = [];
		ink_choices.forEach((choice) => {
			let choiceTags = choice?.tags || [];
			let isClickable = true;
			let isCDButton = false;
			let isAutoButton = false;
			let cd = 0;
			for (var i = 0; i < choiceTags.length; i++) {
				let choiceTag = choiceTags[i];
				let splited_tag = splitAtCharacter(choiceTag, ":");

				if (splited_tag) {
					if (splited_tag.before == "unclickable") {
						isClickable = false;
						break;
					}
					if (splited_tag.before == "cd") {
						cd = parseInt(splited_tag.after || "");
						if (cd > 0) {
							isCDButton = true;
						} else {
							cd = 0;
						}
						break;
					}
					if (splited_tag.before == "auto") {
						cd = parseInt(splited_tag.after || "");
						if (cd > 0) {
							isAutoButton = true;
						} else {
							cd = 0;
						}
						break;
					}
				}
			}
			choices.push(
				new Choice(
					isCDButton
						? "cd"
						: isAutoButton
						? "auto"
						: isClickable
						? "choice"
						: "unclickable",
					choice.text,
					choice.index,
					cd
				)
			);
		});
		set({ choices });
	},
}));

export default createSelectors(useStoryChoices);
