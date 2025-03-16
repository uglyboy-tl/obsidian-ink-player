import { splitAtCharacter } from "./tags";

export class Parser {
	private static _tags: { [key: string]: Function };
	private static _patterns: {
		matcher: string | RegExp;
		callback: Function;
	}[];
	// a list of tags and their associate functions
	static get tags() {
		if (!Parser._tags) Parser._tags = {};
		return Parser._tags;
	}

	// a list of patterns and their associate functions
	static get patterns() {
		if (!Parser._patterns) Parser._patterns = [];
		return Parser._patterns;
	}

	static tag(tag: string, callback: Function) {
		Parser.tags[tag] = callback;
	}

	// binds a function to be executed if our line contains the given pattern
	// that pattern can either be some text, or a regular expression
	static pattern(pattern: string | RegExp, callback: Function) {
		Parser.patterns.push({ matcher: pattern, callback: callback });
	}

	// process a string or an element, applying tags and patterns, before
	// returning the updated result
	static process = (text: string, tags: string[] = []): string => {
		// cancel if we didn't submit anything
		if (!text) return "";

		// create an object to store our line in
		let line = { text: text, tags: tags, classes: [] };

		// if we submitted tags, and tags exist to style with,
		if (line.tags.length && Parser.tags.size) {
			// process each
			line.tags.forEach(function (tag) {
				// split up the tag into tag and property
				let splitTag = splitAtCharacter(tag, ":");

				// if the tag exists in our tags,
				if (splitTag && splitTag.before in Parser.tags) {
					// then we process our line with the tag
					Parser.tags[splitTag.before](
						line,
						splitTag.before,
						splitTag.after
					);
				}
			});
		}

		// if the element has text inside, and there are patterns to match with,
		if (line.text && Parser.patterns.length) {
			// go through them all,
			Parser.patterns.forEach(function (pattern) {
				// and... okay this is a long line, but we're checking if we
				// should execute the pattern's function by checking if it
				// actually matches first with the line
				if (
					(typeof pattern.matcher === "string" &&
						line.text.includes(pattern.matcher)) ||
					(pattern.matcher == RegExp(pattern.matcher) &&
						line.text.match(pattern.matcher))
				) {
					// if so, we update the element
					pattern.callback(line);
				}
			});
		}
		// and return the results
		return line.text;
	};
}
