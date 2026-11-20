import {
  explanationsCurrent,
  SYNTHETIC_EXPLANATION_LABEL,
  STALE_EXPLANATION_LABEL,
  type ProjectContributionValue,
  type ProjectData,
} from "./project-contribution-model";

function ProjectMaterial({ material }: { material: ProjectData["materials"][number] }) {
  return (
    <details className="contribution-material">
      <summary>
        Pokaż materiał {material.id}: {material.title}
      </summary>
      <p className="record-caption">Materiał demonstracyjny — syntetyczny.</p>
      <p>{material.content}</p>
    </details>
  );
}

/** Both future E1 presentations use the same data. No participant assignment or tracking. */
export function ProjectContribution({
  project,
  presentation = "i1",
}: {
  project: ProjectContributionValue;
  presentation?: "plain" | "i1";
}) {
  const { data } = project;
  const current = explanationsCurrent(project);
  return (
    <div className="project-contribution">
      <h3>{data.title || "Projekt bez tytułu"}</h3>
      <p className="record-caption">
        Fikcyjny przypadek. Osoby, dokumenty i wyniki są syntetyczne. E1 pozostaje planowany.
      </p>
      <p>{data.context || "Nie podano kontekstu."}</p>
      <dl className="contribution-context">
        <div>
          <dt>Deklarowany własny wkład</dt>
          <dd>{data.ownWork || "Nie opisano."}</dd>
        </div>
        <div>
          <dt>Praca zespołu</dt>
          <dd>{data.teamWork || "Nie opisano."}</dd>
        </div>
        <div>
          <dt>Pomoc AI</dt>
          <dd>{data.aiHelp || "Nie opisano."}</dd>
        </div>
      </dl>
      {presentation === "plain" ? (
        <>
          <h4>Deklarowane czynności</h4>
          <ol className="contribution-activities">
            {data.activities.map((activity) => (
              <li key={activity.id}>
                <p>{activity.claim || "Nie opisano czynności."}</p>
                {activity.materialId === null && (
                  <p>
                    Nie mogę udostępnić materiału
                    {activity.unavailableReason ? `: ${activity.unavailableReason}` : "."}
                  </p>
                )}
              </li>
            ))}
          </ol>
          <h4>Udostępnione materiały</h4>
          {data.materials
            .filter((material) =>
              data.activities.some((activity) => activity.materialId === material.id),
            )
            .map((material) => (
              <ProjectMaterial key={material.id} material={material} />
            ))}
          {!data.activities.some((activity) => activity.materialId !== null) && (
            <p>Nie udostępniono materiałów.</p>
          )}
        </>
      ) : (
        <>
          <p className="contribution-disclaimer">{SYNTHETIC_EXPLANATION_LABEL}</p>
          {!current && (
            <p role="status" className="contribution-disclaimer">
              {project.explanationsInvalidated
                ? STALE_EXPLANATION_LABEL
                : "Brak przygotowanego objaśnienia demonstracyjnego dla tego projektu."}
            </p>
          )}
          <ol className="contribution-activities">
            {data.activities.map((activity, index) => {
              const material = data.materials.find((item) => item.id === activity.materialId);
              const explanation = current
                ? project.explanation?.entries.find((entry) => entry.activityId === activity.id)
                : undefined;
              return (
                <li key={activity.id}>
                  <h4>Czynność {index + 1}</h4>
                  <dl className="contribution-evidence">
                    <div>
                      <dt>Deklarowana czynność</dt>
                      <dd>{activity.claim}</dd>
                    </div>
                    <div>
                      <dt>Materiał</dt>
                      <dd>
                        {material ? (
                          <ProjectMaterial material={material} />
                        ) : (
                          <>
                            <p>Nie mogę udostępnić materiału.</p>
                            {activity.unavailableReason && <p>{activity.unavailableReason}</p>}
                          </>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Objaśnienie</dt>
                      <dd>
                        {explanation?.explanation ??
                          "Brak aktualnego objaśnienia demonstracyjnego."}
                      </dd>
                    </div>
                    <div>
                      <dt>Czego nie ustalono</dt>
                      <dd>
                        {explanation?.unknowns ??
                          "Nie ustalono podstaw do interpretacji aktualnej deklaracji i materiału. Wymaga to osobnego omówienia; brak materiału nie oznacza braku kompetencji."}
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
}
