import { create } from "zustand";
import { VariablesState } from "inkjs/engine/VariablesState";

type StoryVariables = {
	variables: Map<string, any>;
	setGlobalVars: (variablesState: VariablesState) => void;
};

const useStoryVariables = create<StoryVariables>((set) => ({
	variables: new Map<string, any>(),
	setGlobalVars: (variablesState) => {
		const globalVars = new Map<string, any>();

		// @ts-expect-error
		const globalVariables = variablesState._globalVariables;
		for (const key of globalVariables.keys()) {
			globalVars.set(key, globalVariables.get(key).value);
		}
		set((state) => ({ variables: globalVars }));
	},
}));

export default useStoryVariables;
