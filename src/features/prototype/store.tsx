import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { initialState, transition, type Action, type State } from "./model";
import {
  parseState,
  readState,
  saveState,
  StorageConflictError,
  type StoragePort,
} from "./storage";
function browserStorage(): StoragePort | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
function useStore() {
  const [storage] = useState(browserStorage);
  const [loaded] = useState(() => readState(storage));
  const [state, setState] = useState(loaded.state);
  const [issue, setIssue] = useState(loaded.issue);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(loaded.blocked);
  const [writePending, setWritePending] = useState(true);
  const latest = useRef(state);
  const expected = useRef(loaded.snapshot);
  const writer = useRef<"pending" | "owner" | "blocked" | "memory">("pending");
  useEffect(() => {
    if (!storage) {
      writer.current = "memory";
      setWritePending(false);
      return;
    }
    const memoryOnly = () => {
      writer.current = "memory";
      setWritePending(false);
      setIssue(
        "Ta przeglądarka nie udostępnia bezpiecznej blokady zapisu między kartami. Zmiany pozostają tylko w tej karcie — wyeksportuj je przed jej zamknięciem.",
      );
    };
    if (!navigator.locks) {
      memoryOnly();
      return;
    }
    let active = true;
    let release: (() => void) | undefined;
    const controller = new AbortController();
    // A short bounded wait allows an outgoing document to release its lock on reload.
    const deadline = window.setTimeout(() => controller.abort(), 1000);
    writer.current = "pending";
    void navigator.locks
      .request("doroboty.prototype.writer", { signal: controller.signal }, async () => {
        window.clearTimeout(deadline);
        if (!active) return;
        writer.current = "owner";
        setWritePending(false);
        setIssue(loaded.issue);
        // Hold the browser's exclusive lock until this provider/tab closes.
        await new Promise<void>((resolve) => {
          release = resolve;
        });
      })
      .catch(() => {
        window.clearTimeout(deadline);
        if (!active) return;
        if (controller.signal.aborted) {
          writer.current = "blocked";
          setWritePending(false);
          setIssue(
            "Scenariusz jest otwarty do edycji w innej karcie. Ta karta nie zapisuje zmian, także importu ani resetu. Skopiuj niezapisany tekst, zamknij pozostałą kartę i odśwież tę stronę, aby wczytać aktualny zapis.",
          );
        } else memoryOnly();
      });
    return () => {
      active = false;
      window.clearTimeout(deadline);
      controller.abort();
      release?.();
    };
  }, [storage, loaded.issue]);
  function commit(next: State, replace = false) {
    if (writer.current === "pending") {
      setIssue("Trwa sprawdzanie dostępu do zapisu. Spróbuj ponownie za chwilę.");
      return false;
    }
    if (writer.current === "blocked") return false;
    if (writer.current === "owner" && (!blocked || replace)) {
      try {
        expected.current = saveState(storage, next, expected.current);
        setIssue("");
        if (replace) setBlocked(false);
      } catch (e) {
        setIssue((e as Error).message);
        if (e instanceof StorageConflictError) {
          writer.current = "blocked";
          return false;
        }
      }
    }
    latest.current = next;
    setState(next);
    setError("");
    return true;
  }
  function run(action: Action) {
    try {
      return commit(transition(latest.current, action));
    } catch (e) {
      setError(
        e instanceof Error && e.name !== "ZodError"
          ? e.message
          : "Sprawdź poprawność i długość wprowadzonych danych.",
      );
      return false;
    }
  }
  function importState(raw: string) {
    try {
      const next = parseState(raw);
      return commit(next, true);
    } catch (e) {
      setError((e as Error).message);
      return false;
    }
  }
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);
  return {
    state,
    issue,
    error,
    blocked,
    writePending,
    original: loaded.original,
    run,
    importState,
    clearError: () => setError(""),
    reset: () => commit(initialState(), true),
  };
}
type Store = ReturnType<typeof useStore>;
const Context = createContext<Store | null>(null);
export function PrototypeProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  return <Context.Provider value={store}>{children}</Context.Provider>;
}
export function usePrototype() {
  const store = useContext(Context);
  if (!store) throw new Error("PrototypeProvider is required");
  return store;
}
