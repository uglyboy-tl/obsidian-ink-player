import { IFileHandler } from "inkjs/compiler/IFileHandler";
import { useFile } from "@/hooks";

export class ObsidianFileHandler implements IFileHandler {
	constructor(public readonly rootPath: string = "") {}

	readonly ResolveInkFilename = (filename: string): string => {
		if (this.rootPath) {
			return this.rootPath + "/" + filename;
		}
		return filename;
	};

	readonly LoadInkFileContents = (filename: string): string => {
		return useFile.getState().getResource(filename);
	};
}
