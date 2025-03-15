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
		const choices = ink_choices.map((choice) => {
			const new_choice = new Choice(choice.text, choice.index);
			if (choice.tags && choice.tags.length) {
				ChoiceParser.process(choice, new_choice);
			}
			return new_choice;
		});
		set({ choices });
	},
}));

export default createSelectors(useStoryChoices);
