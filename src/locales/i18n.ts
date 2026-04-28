import Mustache from "mustache";
import { moment } from "obsidian";
import en from "./en.json";
import pl from "./pl.json";
import zh_cn from "./zh_cn.json";

export const LANGS = {
  en: en,
  zh_cn: zh_cn,
  pl: pl,
};

export type LangType = keyof typeof LANGS;
export type TransItemType = keyof (typeof LANGS)["en"];

export class I18n {
  _get(key: TransItemType) {
    let realLang: LangType = "en";
    if (moment.locale().replace("-", "_") in LANGS) {
      realLang = moment.locale().replace("-", "_") as LangType;
    }

    const res: string | undefined = (LANGS[realLang] as (typeof LANGS)["en"])[key] || LANGS.en[key];
    return res;
  }

  t(key: TransItemType, vars?: Record<string, string>) {
    if (vars === undefined) {
      return this._get(key);
    }
    return Mustache.render(this._get(key), vars);
  }
}
const i18n = new I18n();
export const t = (content: string | undefined): string | undefined => {
  if (!content) return;

  // 处理 modal_slot_N 格式的字符串
  const modalSlotMatch = content.match(/^modal_slot_(\d+)$/);
  if (modalSlotMatch && modalSlotMatch[1] !== undefined) {
    return i18n.t("modal_slot", { n: modalSlotMatch[1] });
  }

  // 其他情况直接作为翻译键使用
  return i18n.t(content as TransItemType);
};
