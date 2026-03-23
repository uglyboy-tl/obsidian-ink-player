import { useFile, useError, useStory } from "@/hooks";
import * as inkjs from "inkjs/full";
import { ErrorHandler } from "inkjs/engine/Error";
import { ObsidianFileHandler } from "@/lib/utils/ObsidianFileHandler";

export const SESSION_RESTORE_FLAG = "ink-player-restore-session";

export const compiledStory = () => {
	const fileHandler = new ObsidianFileHandler(
		useFile.getState().resourcePath
	);
	const errorHandler: ErrorHandler = (message, errorType) => {
		useError.getState().errorHandler(`${errorType}: ${message}`);
	};
	const filePath = useFile.getState().filePath;
	const markdown = useFile.getState().markdown;

	if (!markdown) {
		useError.getState().errorHandler("Error: No ink content found");
		return;
	}

	try {
		const story = new inkjs.Compiler(markdown, {
			fileHandler,
			errorHandler,
		}).Compile();
		if (!story) {
			useError.getState().errorHandler("Error: Compilation returned no story");
			return;
		}
		if (localStorage.getItem(`ink-session-${filePath}`)) {
			localStorage.setItem(SESSION_RESTORE_FLAG, "true");
		}
		useStory.getState().setStory(story, filePath);
	} catch (e) {
		useError.getState().errorHandler(`Error: ${e instanceof Error ? e.message : String(e)}`);
	}
};
