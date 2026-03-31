import { BaseFileHandler, createInkStory, type InkStory } from "@inkweave/core";
import useError from "./error";
import useFile from "./file";

class ObsidianFileHandler extends BaseFileHandler {
  loadFile(filename: string): string {
    return useFile.getState().getResource(filename);
  }
}

export const compiledStory = (): InkStory | null => {
  const basePath = useFile.getState().resourcePath;
  const fileHandler = new ObsidianFileHandler({ basePath });
  const errorHandler = (message: string, errorType: string) => {
    (useError.getState() as any).errorHandler(`${errorType}: ${message}`);
  };
  const filePath = useFile.getState().filePath;
  const markdown = useFile.getState().markdown;

  if (!markdown) {
    return null;
  }

  try {
    const ink: InkStory = createInkStory(markdown, {
      title: filePath,
      fileHandler,
      errorHandler,
    } as any);
    return ink;
  } catch (e) {
    (useError.getState() as any).errorHandler(
      `Error: ${e instanceof Error ? e.message : String(e)}`,
    );
    return null;
  }
};
