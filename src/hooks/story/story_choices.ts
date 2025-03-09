import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { Choice as inkChoice } from "inkjs/engine/Choice";
import { ChoiceParser, Choice } from "@/lib/ink";

type StoryChoices = {
	choices: Choice[];
	setChoices: (choices: inkChoice[]) => void;
};

const useStoryChoices = create<StoryChoices>((set) => ({
	choices: [],
	setChoices: (ink_choices) => {
		let choices: Choice[] = [];
		ink_choices.forEach((choice) => {
			const new_choice = new Choice(choice.text, choice.index);
			if (choice.tags && choice.tags.length) {
				ChoiceParser.process(choice, new_choice);
			}
			choices.push(new_choice);
		});
		set({ choices });
	},
}));

export default createSelectors(useStoryChoices);
