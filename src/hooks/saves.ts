import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { persist, StorageValue } from "zustand/middleware";
import useFile from "@/hooks/file";

export class Save {
  index: number;
  data: string;
  timestamp: string;

  constructor(index: number, data: string) {
    this.index = index;
    this.data = data;
    this.timestamp = new Intl.DateTimeFormat("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(Date.now());
  }
}

interface Saves {
  saves: Map<string, Save[]>;
  getSaves: () => Save[] | null;
  setSaves: (index: number, save: Save) => void;
}

const useSavesBase = create<Saves>()(
  persist(
    (set, get) => ({
      saves: new Map(),
      getSaves: () => {
        const filePath = useFile.use.filePath();
        let saves = get().saves;
        return saves.get(filePath) || null;
      },
      setSaves: (index, save) => {
        console.log(save);
        const filePath = useFile.getState().filePath;
        const newSavesMap = get().saves.size ? get().saves : new Map();
        let file_saves = newSavesMap.get(filePath) || [null, null, null];
        file_saves[index] = save;
        newSavesMap.set(filePath, file_saves);
        set({ saves: newSavesMap });
      },
    }),
    {
      name: "inkStory", // 存储项的名称（必须是唯一的）
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              saves: new Map(state.saves),
            },
          };
        },
        setItem: (name, newValue: StorageValue<Saves>) => {
          const str = JSON.stringify({
            state: {
              ...newValue.state,
              saves: Array.from(newValue.state.saves.entries()),
            },
          });
          sessionStorage.setItem(name, str);
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);

export default createSelectors(useSavesBase);
