import { create } from "zustand";

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
  init: (filePath, markdown, resourcePath) => set({ filePath, markdown, resourcePath }),
  getResource: (path) => {
    const xhr = new XMLHttpRequest();
    try {
      xhr.open("GET", path, false);
      xhr.send();
    } catch (e) {
      throw new Error(
        `Failed to load file: ${path} - ${e instanceof Error ? e.message : String(e)}`,
      );
    }

    if (xhr.status === 200) {
      return xhr.responseText;
    }

    throw new Error(`Failed to load file: ${path} (status ${xhr.status})`);
  },
}));

export default useFile;
