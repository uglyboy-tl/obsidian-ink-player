import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { Choice as inkChoice } from "inkjs/engine/Choice";
import { splitTag } from "@/lib/utils/splitTag";

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
        let splited_tag = splitTag(choiceTag);

        if (choiceTag.toUpperCase() == "UNCLICKABLE") {
          isClickable = false;
          break;
        }
        if (splited_tag && splited_tag.property == "CD") {
          cd = parseInt(splited_tag.val);
          if (cd > 0) {
            isCDButton = true;
          } else {
            cd = 0;
          }
          break;
        }
        if (splited_tag && splited_tag.property == "AUTO") {
          cd = parseInt(splited_tag.val);
          if (cd > 0) {
            isAutoButton = true;
          } else {
            cd = 0;
          }
          break;
        }
      }
      choices.push(
        new Choice(
          isCDButton ? "cd" : isAutoButton? "auto" : isClickable ? "choice" : "unclickable",
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
