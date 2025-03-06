import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";

type File = {
	filePath: string;
	sourcePath: string;
	markdown: string;
	setFilePath: (path: string) => void;
	setSourcePath: (path: string) => void;
	setMarkdown: (content: string) => void;
	getParentPath: () => string;
};

const useFile = create<File>((set, get) => ({
	filePath: "",
	sourcePath: "",
	markdown: "",
	setFilePath: (path) => set({ filePath: path }),
	setSourcePath: (path) => set({ sourcePath: path }),
	setMarkdown: (content) => set({ markdown: content }),
	getParentPath: () => {
		const path = get().filePath;
		return path.split("/").slice(0, -1).join("/");
	},
}));

export default createSelectors(useFile);
