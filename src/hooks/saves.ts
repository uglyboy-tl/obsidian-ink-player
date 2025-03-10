import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";
import { persist, StorageValue } from "zustand/middleware";
import useFile from "@/hooks/file";

const StorageType: { [key: string]: Storage } = {
	local: localStorage,
	session: sessionStorage,
};

let defaultStorage = StorageType["session"];

class Save {
	data: string;
	timestamp: string;

	constructor(data: object) {
		this.data = JSON.stringify(data);
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
	setSaves: (index: number, data: object) => void;
	setFormat: (format: string) => void;
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
			setSaves: (index, data) => {
				const filePath = useFile.getState().filePath;
				const newSavesMap = get().saves.size ? get().saves : new Map();
				let file_saves = newSavesMap.get(filePath) || [
					null,
					null,
					null,
				];
				file_saves[index] = new Save(data);
				newSavesMap.set(filePath, file_saves);
				set({ saves: newSavesMap });
			},
			setFormat: (format) => {
				defaultStorage = StorageType[format];
			},
		}),
		{
			name: "inkStory", // 存储项的名称（必须是唯一的）
			storage: {
				getItem: (name) => {
					const str = defaultStorage.getItem(name);
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
					defaultStorage.setItem(name, str);
				},
				removeItem: (name) => defaultStorage.removeItem(name),
			},
		}
	)
);

export default createSelectors(useSavesBase);
