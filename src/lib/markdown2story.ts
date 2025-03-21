import { useFile, useError, useStory } from "@/hooks";
import * as inkjs from "inkjs/full";
import { ErrorHandler } from "inkjs/engine/Error";
import { ObsidianFileHandler } from "@/lib/utils/ObsidianFileHandler";

export const compiledStory = () => {
	const fileHandler = new ObsidianFileHandler(
		useFile.getState().resourcePath
	);
	const errorHandler: ErrorHandler = (message, errorType) => {
		useError.getState().errorHandler(`${errorType}: ${message}`);
	};
	const filePath = useFile.getState().filePath;
	const markdown = useFile.getState().markdown;

	const story = new inkjs.Compiler(markdown, {
		fileHandler,
		errorHandler,
	}).Compile();
	useStory.getState().setStory(story, filePath);
};
