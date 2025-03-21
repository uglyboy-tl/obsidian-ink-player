import Mustache from "mustache";
import { moment } from "obsidian";
import en from "./en.json";
import zh_cn from "./zh_cn.json";

export const LANGS = {
	en: en,
	zh_cn: zh_cn,
};

export type LangType = keyof typeof LANGS;
export type TransItemType = keyof (typeof LANGS)["en"];

export class I18n {
	_get(key: TransItemType) {
		let realLang: LangType = "en";
		if (moment.locale().replace("-", "_") in LANGS) {
			realLang = moment.locale().replace("-", "_") as LangType;
		}

		const res: string =
			(LANGS[realLang] as (typeof LANGS)["en"])[key] ||
			LANGS["en"][key] ||
			key;
		return res;
	}

	t(key: TransItemType, vars?: Record<string, string>) {
		if (vars === undefined) {
			return this._get(key);
		}
		return Mustache.render(this._get(key), vars);
	}
}
