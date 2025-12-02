// TODO: looks like this file can be removed
// @ts-ignore
import { createI18nServer } from "next-international/server";

export const { getI18n, getScopedI18n, getStaticParams, getCurrentLocale } =
  createI18nServer({
    en: () => import("./messages/en.json"),
    ru: () => import("./messages/ru.json"),
  });
