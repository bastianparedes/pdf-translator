export const TARGET_LANGUAGES = [
  { code: "es", name: "Español" },
  { code: "en", name: "Inglés" },
  { code: "fr", name: "Francés" },
  { code: "de", name: "Alemán" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Portugués" },
  { code: "ja", name: "Japonés" },
  { code: "zh-CN", name: "Chino (simplificado)" },
  { code: "ko", name: "Coreano" },
  { code: "ru", name: "Ruso" },
  { code: "ar", name: "Árabe" },
  { code: "nl", name: "Neerlandés" },
] as const;

export type TargetLanguage = (typeof TARGET_LANGUAGES)[number]["code"];

export function isTargetLanguage(value: string): value is TargetLanguage {
  return TARGET_LANGUAGES.some((language) => language.code === value);
}

export function getTargetLanguageName(code: TargetLanguage): string {
  const language = TARGET_LANGUAGES.find((candidate) => candidate.code === code);

  if (!language) {
    throw new Error(`Unsupported target language: ${code}`);
  }

  return language.name;
}
