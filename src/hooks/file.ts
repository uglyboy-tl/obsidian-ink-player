import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";

const xhr = new XMLHttpRequest();

type File = {
	filePath: string;
	markdown: string;
	resourcePath: string;
	init: (filePath: string, markdown: string, resourcePath: string) => void;
	getResource: (path: string) => string;
};

const useFile = create<File>((set) => ({
	filePath: "",
	markdown: "",
	resourcePath: "",
	init: (filePath, markdown, resourcePath) =>
		set({ filePath, markdown, resourcePath }),
	getResource: (path) => {
		xhr.open("GET", path, false);
		xhr.send();

		if (xhr.status === 200) {
			return xhr.responseText;
		}

		throw new Error(`Failed to load file: ${path}`);
	},
}));

export default createSelectors(useFile);
