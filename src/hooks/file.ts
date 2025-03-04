import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";

type File = {
	filePath: string;
	markdown: string;
	setFilePath: (path: string) => void;
	setMarkdown: (content: string) => void;
};

const useFile = create<File>((set, get) => ({
	filePath: "init.md",
	markdown: "",
	setFilePath: (path) => set({ filePath: path }),
	setMarkdown: (content) => set({ markdown: content }),
}));

export default createSelectors(useFile);
