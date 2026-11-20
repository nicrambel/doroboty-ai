import { initialState, stateSchema, legacyStateSchema, type State } from "./model";
export const STORAGE_KEY = "doroboty.prototype.v2";
export const LEGACY_STORAGE_KEY = "doroboty.prototype.v1";
export const MAX_IMPORT_BYTES = 2_000_000;
export interface StoragePort {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
export class StorageConflictError extends Error {
  constructor() {
    super(
      "Zapis zmienił się w innej karcie. Skopiuj niezapisany tekst i odśwież tę stronę przed dalszą edycją. Niczego nie nadpisano.",
    );
  }
}
export function storedText(storage: StoragePort) {
  return storage.getItem(STORAGE_KEY) ?? storage.getItem(LEGACY_STORAGE_KEY);
}
export function parseState(raw: string): State {
  if (new TextEncoder().encode(raw).length > MAX_IMPORT_BYTES)
    throw new Error("Plik jest za duży (maksymalnie 2 MB).");
  try {
    const value = JSON.parse(raw);
    return value?.version === 1 ? legacyStateSchema.parse(value) : stateSchema.parse(value);
  } catch {
    throw new Error(
      "Nieprawidłowy plik lub nieobsługiwana wersja danych. Dotychczasowy stan pozostaje bez zmian.",
    );
  }
}
export function serializeState(state: State) {
  return JSON.stringify(state, null, 2);
}
export function readState(storage: StoragePort | null) {
  if (!storage)
    return {
      state: initialState(),
      issue:
        "Zapis w przeglądarce jest niedostępny. Zmiany zachowasz przez eksport w ustawieniach.",
      blocked: false,
      original: null,
      snapshot: null,
    };
  let raw: string | null = null;
  try {
    // A corrupt v2 takes precedence and remains protected; fallback only if absent.
    raw = storedText(storage);
    return {
      state: raw !== null ? parseState(raw) : initialState(),
      issue: "",
      blocked: false,
      original: null,
      snapshot: raw,
    };
  } catch {
    return {
      state: initialState(),
      issue:
        "Nie udało się odczytać zapisu. Dotychczasowe dane nie zostaną nadpisane. Pobierz je w ustawieniach, a następnie zaimportuj poprawny plik lub zresetuj scenariusz.",
      blocked: true,
      original: raw,
      snapshot: raw,
    };
  }
}
export function saveState(storage: StoragePort | null, state: State, expected?: string | null) {
  if (!storage)
    throw new Error(
      "Zapis w przeglądarce jest niedostępny. Wyeksportuj zmiany przed zamknięciem strony.",
    );
  const raw = serializeState(state);
  if (new TextEncoder().encode(raw).length > MAX_IMPORT_BYTES)
    throw new Error("Dane przekraczają 2 MB. Wyeksportuj je, aby zachować zmiany.");
  try {
    if (expected !== undefined && storedText(storage) !== expected)
      throw new StorageConflictError();
    storage.setItem(STORAGE_KEY, raw);
    return raw;
  } catch (error) {
    if (error instanceof StorageConflictError) throw error;
    throw new Error(
      "Nie udało się zapisać zmian w przeglądarce. Wyeksportuj dane przed zamknięciem strony.",
    );
  }
}
