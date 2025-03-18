import { PluginSettings } from "settings";
import {
	Patches,
	Tags,
	ChoiceParser,
	ExternalFunctions,
	Parser,
} from "@/lib/ink";
import {
	load_audio,
	load_image,
	load_fadeforline,
	load_scrollafterchoice,
	load_linkopen,
	load_memory,
	load_cdButton,
	load_autoButton,
	load_autosave,
} from "@/lib/patches";

const PLUGIN_LOADER: Record<keyof PluginSettings, () => void> = {
	audio: load_audio,
	image: load_image,
	linkopen: load_linkopen,
	memory: load_memory,
	scrollafterchoice: load_scrollafterchoice,
	fadeforline: load_fadeforline,
	cd_button: load_cdButton,
	auto_button: load_autoButton,
	auto_save: load_autosave,
};

export const updatePlugins = (settings: PluginSettings) => {
	// 1. 清理插件
	Patches.patches = [];
	Tags.clear();
	ChoiceParser.clear();
	Parser.clear();
	ExternalFunctions.functions = new Map();

	// 2. 加载新启用的插件
	(Object.entries(settings) as [keyof PluginSettings, boolean][])
		.filter(([_, enabled]) => enabled)
		.map(([key, enabled]) => {
			if (PLUGIN_LOADER[key]) {
				PLUGIN_LOADER[key]();
			}
		});
};
