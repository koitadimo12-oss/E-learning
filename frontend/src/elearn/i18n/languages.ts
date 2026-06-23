export type Lang = "fr" | "en" | "wo" | "ar";

export const LANG_LABEL: Record<Lang, string> = {
  fr: "Français",
  en: "English",
  wo: "Wolof",
  ar: "العربية",
};

export const LANG_DIR: Record<Lang, "ltr" | "rtl"> = {
  fr: "ltr",
  en: "ltr",
  wo: "ltr",
  ar: "ltr",
};

export const DEFAULT_LANG: Lang = "fr";

