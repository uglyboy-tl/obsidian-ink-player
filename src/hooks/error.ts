import { Notice } from "obsidian";
import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import type { ErrorHandler } from "inkjs/engine/Error";

type Error = {
	error: string | null;
	errorHandler: (message: string) => void;
};

const useError = create<Error>((set) => ({
	error: null,
	errorHandler: (message) => {
		console.error(message);
		new Notice(message);
		set({ error: message });
	},
}));

export default createSelectors(useError);
