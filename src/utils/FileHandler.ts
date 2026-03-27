import useFile from "./file";
import { BaseFileHandler } from '@inkweave/core';

export class ObsidianFileHandler extends BaseFileHandler {
	loadFile(filename: string): string {
		return useFile.getState().getResource(filename);
	}
}