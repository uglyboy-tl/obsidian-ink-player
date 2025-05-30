import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";

const StorageType: { [key: string]: Storage } = {
	local: localStorage,
	session: sessionStorage,
};

let type = "session";
const getStorage = () => {
	return StorageType[type];
};

class Save {
	data: string;
	timestamp: string;
	meta: string;

	constructor(data: object) {
		this.data = JSON.stringify(data);
		this.timestamp = new Intl.DateTimeFormat("zh-CN", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(Date.now());
		this.meta = "autogenerated";
	}
}

interface StorageInterface {
	storage: Map<string, Save[]>;
	setStorage: (title: string, index: number, data: object) => void;
	changeFormat: (format: string) => void;
}

const useStorage = create<StorageInterface>()(
	persist(
		(set, get) => ({
			storage: new Map(),
			setStorage: (title, index, data) => {
				const newSavesMap = get().storage.size
					? get().storage
					: new Map();
				let file_saves = newSavesMap.get(title) || [];
				file_saves[index] = new Save(data);
				newSavesMap.set(title, file_saves);
				set({ storage: newSavesMap });
			},
			changeFormat: (format) => {
				type = format;
			},
		}),
		{
			name: "inkStory",
			storage: {
				getItem: (name) => {
					const str = getStorage().getItem(name);
					if (!str) return null;
					const { state } = JSON.parse(str);
					return {
						state: {
							...state,
							storage: new Map(state.storage),
						},
					};
				},
				setItem: (name, newValue: StorageValue<StorageInterface>) => {
					const str = JSON.stringify({
						state: {
							...newValue.state,
							storage: Array.from(
								newValue.state.storage.entries()
							),
						},
					});
					getStorage().setItem(name, str);
				},
				removeItem: (name) => {
					getStorage().removeItem(name);
				},
			},
		}
	)
);

export default useStorage;
