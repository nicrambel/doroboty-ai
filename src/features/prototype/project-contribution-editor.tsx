import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectContribution } from "./project-contribution";
import {
  createProject,
  editProject,
  explanationsCurrent,
  STALE_EXPLANATION_LABEL,
  type ProjectContributionValue,
  type ProjectData,
} from "./project-contribution-model";

export function ProjectContributionEditor({
  project,
  onChange,
  disabled,
}: {
  project?: ProjectContributionValue;
  onChange: (value: ProjectContributionValue | undefined) => void;
  disabled: boolean;
}) {
  const [preview, setPreview] = useState(false);
  const previewHeading = useRef<HTMLHeadingElement>(null);
  const previewButton = useRef<HTMLButtonElement>(null);
  function update(data: ProjectData) {
    if (project) onChange(editProject(project, data));
  }
  function setActivity(index: number, change: Partial<ProjectData["activities"][number]>) {
    if (project)
      update({
        ...project.data,
        activities: project.data.activities.map((item, i) =>
          i === index ? { ...item, ...change } : item,
        ),
      });
  }
  return (
    <section
      className="application-form-section contribution-editor"
      aria-labelledby="contribution-editor-title"
      tabIndex={-1}
      id="contribution-editor"
    >
      <h3 id="contribution-editor-title">Twój wkład w projekt</h3>
      <p className="application-help">
        Opcjonalnie opisz jeden projekt, własne czynności, pracę zespołu i pomoc AI. Używaj
        wyłącznie fikcyjnych danych. Brak materiału nie blokuje wysłania aplikacji.
      </p>
      {!project ? (
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => onChange(createProject())}
        >
          Dodaj projekt
        </Button>
      ) : (
        <>
          {(project.explanationsInvalidated ||
            (project.explanation && !explanationsCurrent(project))) && (
            <p role="status">{STALE_EXPLANATION_LABEL}</p>
          )}
          {preview ? (
            <div className="contribution-preview">
              <h4 tabIndex={-1} ref={previewHeading}>
                Podgląd przed wysłaniem
              </h4>
              <ProjectContribution project={project} presentation="plain" />
              <Button
                type="button"
                variant="outline"
                disabled={disabled}
                onClick={() => {
                  setPreview(false);
                  requestAnimationFrame(() => previewButton.current?.focus());
                }}
              >
                Wróć do edycji projektu
              </Button>
            </div>
          ) : (
            <fieldset disabled={disabled}>
              <legend className="sr-only">Dane projektu i materiały</legend>
              <label className="field">
                <span>Tytuł projektu</span>
                <Input
                  maxLength={200}
                  value={project.data.title}
                  onChange={(event) => update({ ...project.data, title: event.target.value })}
                />
              </label>
              {(
                [
                  ["context", "Kontekst projektu"],
                  ["ownWork", "Mój własny wkład"],
                  ["teamWork", "Praca zespołu"],
                  ["aiHelp", "Pomoc AI"],
                ] as const
              ).map(([name, label]) => (
                <label className="field" key={name}>
                  <span>{label}</span>
                  <Textarea
                    maxLength={12000}
                    value={project.data[name]}
                    onChange={(event) => update({ ...project.data, [name]: event.target.value })}
                  />
                </label>
              ))}
              <h4>Deklarowane czynności i powiązania</h4>
              {project.data.activities.map((activity, index) => (
                <fieldset className="contribution-edit-activity" key={activity.id}>
                  <legend>Czynność {index + 1}</legend>
                  <label className="field">
                    <span>Deklarowana czynność {index + 1}</span>
                    <Textarea
                      maxLength={12000}
                      value={activity.claim}
                      onChange={(event) => setActivity(index, { claim: event.target.value })}
                    />
                  </label>
                  <label className="field">
                    <span>Materiał dla czynności {index + 1}</span>
                    <select
                      className="contribution-select"
                      value={activity.materialId ?? ""}
                      onChange={(event) =>
                        setActivity(index, {
                          materialId: event.target.value || null,
                          unavailableReason: "",
                        })
                      }
                    >
                      <option value="">Nie mogę udostępnić materiału</option>
                      {project.data.materials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.id}: {material.title || "Materiał bez tytułu"}
                        </option>
                      ))}
                    </select>
                  </label>
                  {activity.materialId === null && (
                    <label className="field">
                      <span>Wyjaśnienie braku materiału {index + 1} (opcjonalnie)</span>
                      <Textarea
                        maxLength={12000}
                        value={activity.unavailableReason}
                        onChange={(event) =>
                          setActivity(index, { unavailableReason: event.target.value })
                        }
                      />
                    </label>
                  )}
                  {project.data.activities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        update({
                          ...project.data,
                          activities: project.data.activities.filter(
                            (item) => item.id !== activity.id,
                          ),
                        });
                        requestAnimationFrame(() =>
                          document.getElementById("contribution-add-activity")?.focus(),
                        );
                      }}
                    >
                      Usuń czynność {index + 1}
                    </Button>
                  )}
                </fieldset>
              ))}
              <Button
                id="contribution-add-activity"
                type="button"
                variant="outline"
                disabled={disabled || project.data.activities.length >= 12}
                onClick={() =>
                  update({
                    ...project.data,
                    activities: [
                      ...project.data.activities,
                      {
                        id: `activity-${crypto.randomUUID()}`,
                        claim: "",
                        materialId: null,
                        unavailableReason: "",
                      },
                    ],
                  })
                }
              >
                Dodaj czynność
              </Button>
              <h4>Materiały demonstracyjne</h4>
              <p className="application-help">
                Wpisz syntetyczny fragment materiału. Do zgłoszenia trafią tylko materiały
                przypisane do czynności. Nie przesyłamy plików.
              </p>
              {project.data.materials.map((material) => (
                <details className="contribution-material" key={material.id}>
                  <summary>
                    Edytuj materiał {material.id}: {material.title || "bez tytułu"}
                  </summary>
                  <label className="field">
                    <span>Tytuł materiału {material.id}</span>
                    <Input
                      maxLength={200}
                      value={material.title}
                      onChange={(event) =>
                        update({
                          ...project.data,
                          materials: project.data.materials.map((item) =>
                            item.id === material.id ? { ...item, title: event.target.value } : item,
                          ),
                        })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Treść materiału {material.id}</span>
                    <Textarea
                      maxLength={12000}
                      value={material.content}
                      onChange={(event) =>
                        update({
                          ...project.data,
                          materials: project.data.materials.map((item) =>
                            item.id === material.id
                              ? { ...item, content: event.target.value }
                              : item,
                          ),
                        })
                      }
                    />
                  </label>
                </details>
              ))}
              <Button
                type="button"
                variant="outline"
                disabled={disabled || project.data.materials.length >= 12}
                onClick={() => {
                  const id = `M${project.data.materials.length + 1}-${crypto.randomUUID().slice(0, 8)}`;
                  update({
                    ...project.data,
                    materials: [...project.data.materials, { id, title: "", content: "" }],
                  });
                }}
              >
                Dodaj materiał
              </Button>
              <div className="record-actions">
                <Button
                  ref={previewButton}
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPreview(true);
                    requestAnimationFrame(() => previewHeading.current?.focus());
                  }}
                >
                  Sprawdź projekt przed wysłaniem
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    onChange(undefined);
                    requestAnimationFrame(() =>
                      document.getElementById("contribution-editor")?.focus(),
                    );
                  }}
                >
                  Usuń projekt z aplikacji
                </Button>
              </div>
            </fieldset>
          )}
        </>
      )}
    </section>
  );
}
