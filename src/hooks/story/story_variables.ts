import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { VariablesState } from "inkjs/engine/VariablesState";

type StoryVariables = {
  variables: Map<string, any>;
  getGlobalVars: (variablesState: VariablesState) => void;
};

const useStoryVariables = create<StoryVariables>((set) => ({
  variables: new Map<string, any>(),
  getGlobalVars: (variablesState) => {
    const globalVars = new Map<string, any>();

    // @ts-expect-error
    const globalVariables = variablesState._globalVariables;
    globalVariables.keys().forEach((key: string) => {
      globalVars.set(key, globalVariables.get(key).value);
    });
    set((state) => ({ variables: globalVars }));
  },
}));

export default createSelectors(useStoryVariables);
