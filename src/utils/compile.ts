import {
  BaseFileHandler,
  createInkStory,
  type InkStory,
  type InkStoryOptions,
} from "@inkweave/core";
import useError from "./error";
import useFile from "./file";

class ObsidianFileHandler extends BaseFileHandler {
  override loadFile(filename: string): string {
    return useFile.getState().getResource(filename);
  }
}

export const compile = (): InkStory | null => {
  const basePath = useFile.getState().resourcePath;
  const fileHandler = new ObsidianFileHandler({ basePath });
  const errorHandler = (message: string, errorType: any) => {
    useError.getState().errorHandler(`${errorType}: ${message}`);
  };
  const filePath = useFile.getState().filePath;
  const markdown = useFile.getState().markdown;

  if (!markdown) {
    return null;
  }

  try {
    const content = markdown.replace(/^---\n[\s\S]*?\n---\n?/, "");
    const ink: InkStory = createInkStory(content, {
      title: filePath,
      fileHandler,
      errorHandler,
    } as InkStoryOptions);
    return ink;
  } catch (e) {
    const filePath = useFile.getState().filePath;
    useError
      .getState()
      .errorHandler(`Error compiling ${filePath}: ${e instanceof Error ? e.message : String(e)}`);
    return null;
  }
};
