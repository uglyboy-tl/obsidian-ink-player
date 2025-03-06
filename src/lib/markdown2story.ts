import { useFile, useError, useStory } from "@/hooks";
import { Compiler, PosixFileHandler } from "inkjs/types";
import type { ErrorHandler } from "inkjs/engine/Error";
export const compiledStory = (path: string, markdown: string) => {
	useFile.getState().setFilePath(path);
	const dir_path = useFile.getState().getParentPath();
	const fileHandler = new PosixFileHandler(dir_path);
	const errorHandler: ErrorHandler = (message, errorType) => {
		useError.getState().errorHandler(`${errorType}: ${message}`);
	};
	const story = new Compiler(markdown, {
		fileHandler,
		errorHandler,
	}).Compile();
	useStory.getState().setStory(story);
};
