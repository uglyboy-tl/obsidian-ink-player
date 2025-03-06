import { useFile, useError, useStory } from "@/hooks";
export const compiledStory = (path: string, markdown: string) => {
	useFile.getState().setFilePath(path);
	const dir_path = useFile.getState().getParentPath();
	var inkjs = require("inkjs/full");
	var {
		PosixFileHandler,
	} = require("inkjs/compiler/FileHandler/PosixFileHandler");
	const fileHandler = new PosixFileHandler(dir_path);
	const errorHandler = useError.getState().errorHandler;
	const story = new inkjs.Compiler(markdown, {
		fileHandler,
		errorHandler,
	}).Compile();
	useStory.getState().setStory(story);
};
