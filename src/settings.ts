export interface PluginSettings {
	audio: boolean;
	image: boolean;
	linkopen: boolean;
	memory: boolean;
	scrollafterchoice: boolean;
	fadeforline: boolean;
	cd_button: boolean;
	auto_button: boolean;
	auto_save: boolean;
}

export const DEFAULT_PLUGIN_SETTINGS: PluginSettings = {
	audio: true,
	image: true,
	linkopen: false,
	memory: true,
	scrollafterchoice: true,
	fadeforline: true,
	cd_button: false,
	auto_button: false,
	auto_save: false,
};

export interface OptionSettings {
	debug: boolean;
}

export const DEFAULT_OPTION_SETTINGS: OptionSettings = {
	debug: false,
};

export interface InkStorySettings extends PluginSettings, OptionSettings {}

export const DEFAULT_SETTINGS: InkStorySettings = {
	...DEFAULT_PLUGIN_SETTINGS,
	...DEFAULT_OPTION_SETTINGS,
	...{},
};
