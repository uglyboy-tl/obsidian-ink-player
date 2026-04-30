import { createSelectors } from "@inkweave/core";
import { Notice } from "obsidian";
import { create } from "zustand";

type ErrorState = {
  error: string | null;
  errorHandler: (message: string) => void;
};

const useError = create<ErrorState>((set) => ({
  error: null,
  errorHandler: (message) => {
    console.error(message);
    new Notice(message);
    set({ error: message });
  },
}));

export default createSelectors(useError);
