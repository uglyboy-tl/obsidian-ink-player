import { InkStory } from "./main";
export class ExternalFunctions {
	private static _functions: { [key: string]: Function };
	static get functions() {
		if (!ExternalFunctions._functions) ExternalFunctions._functions = {};
		return ExternalFunctions._functions;
	}

	static set functions(value) {
		ExternalFunctions._functions = value;
	}

	static add(id: string, func: Function) {
		ExternalFunctions.functions[id] = func;
	}

	static get(id: string) {
		return ExternalFunctions.functions[id];
	}

	static bind(ink: InkStory, id: string) {
		var externalFunction = ExternalFunctions.get(id) || (window as any)[id];
		if (externalFunction) {
			ink.story.BindExternalFunction(
				id,
				externalFunction.bind(ink)
			);
		}
	}

	static clear() {
		ExternalFunctions.functions = {};
	}
}
