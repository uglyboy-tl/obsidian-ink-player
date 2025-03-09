export class Tags {
	private static _functions: { [key: string]: Function };

	static get functions() {
		if (!Tags._functions) Tags._functions = {};
		return Tags._functions;
	}

	// function executed once the story detects that tag
	static add(tagName: string, callback: Function) {
		Tags.functions[tagName] = callback;
	}
	static process = (
		inputString: string,
		contents: string[],
		options: { [key: string]: string | number | boolean | undefined } = {}
	) => {
		var splitTag = splitAtCharacter(inputString, ":");
		if (splitTag) {
			if (Tags.functions[splitTag.before]) {
				Tags.functions[splitTag.before](splitTag.after, contents);
			} else if (options[splitTag.before]) {
				let newValue: any = splitTag.after;
				// make sure we convert it
				switch (typeof options[splitTag.before]) {
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
					options[splitTag.before] = newValue;
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
	var splitIndex = text.indexOf(character);

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
