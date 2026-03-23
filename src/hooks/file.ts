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
		// NOTE: 使用同步 XHR 是为了在初始化时立即获取资源
		// 如果这导致性能问题，考虑重构为异步加载
		try {
			xhr.open("GET", path, false);
			xhr.send();
		} catch (e) {
			throw new Error(`Failed to load file: ${path} - ${e instanceof Error ? e.message : String(e)}`);
		}

		if (xhr.status === 200) {
			return xhr.responseText;
		}

		throw new Error(`Failed to load file: ${path} (status ${xhr.status})`);
	},
}));

export default createSelectors(useFile);
