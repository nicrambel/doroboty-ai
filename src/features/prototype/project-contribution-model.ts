import { z } from "zod";

const identifier = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/);
const text = z.string().trim().max(12000);
export const projectDataSchema = z
  .object({
    title: text.max(200),
    context: text,
    ownWork: text,
    teamWork: text,
    aiHelp: text,
    activities: z
      .array(
        z.object({
          id: identifier,
          claim: text,
          materialId: identifier.nullable(),
          unavailableReason: text,
        }),
      )
      .min(1)
      .max(12),
    materials: z.array(z.object({ id: identifier, title: text.max(200), content: text })).max(12),
  })
  .superRefine((data, ctx) => {
    for (const list of [data.activities, data.materials]) {
      if (new Set(list.map((item) => item.id)).size !== list.length)
        ctx.addIssue({ code: "custom", message: "Duplicate project identifiers" });
    }
    for (const activity of data.activities) {
      if (
        activity.materialId !== null &&
        !data.materials.some((item) => item.id === activity.materialId)
      )
        ctx.addIssue({ code: "custom", message: "Unknown project material" });
    }
  });
export const projectSchema = z
  .object({
    revision: z.number().int().min(1).max(1_000_000),
    explanationsInvalidated: z.boolean().default(false),
    data: projectDataSchema,
    explanation: z
      .object({
        synthetic: z.literal(true),
        basedOnRevision: z.number().int().min(1),
        basis: projectDataSchema,
        entries: z
          .array(
            z.object({ activityId: identifier, explanation: text.min(1), unknowns: text.min(1) }),
          )
          .min(1)
          .max(12),
      })
      .optional(),
  })
  .superRefine((project, ctx) => {
    const entries = project.explanation?.entries ?? [];
    if (
      new Set(entries.map((entry) => entry.activityId)).size !== entries.length ||
      entries.some(
        (entry) =>
          !project.explanation?.basis.activities.some(
            (activity) => activity.id === entry.activityId,
          ),
      )
    )
      ctx.addIssue({ code: "custom", message: "Invalid explanation references" });
  })
  .transform((project) => ({
    ...project,
    explanationsInvalidated:
      project.explanationsInvalidated ||
      !!(
        project.explanation &&
        (project.explanation.basedOnRevision !== project.revision ||
          JSON.stringify(project.explanation.basis) !== JSON.stringify(project.data) ||
          !project.data.activities.every((activity) =>
            project.explanation!.entries.some((entry) => entry.activityId === activity.id),
          ))
      ),
  }));
export type ProjectData = z.infer<typeof projectDataSchema>;
export type ProjectContributionValue = z.infer<typeof projectSchema>;

// Compare the full validated basis, not an imported boolean or a material ID alone.
export function explanationsCurrent(project: ProjectContributionValue) {
  const explanation = project.explanation;
  return (
    !project.explanationsInvalidated &&
    !!explanation &&
    explanation.basedOnRevision === project.revision &&
    JSON.stringify(projectDataSchema.parse(explanation.basis)) ===
      JSON.stringify(projectDataSchema.parse(project.data)) &&
    project.data.activities.every((activity) =>
      explanation.entries.some((entry) => entry.activityId === activity.id),
    )
  );
}

export function editProject(
  project: ProjectContributionValue,
  data: ProjectData,
): ProjectContributionValue {
  const next = projectDataSchema.parse(data);
  const changed = JSON.stringify(next) !== JSON.stringify(projectDataSchema.parse(project.data));
  // Preserve raw editor whitespace while typing; normalize only at save/submit.
  return {
    ...project,
    revision: project.revision + (changed ? 1 : 0),
    explanationsInvalidated: project.explanationsInvalidated || (changed && !!project.explanation),
    data: structuredClone(data),
  };
}

export function createProject(): ProjectContributionValue {
  return {
    revision: 1,
    explanationsInvalidated: false,
    data: {
      title: "",
      context: "",
      ownWork: "",
      teamWork: "",
      aiHelp: "",
      activities: [{ id: "activity-1", claim: "", materialId: null, unavailableReason: "" }],
      materials: [],
    },
  };
}

export function projectSubmissionIssue(project: ProjectContributionValue) {
  const data = projectDataSchema.parse(project.data);
  if (!data.title || !data.context || !data.ownWork || !data.teamWork || !data.aiHelp)
    return "Uzupełnij tytuł, kontekst oraz podział pracy własnej, zespołu i pomocy AI. Możesz wpisać, że dany udział nie wystąpił.";
  if (data.activities.some((activity) => !activity.claim))
    return "Opisz każdą deklarowaną czynność.";
  if (
    data.materials.some(
      (material) =>
        data.activities.some((activity) => activity.materialId === material.id) &&
        (!material.title || !material.content),
    )
  )
    return "Uzupełnij tytuł i treść przypisanego materiału albo oznacz, że nie możesz go udostępnić.";
  return "";
}

export function submittedProject(value: ProjectContributionValue) {
  const project = projectSchema.parse(value);
  const issue = projectSubmissionIssue(project);
  if (issue) throw new Error(issue);
  // Unshared material bodies must not become part of the submitted application.
  const materials = project.data.materials.filter((material) =>
    project.data.activities.some((activity) => activity.materialId === material.id),
  );
  const next = editProject(project, { ...project.data, materials });
  // Keep only current explanations in the immutable submission. Stale text is not shared.
  if (!explanationsCurrent(next)) delete next.explanation;
  return projectSchema.parse(next);
}

export const contributionReviewSchema = z.object({
  rationale: text.min(1),
  nextStep: text.min(1),
  reviewerId: identifier,
  savedAt: z.iso.datetime(),
  projectRevision: z.number().int().min(1),
});
export type ContributionReview = z.infer<typeof contributionReviewSchema>;

export const SYNTHETIC_EXPLANATION_LABEL =
  "Objaśnienie demonstracyjne — syntetyczne. Nie potwierdza autorstwa ani kompetencji";
export const STALE_EXPLANATION_LABEL =
  "Brak aktualnego objaśnienia — dane projektu lub materiał zostały zmienione";
