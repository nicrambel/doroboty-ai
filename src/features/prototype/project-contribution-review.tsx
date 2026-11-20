import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Application } from "./model";
import { usePrototype } from "./store";

export function ProjectContributionReview({
  application,
  terminal,
}: {
  application: Application;
  terminal: boolean;
}) {
  const { run } = usePrototype();
  const saved = application.contributionReview;
  const [rationale, setRationale] = useState(saved?.rationale ?? "");
  const [nextStep, setNextStep] = useState(saved?.nextStep ?? "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const rationaleInput = useRef<HTMLTextAreaElement>(null);
  const nextStepInput = useRef<HTMLTextAreaElement>(null);
  return (
    <section className="contribution-review" aria-labelledby="contribution-review-title">
      <h3 id="contribution-review-title">Uzasadnienie i następny krok</h3>
      <p className="record-caption">
        Widoczne tylko pracodawcy w tym scenariuszu. Zapis nie zmienia etapu rekrutacji. Następny
        krok jest planem, nie wykonaną decyzją.
      </p>
      {terminal ? (
        <>
          <h4>Uzasadnienie</h4>
          <p>{saved?.rationale ?? "Nie zapisano uzasadnienia."}</p>
          <h4>Następny krok</h4>
          <p>{saved?.nextStep ?? "Nie zapisano następnego kroku."}</p>
        </>
      ) : (
        <>
          <label className="field">
            <span>Uzasadnienie oceny wkładu</span>
            <Textarea
              ref={rationaleInput}
              aria-invalid={(!!error && !rationale.trim()) || undefined}
              aria-describedby={error ? "contribution-review-error" : undefined}
              maxLength={12000}
              rows={4}
              value={rationale}
              onChange={(event) => {
                setRationale(event.target.value);
                setMessage("");
              }}
            />
          </label>
          <label className="field">
            <span>Następny krok — pytanie, konsultacja lub decyzja o dalszym procesie</span>
            <Textarea
              ref={nextStepInput}
              aria-invalid={(!!error && !nextStep.trim()) || undefined}
              aria-describedby={error ? "contribution-review-error" : undefined}
              maxLength={12000}
              rows={3}
              value={nextStep}
              onChange={(event) => {
                setNextStep(event.target.value);
                setMessage("");
              }}
            />
          </label>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (!rationale.trim() || !nextStep.trim()) {
                setError("Uzupełnij uzasadnienie oraz następny krok.");
                (rationale.trim() ? nextStepInput : rationaleInput).current?.focus();
                return;
              }
              if (
                run({
                  type: "contribution_review",
                  applicationId: application.id,
                  rationale,
                  nextStep,
                })
              ) {
                setError("");
                setMessage(
                  "Zapisano uzasadnienie i następny krok. Etap rekrutacji nie zmienił się.",
                );
              }
            }}
          >
            Zapisz uzasadnienie i następny krok
          </Button>
        </>
      )}
      {saved && (
        <p className="record-caption">
          Zapisano{" "}
          {new Intl.DateTimeFormat("pl-PL", { dateStyle: "medium", timeStyle: "short" }).format(
            new Date(saved.savedAt),
          )}
          , dla wersji projektu {saved.projectRevision}.
        </p>
      )}
      {error && (
        <p id="contribution-review-error" className="error-message" role="alert">
          {error}
        </p>
      )}
      <p role="status">{message}</p>
    </section>
  );
}
