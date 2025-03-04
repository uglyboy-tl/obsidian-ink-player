import { Notice } from 'obsidian';
import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";

type Error = {
  error: string | null;
  setError: (error: string | null) => void;
  errorHandler:(message: any, type: any) => void;
};

const useError = create<Error>((set) => ({
  error: null,
  setError: (error) => {
    set({ error });
  },
  errorHandler: (message, type) => {
    console.error(message, type);
    new Notice(`${type}: ${message}` );
    set({ error: `${type}: ${message}` });
  },
}));

export default createSelectors(useError);
