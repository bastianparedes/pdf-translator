"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { TARGET_LANGUAGES } from "./languages";

type ExtractedPdf = {
  fileName: string;
  hasSelectableText: boolean;
  totalParagraphs: number;
  totalPages: number;
};

type TranslationMethod = "google" | "gemini" | "gemini-pdf";
type UiLanguage = "es" | "en" | "fr";

const UI_TEXT: Record<UiLanguage, Record<string, string>> = {
  es: {
    documentTitle: "Lingo — Traduce tus PDF",
    home: "Lingo, inicio",
    interfaceLanguage: "Idioma de la interfaz",
    title: "Traducir un PDF",
    intro: "Elige un archivo, el idioma y cómo traducirlo.",
    fileInput: "Selecciona un archivo PDF",
    removeFile: "Quitar archivo",
    dragPdf: "Arrastra tu PDF hasta aquí",
    or: "o, si lo prefieres",
    browse: "Buscar en mis archivos",
    pdfLimit: "Solo archivos PDF · Máximo 20 MB",
    targetLanguage: "Idioma de destino",
    method: "¿Cómo quieres traducirlo?",
    googleDescription: "Traducción rápida",
    ai: "Gemini (IA)",
    aiDescription: "Traducción contextual en una sola petición",
    aiPdf: "Gemini (PDF completo)",
    aiPdfDescription: "Envía el documento completo para aportar contexto visual",
    processing: "Traduciendo párrafos…",
    processingPdf: "Enviando y traduciendo el PDF…",
    translate: "Traducir PDF",
    chooseAnother: "Elegir otro archivo",
    googleNotice: "El contenido del PDF se enviará a Google Translate.",
    geminiNotice:
      "El texto del PDF se enviará a Google Gemini en una sola petición.",
    geminiPdfNotice:
      "El PDF completo y sus párrafos detectados se enviarán a Gemini; se solicitará borrar el archivo temporal al terminar. Los escaneos sin texto seleccionable aún requieren OCR.",
    resultTitle: "PDF traducido",
    previewPdf: "Vista previa del PDF traducido",
    downloadPdf: "Descargar PDF traducido",
    paragraphs: "párrafos",
    paragraph: "párrafo",
    in: "en",
    pages: "páginas",
    page: "página",
    noText:
      "No se encontró texto seleccionable; el PDF se entrega sin cambios. Si es un documento escaneado, necesitará OCR para reconocer sus imágenes.",
    footer: "Hecho para que las buenas ideas viajen.",
    invalidFile: "Ese archivo no parece ser un PDF. Elige un archivo .pdf.",
    requestFailed: "No se pudo procesar el PDF. Inténtalo de nuevo.",
    invalidResponse: "El servidor devolvió una respuesta no válida.",
    fileTooLarge: "El PDF supera el tamaño máximo de 20 MB.",
    cannotReadUpload: "No se pudo leer el archivo enviado.",
    selectPdf: "Selecciona un archivo PDF para continuar.",
    invalidTargetLanguage: "Selecciona un idioma de destino válido.",
    invalidPdfFormat: "El archivo debe tener formato PDF.",
    emptyFile: "El archivo está vacío.",
    invalidPdfContent: "El contenido del archivo no parece ser un PDF válido.",
    googleError:
      "No se pudieron traducir los párrafos. Google Translate puede estar temporalmente no disponible; revisa la terminal del servidor.",
    geminiError:
      "No se pudieron traducir los párrafos con Gemini. Comprueba GEMINI_API_KEY y vuelve a intentarlo.",
    missingGeminiKey:
      "Gemini no está configurado. Añade GEMINI_API_KEY al entorno del servidor.",
    pdfGenerationError:
      "No se pudo generar el PDF traducido. La fuente disponible puede no admitir algunos caracteres del idioma elegido.",
    unreadablePdf:
      "No se pudo leer el PDF. Puede estar dañado o protegido con contraseña.",
  },
  en: {
    documentTitle: "Lingo — Translate your PDFs",
    home: "Lingo, home",
    interfaceLanguage: "Interface language",
    title: "Translate a PDF",
    intro: "Choose a file, a language, and how to translate it.",
    fileInput: "Choose a PDF file",
    removeFile: "Remove file",
    dragPdf: "Drag your PDF here",
    or: "or, if you prefer",
    browse: "Browse files",
    pdfLimit: "PDF files only · 20 MB maximum",
    targetLanguage: "Target language",
    method: "How would you like to translate it?",
    googleDescription: "Fast translation",
    ai: "Gemini (AI)",
    aiDescription: "Context-aware translation in one request",
    aiPdf: "Gemini (full PDF)",
    aiPdfDescription: "Send the complete document for visual context",
    processing: "Translating paragraphs…",
    processingPdf: "Uploading and translating the PDF…",
    translate: "Translate PDF",
    chooseAnother: "Choose another file",
    googleNotice: "The PDF content will be sent to Google Translate.",
    geminiNotice:
      "The PDF text will be sent to Google Gemini in a single request.",
    geminiPdfNotice:
      "The complete PDF and its detected paragraphs will be sent to Gemini; deletion of the temporary file is requested when processing finishes. Scans without selectable text still need OCR.",
    resultTitle: "Translated PDF",
    previewPdf: "Translated PDF preview",
    downloadPdf: "Download translated PDF",
    paragraphs: "paragraphs",
    paragraph: "paragraph",
    in: "across",
    pages: "pages",
    page: "page",
    noText:
      "No selectable text was found; the PDF is provided unchanged. Scanned documents need OCR to recognize text in images.",
    footer: "Made for good ideas to travel.",
    invalidFile: "That file doesn't look like a PDF. Choose a .pdf file.",
    requestFailed: "Couldn't process the PDF. Please try again.",
    invalidResponse: "The server returned an invalid response.",
    fileTooLarge: "The PDF exceeds the 20 MB size limit.",
    cannotReadUpload: "Couldn't read the uploaded file.",
    selectPdf: "Choose a PDF file to continue.",
    invalidTargetLanguage: "Choose a valid target language.",
    invalidPdfFormat: "The file must be in PDF format.",
    emptyFile: "The file is empty.",
    invalidPdfContent: "The file content doesn't appear to be a valid PDF.",
    googleError:
      "The paragraphs couldn't be translated. Google Translate may be temporarily unavailable; check the server terminal.",
    geminiError:
      "Couldn't translate the paragraphs with Gemini. Check GEMINI_API_KEY and try again.",
    missingGeminiKey:
      "Gemini isn't configured. Add GEMINI_API_KEY to the server environment.",
    pdfGenerationError:
      "The translated PDF couldn't be generated. The available font may not support some characters in the selected language.",
    unreadablePdf:
      "Couldn't read the PDF. It may be damaged or password-protected.",
  },
  fr: {
    documentTitle: "Lingo — Traduisez vos PDF",
    home: "Lingo, accueil",
    interfaceLanguage: "Langue de l’interface",
    title: "Traduire un PDF",
    intro: "Choisissez un fichier, une langue et une méthode de traduction.",
    fileInput: "Choisir un fichier PDF",
    removeFile: "Supprimer le fichier",
    dragPdf: "Déposez votre PDF ici",
    or: "ou, si vous préférez",
    browse: "Parcourir les fichiers",
    pdfLimit: "Fichiers PDF uniquement · 20 Mo maximum",
    targetLanguage: "Langue cible",
    method: "Comment souhaitez-vous le traduire ?",
    googleDescription: "Traduction rapide",
    ai: "Gemini (IA)",
    aiDescription: "Traduction contextuelle en une seule requête",
    aiPdf: "Gemini (PDF complet)",
    aiPdfDescription: "Envoyez le document complet pour le contexte visuel",
    processing: "Traduction des paragraphes…",
    processingPdf: "Envoi et traduction du PDF…",
    translate: "Traduire le PDF",
    chooseAnother: "Choisir un autre fichier",
    googleNotice: "Le contenu du PDF sera envoyé à Google Traduction.",
    geminiNotice:
      "Le texte du PDF sera envoyé à Google Gemini en une seule requête.",
    geminiPdfNotice:
      "Le PDF complet et ses paragraphes détectés seront envoyés à Gemini ; la suppression du fichier temporaire sera demandée à la fin du traitement. Les scans sans texte sélectionnable nécessitent encore un OCR.",
    resultTitle: "PDF traduit",
    previewPdf: "Aperçu du PDF traduit",
    downloadPdf: "Télécharger le PDF traduit",
    paragraphs: "paragraphes",
    paragraph: "paragraphe",
    in: "sur",
    pages: "pages",
    page: "page",
    noText:
      "Aucun texte sélectionnable n’a été trouvé ; le PDF est fourni sans modification. Les documents numérisés nécessitent un OCR pour reconnaître le texte des images.",
    footer: "Pour que les bonnes idées voyagent.",
    invalidFile: "Ce fichier ne semble pas être un PDF. Choisissez un fichier .pdf.",
    requestFailed: "Impossible de traiter le PDF. Veuillez réessayer.",
    invalidResponse: "Le serveur a renvoyé une réponse invalide.",
    fileTooLarge: "Le PDF dépasse la taille maximale de 20 Mo.",
    cannotReadUpload: "Impossible de lire le fichier envoyé.",
    selectPdf: "Choisissez un fichier PDF pour continuer.",
    invalidTargetLanguage: "Choisissez une langue cible valide.",
    invalidPdfFormat: "Le fichier doit être au format PDF.",
    emptyFile: "Le fichier est vide.",
    invalidPdfContent: "Le contenu du fichier ne semble pas être un PDF valide.",
    googleError:
      "Impossible de traduire les paragraphes. Google Traduction est peut-être temporairement indisponible ; vérifiez le terminal du serveur.",
    geminiError:
      "Impossible de traduire les paragraphes avec Gemini. Vérifiez GEMINI_API_KEY et réessayez.",
    missingGeminiKey:
      "Gemini n’est pas configuré. Ajoutez GEMINI_API_KEY à l’environnement du serveur.",
    pdfGenerationError:
      "Impossible de générer le PDF traduit. La police disponible ne prend peut-être pas en charge certains caractères de la langue choisie.",
    unreadablePdf:
      "Impossible de lire le PDF. Il est peut-être endommagé ou protégé par un mot de passe.",
  },
};

const API_ERROR_KEYS: Record<string, keyof typeof UI_TEXT.es> = {
  "El PDF supera el tamaño máximo de 20 MB.": "fileTooLarge",
  "No se pudo leer el archivo enviado.": "cannotReadUpload",
  "Selecciona un archivo PDF para continuar.": "selectPdf",
  "Selecciona un idioma de destino válido.": "invalidTargetLanguage",
  "El archivo debe tener formato PDF.": "invalidPdfFormat",
  "El archivo está vacío.": "emptyFile",
  "El contenido del archivo no parece ser un PDF válido.": "invalidPdfContent",
  "No se pudieron traducir los párrafos. Google Translate puede estar temporalmente no disponible; revisa la terminal del servidor.":
    "googleError",
  "No se pudieron traducir los párrafos con Gemini. Comprueba GEMINI_API_KEY y vuelve a intentarlo.":
    "geminiError",
  "La variable GEMINI_API_KEY no está configurada en el servidor.":
    "missingGeminiKey",
  "No se pudo generar el PDF traducido porque la fuente disponible no admite algunos caracteres del idioma elegido.":
    "pdfGenerationError",
  "No se pudo modificar el PDF para insertar las traducciones.":
    "pdfGenerationError",
  "No se pudo leer el PDF. Puede estar dañado o protegido con contraseña.":
    "unreadablePdf",
};

function isUiLanguage(value: string): value is UiLanguage {
  return value === "es" || value === "en" || value === "fr";
}

function UploadIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="28"
      viewBox="0 0 28 28"
      width="28"
    >
      <path
        d="M14 18V4m0 0L8.75 9.25M14 4l5.25 5.25M5.25 17.5v3.25A2.25 2.25 0 0 0 7.5 23h13a2.25 2.25 0 0 0 2.25-2.25V17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function DocumentIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
    >
      <path
        d="M13.5 3.75H7.25a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h9.5a1.5 1.5 0 0 0 1.5-1.5V8.5l-4.75-4.75Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M13.25 4v4.75H18M8.75 13h6.5m-6.5 3h6.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readNonNegativeIntegerHeader(
  response: Response,
  name: string,
): number | null {
  const value = response.headers.get(name);
  if (!value || !/^\d+$/.test(value)) return null;

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
}

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uiLanguage, setUiLanguage] = useState<UiLanguage>("es");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extraction, setExtraction] = useState<ExtractedPdf | null>(null);
  const [translatedPdfUrl, setTranslatedPdfUrl] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [translationMethod, setTranslationMethod] =
    useState<TranslationMethod>("google");
  const text = UI_TEXT[uiLanguage];

  useEffect(() => {
    document.documentElement.lang = uiLanguage;
    document.title = UI_TEXT[uiLanguage].documentTitle;
  }, [uiLanguage]);

  useEffect(() => {
    return () => {
      if (translatedPdfUrl) URL.revokeObjectURL(translatedPdfUrl);
    };
  }, [translatedPdfUrl]);

  function chooseFile(selectedFile?: File) {
    if (!selectedFile || isProcessing) return;

    if (!selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setFile(null);
      setExtraction(null);
      setTranslatedPdfUrl(null);
      setError(text.invalidFile);
      return;
    }

    setError("");
    setExtraction(null);
    setTranslatedPdfUrl(null);
    setFile(selectedFile);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  }

  function removeFile() {
    if (isProcessing) return;
    setFile(null);
    setError("");
    setExtraction(null);
    setTranslatedPdfUrl(null);
  }

  async function extractPdfText() {
    if (!file || isProcessing) return;

    setError("");
    setExtraction(null);
    setTranslatedPdfUrl(null);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("targetLanguage", targetLanguage);

    try {
      const response = await fetch(
        translationMethod === "google"
          ? "/api/extract"
          : translationMethod === "gemini-pdf"
            ? "/api/extract-gemini-pdf"
            : "/api/extract-gemini",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        if (
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
        ) {
          throw new Error(payload.error);
        }

        throw new Error(text.requestFailed);
      }

      const contentType = response.headers.get("content-type");
      const totalParagraphs = readNonNegativeIntegerHeader(
        response,
        "x-total-paragraphs",
      );
      const totalPages = readNonNegativeIntegerHeader(
        response,
        "x-total-pages",
      );
      const hasSelectableText =
        response.headers.get("x-has-selectable-text");
      const pdfBlob = await response.blob();

      if (
        !contentType?.includes("application/pdf") ||
        totalParagraphs === null ||
        totalPages === null ||
        (hasSelectableText !== "true" && hasSelectableText !== "false") ||
        pdfBlob.size === 0
      ) {
        throw new Error(text.invalidResponse);
      }

      setExtraction({
        fileName: file.name.replace(/\.pdf$/i, "-traducido.pdf"),
        hasSelectableText: hasSelectableText === "true",
        totalParagraphs,
        totalPages,
      });
      setTranslatedPdfUrl(URL.createObjectURL(pdfBlob));
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "";
      const apiErrorKey = API_ERROR_KEYS[message];
      setError(
        apiErrorKey
          ? text[apiErrorKey]
          : message === text.invalidResponse || message === text.requestFailed
            ? message
            : text.requestFailed,
      );
    } finally {
      setIsProcessing(false);
    }
  }

  const targetLanguageNames = new Intl.DisplayNames([uiLanguage], {
    type: "language",
  });

  return (
    <main className="page-shell" lang={uiLanguage}>
      <header className="site-header">
        <Link aria-label={text.home} className="brand" href="/">
          <span aria-hidden="true" className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <span>lingo</span>
        </Link>
        <label className="ui-language-field">
          <span>{text.interfaceLanguage}</span>
          <select
            aria-label={text.interfaceLanguage}
            id="ui-language"
            onChange={(event) => {
              if (isUiLanguage(event.target.value)) {
                setUiLanguage(event.target.value);
              }
            }}
            value={uiLanguage}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </label>
      </header>

      <div className="main-content">
        <section aria-labelledby="page-title" className="upload-section">
          <h1 id="page-title">{text.title}</h1>
          <p className="intro">{text.intro}</p>

          <div
            className={`dropzone${isDragging ? " dropzone-active" : ""}${file ? " dropzone-filled" : ""}`}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsDragging(false);
              }
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              accept=".pdf,application/pdf"
              aria-label={text.fileInput}
              className="file-input"
              onChange={handleFileChange}
              ref={fileInputRef}
              type="file"
            />

            {file ? (
              <div aria-live="polite" className="selected-file">
                <div className="pdf-icon">
                  <DocumentIcon />
                  <span>PDF</span>
                </div>
                <div className="file-details">
                  <span className="file-name" title={file.name}>
                    {file.name}
                  </span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
                <button
                  aria-label={text.removeFile}
                  className="remove-file"
                  onClick={removeFile}
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="18"
                    viewBox="0 0 20 20"
                    width="18"
                  >
                    <path
                      d="m5 5 10 10M15 5 5 15"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.6"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div aria-hidden="true" className="upload-icon">
                  <UploadIcon />
                </div>
                <p className="drop-title">{text.dragPdf}</p>
                <p className="drop-subtitle">{text.or}</p>
                <button
                  className="browse-button"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  {text.browse}
                  <svg
                    aria-hidden="true"
                    fill="none"
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                  >
                    <path
                      d="M3.5 8h9m-3.5-3.5L12.5 8 9 11.5"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.4"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          <p aria-live="polite" className={`file-hint${error ? " error" : ""}`}>
            {error || text.pdfLimit}
          </p>

          <div className="language-field">
            <label htmlFor="target-language">{text.targetLanguage}</label>
            <select
              disabled={isProcessing}
              id="target-language"
              onChange={(event) => setTargetLanguage(event.target.value)}
              value={targetLanguage}
            >
              {TARGET_LANGUAGES.map((language) => (
                <option key={language.code} value={language.code}>
                  {targetLanguageNames.of(language.code) ?? language.name}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="method-field" disabled={isProcessing}>
            <legend>{text.method}</legend>
            <div className="method-options">
              <label
                className={`method-option${translationMethod === "google" ? " method-option-selected" : ""}`}
              >
                <input
                  checked={translationMethod === "google"}
                  name="translation-method"
                  onChange={() => setTranslationMethod("google")}
                  type="radio"
                  value="google"
                />
                <span className="method-option-copy">
                  <span className="method-option-title">Google Translate</span>
                  <span className="method-option-description">
                    {text.googleDescription}
                  </span>
                </span>
              </label>
              <label
                className={`method-option${translationMethod === "gemini" ? " method-option-selected" : ""}`}
              >
                <input
                  checked={translationMethod === "gemini"}
                  name="translation-method"
                  onChange={() => setTranslationMethod("gemini")}
                  type="radio"
                  value="gemini"
                />
                <span className="method-option-copy">
                  <span className="method-option-title">{text.ai}</span>
                  <span className="method-option-description">
                    {text.aiDescription}
                  </span>
                </span>
              </label>
              <label
                className={`method-option${translationMethod === "gemini-pdf" ? " method-option-selected" : ""}`}
              >
                <input
                  checked={translationMethod === "gemini-pdf"}
                  name="translation-method"
                  onChange={() => setTranslationMethod("gemini-pdf")}
                  type="radio"
                  value="gemini-pdf"
                />
                <span className="method-option-copy">
                  <span className="method-option-title">{text.aiPdf}</span>
                  <span className="method-option-description">
                    {text.aiPdfDescription}
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          {file && (
            <button
              className="extract-button"
              disabled={isProcessing}
              onClick={extractPdfText}
              type="button"
            >
              {isProcessing ? (
                <>
                  <span aria-hidden="true" className="loading-spinner" />
                  {translationMethod === "gemini-pdf"
                    ? text.processingPdf
                    : text.processing}
                </>
              ) : (
                text.translate
              )}
            </button>
          )}

          {file && (
            <button
              className="replace-button"
              disabled={isProcessing}
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              {text.chooseAnother}
            </button>
          )}

          <p className="privacy-note">
            {translationMethod === "google"
              ? text.googleNotice
              : translationMethod === "gemini-pdf"
                ? text.geminiPdfNotice
                : text.geminiNotice}
          </p>

          {extraction && (
            <section aria-live="polite" className="extraction-result">
              <div className="result-heading">
                <span className="result-check" aria-hidden="true">
                  ✓
                </span>
                <div>
                  <h2>{text.resultTitle}</h2>
                  <p>
                    {extraction.totalParagraphs}{" "}
                    {extraction.totalParagraphs === 1
                      ? text.paragraph
                      : text.paragraphs}{" "}
                    {text.in}{" "}
                    {extraction.totalPages}{" "}
                    {extraction.totalPages === 1 ? text.page : text.pages}
                  </p>
                </div>
              </div>

              {!extraction.hasSelectableText && (
                <p className="no-text-message">{text.noText}</p>
              )}

              {translatedPdfUrl && (
                <>
                  <iframe
                    aria-label={text.previewPdf}
                    className="pdf-preview"
                    src={translatedPdfUrl}
                    title={text.previewPdf}
                  />
                  <a
                    className="pdf-download"
                    download={extraction.fileName}
                    href={translatedPdfUrl}
                  >
                    {text.downloadPdf}
                  </a>
                </>
              )}
            </section>
          )}
        </section>
      </div>

      <footer className="site-footer">
        {text.footer}
      </footer>
    </main>
  );
}
