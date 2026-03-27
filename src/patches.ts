import { PluginSettings } from "settings";
import {
	Patches,
	Tags,
	ChoiceParser,
	ExternalFunctions,
	Parser,
} from "@inkweave/core";
import {
	loadAudio,
	loadImage,
	loadFadeEffect,
	loadScrollafterchoice,
	loadLinkopen,
	loadMemory,
	loadCdButton,
	loadAutoButton,
	loadAutosave,
} from "@inkweave/plugins";

const PLUGIN_LOADER: Record<keyof PluginSettings, () => void> = {
	audio: loadAudio,
	image: loadImage,
	linkopen: loadLinkopen,
	memory: loadMemory,
	scrollafterchoice: loadScrollafterchoice,
	fadeforline: loadFadeEffect,
	cd_button: loadCdButton,
	auto_button: loadAutoButton,
	auto_save: loadAutosave,
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
