import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import {
  initialState,
  transition,
  candidateApplicationView,
  stateSchema,
  type State,
  type Action,
} from "./model";
import {
  createProject,
  editProject,
  explanationsCurrent,
  projectSchema,
  projectSubmissionIssue,
  submittedProject,
  STALE_EXPLANATION_LABEL,
} from "./project-contribution-model";
import {
  parseState,
  readState,
  saveState,
  serializeState,
  STORAGE_KEY,
  LEGACY_STORAGE_KEY,
} from "./storage";
import { ProjectContribution } from "./project-contribution";
import { ApplicationRecord } from "./application-record";

const now = "2026-11-13T12:00:00.000Z";
function select(state: State, id: string) {
  return transition(state, { type: "select_person", id });
}
function demoState() {
  return select(transition(initialState(), { type: "load_i1_demo" }), "candidate-alicja-i1");
}
function demoDraft(state = demoState()) {
  return state.drafts.find((item) => item.candidateId === "candidate-alicja-i1")!;
}
function submit(state = demoState()) {
  const draft = demoDraft(state);
  return transition(
    state,
    {
      type: "submit",
      jobId: draft.jobId,
      notes: draft.notes,
      generated: draft.generated,
      answer: draft.answer,
      consent: true,
      project: draft.project,
    },
    now,
    "application-alicja",
  );
}
function memory(entries: [string, string][] = []) {
  const values = new Map(entries);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}
function legacy() {
  const { loadedDemos: _loadedDemos, ...state } = initialState();
  void _loadedDemos;
  return { ...state, version: 1 };
}

describe("project contribution domain and integrated local scenario", () => {
  it("loads exact approved declarations, M1–M3, unknowns and the corrected fourth activity", () => {
    const draft = demoDraft();
    const project = draft.project!;
    expect(project.data.title).toBe("Porządkowanie wiadomości w firmie Papierowy Most");
    expect(project.data.activities.map((item) => item.materialId)).toEqual([
      "M1",
      "M2",
      "M3",
      null,
    ]);
    expect(project.data.activities[3].claim).toBe(
      "Rozwiązanie działało w pilotażu; integrację wykonał programista",
    );
    expect(project.explanation?.entries[3].unknowns).toContain("wkład programisty");
    expect(explanationsCurrent(project)).toBe(true);
    expect(projectSubmissionIssue(project)).toBe("");
    const sent = submit().applications.at(-1)!;
    expect(explanationsCurrent(sent.project!)).toBe(true);
    expect(sent.project?.explanation?.entries[3]).toEqual(project.explanation?.entries[3]);
  });

  it("loads additively and idempotently without overwriting edited personas, drafts or applications", () => {
    const baseline = initialState();
    let state = demoState();
    expect(state.applications).toEqual(baseline.applications);
    expect(state.jobs).toEqual(baseline.jobs);
    expect(state.people.slice(0, baseline.people.length)).toEqual(baseline.people);
    state = transition(state, {
      type: "profile",
      value: {
        name: "Alicja po edycji",
        headline: "Przykład",
        bio: "Poprawiona biografia",
        location: "Łódź",
      },
    });
    const draft = demoDraft(state);
    state = transition(state, {
      ...draft,
      type: "draft",
      answer: "Poprawiona odpowiedź demonstracyjna.",
    });
    expect(transition(state, { type: "load_i1_demo" })).toEqual(state);
    const sent = submit(state);
    expect(transition(sent, { type: "load_i1_demo" })).toEqual(sent);
    expect(sent.applications.at(-1)?.score).toBeNull();
    expect(sent.people.find((person) => person.id === "employer-ewa-i1")?.companyId).toBe(
      sent.applications.at(-1)?.companyId,
    );
  });

  it("rejects identifier collisions and unavailable demo dependencies without changing input", () => {
    const state = initialState();
    state.people[0].id = "candidate-alicja-i1";
    const before = structuredClone(state);
    expect(() => transition(state, { type: "load_i1_demo" })).toThrow("zajęte");
    expect(state).toEqual(before);
    const other = initialState();
    other.jobs[0].publicationStatus = "archived";
    expect(() => transition(other, { type: "load_i1_demo" })).toThrow("wymaga");
  });

  it("supports a new optional project and incomplete draft without accepting an incomplete submission", () => {
    const state = demoState();
    const draft = demoDraft(state);
    const project = createProject();
    const saved = transition(state, { ...draft, type: "draft", project });
    expect(parseState(serializeState(saved)).drafts[0].project).toEqual(project);
    expect(() => transition(saved, { type: "submit", ...draft, consent: true, project })).toThrow(
      "Uzupełnij",
    );
    expect(() => submittedProject({ ...project, data: { ...project.data, title: "   " } })).toThrow(
      "Uzupełnij",
    );
  });

  for (const field of ["title", "context", "ownWork", "teamWork", "aiHelp"] as const) {
    it(`invalidates every explanation after editing ${field}, including a later reversion`, () => {
      const original = demoDraft().project!;
      const edited = editProject(original, {
        ...original.data,
        [field]: `${original.data[field]} zmiana`,
      });
      const reverted = editProject(edited, original.data);
      expect(explanationsCurrent(edited)).toBe(false);
      expect(explanationsCurrent(reverted)).toBe(false);
      expect(explanationsCurrent(original)).toBe(true);
    });
  }

  it("allows spaces while editing and keeps whitespace-only normalization non-substantive", () => {
    const original = demoDraft().project!;
    const edited = editProject(original, { ...original.data, title: original.data.title + " " });
    expect(edited.data.title.endsWith(" ")).toBe(true);
    expect(explanationsCurrent(edited)).toBe(true);
    expect(projectSchema.parse(edited).data.title).toBe(original.data.title);
  });

  it("invalidates on declaration, material title/content, link and unavailable-reason edits", () => {
    const original = demoDraft().project!;
    const changes = [
      {
        ...original.data,
        activities: original.data.activities.map((item, index) =>
          index === 0 ? { ...item, claim: "Inna czynność" } : item,
        ),
      },
      {
        ...original.data,
        materials: original.data.materials.map((item, index) =>
          index === 0 ? { ...item, content: "Zmieniony materiał" } : item,
        ),
      },
      {
        ...original.data,
        materials: original.data.materials.map((item, index) =>
          index === 0 ? { ...item, title: "Inny tytuł" } : item,
        ),
      },
      {
        ...original.data,
        activities: original.data.activities.map((item, index) =>
          index === 0 ? { ...item, materialId: "M2" } : item,
        ),
      },
      {
        ...original.data,
        activities: original.data.activities.map((item, index) =>
          index === 3 ? { ...item, unavailableReason: "Inny powód" } : item,
        ),
      },
    ];
    for (const data of changes)
      expect(explanationsCurrent(editProject(original, data))).toBe(false);
  });

  it("rechecks stale explanation bases on import/read, even if the imported revision and flag claim freshness", () => {
    const state = demoState();
    const project = demoDraft(state).project!;
    project.data.materials[0].content = "Inna treść pod tym samym M1";
    project.explanationsInvalidated = false;
    const raw = JSON.stringify(state);
    const imported = parseState(raw);
    expect(demoDraft(imported).project?.explanationsInvalidated).toBe(true);
    expect(explanationsCurrent(demoDraft(imported).project!)).toBe(false);
    const loaded = readState(memory([[STORAGE_KEY, raw]]));
    expect(explanationsCurrent(demoDraft(loaded.state).project!)).toBe(false);
    const html = renderToStaticMarkup(
      createElement(ProjectContribution, { project: demoDraft(imported).project! }),
    );
    expect(html).toContain(STALE_EXPLANATION_LABEL);
    expect(html).not.toContain(project.explanation!.entries[0].explanation);
  });

  it("persists drafts, freezes sent snapshots and omits unshared bodies and stale explanations", () => {
    let state = demoState();
    const draft = demoDraft(state);
    const original = draft.project!;
    const project = editProject(original, {
      ...original.data,
      activities: original.data.activities.map((item, i) =>
        i === 0 ? { ...item, materialId: null, unavailableReason: "Nie udostępniam" } : item,
      ),
    });
    state = transition(state, { ...draft, type: "draft", project });
    const storage = memory();
    saveState(storage, state);
    state = submit(readState(storage).state);
    const application = state.applications.at(-1)!;
    expect(application.project?.data.materials.map((item) => item.id)).toEqual(["M2", "M3"]);
    expect(application.project?.explanation).toBeUndefined();
    expect(application.project?.explanationsInvalidated).toBe(true);
    const frozen = structuredClone(application);
    original.data.title = "Zmieniony obiekt źródłowy";
    state = transition(state, {
      type: "profile",
      value: { name: "Inne imię", headline: "Inny nagłówek", bio: "", location: "Kraków" },
    });
    state = transition(state, { ...draft, type: "draft", project: original });
    expect(state.applications.at(-1)).toEqual(frozen);
    expect(parseState(serializeState(state)).applications.at(-1)).toEqual(frozen);
  });

  it("requires approval, prevents duplicates and preserves ordinary applications without I1", () => {
    const state = demoState();
    const draft = demoDraft(state);
    expect(() => transition(state, { type: "submit", ...draft, consent: false })).toThrow(
      "Zatwierdź",
    );
    expect(() => transition(submit(state), { type: "submit", ...draft, consent: true })).toThrow(
      "już wysłana",
    );
    const ordinary = transition(state, {
      type: "submit",
      jobId: draft.jobId,
      notes: "",
      generated: "",
      answer: draft.answer,
      consent: true,
    });
    expect(ordinary.applications.at(-1)?.project).toBeUndefined();
  });

  it("submits a newly authored project with unavailable materials and no fabricated explanation", () => {
    const state = demoState();
    const draft = demoDraft(state);
    const empty = createProject();
    const project = editProject(empty, {
      ...empty.data,
      title: "Własny fikcyjny projekt",
      context: "Scenariusz demonstracyjny",
      ownWork: "Opisałam reguły",
      teamWork: "Zespół wdrażał",
      aiHelp: "AI proponowało kategorie",
      activities: [
        { id: "activity-1", claim: "Opisałam reguły", materialId: null, unavailableReason: "" },
      ],
    });
    const sent = transition(state, {
      type: "submit",
      ...draft,
      project,
      consent: true,
    }).applications.at(-1)!;
    expect(sent.project?.data.materials).toEqual([]);
    expect(sent.project?.explanation).toBeUndefined();
    const html = renderToStaticMarkup(
      createElement(ProjectContribution, { project: sent.project! }),
    );
    expect(html).toContain("Brak przygotowanego objaśnienia");
    expect(html).toContain("Nie mogę udostępnić materiału");
  });

  it("renders material text safely rather than interpreting markup", () => {
    const original = demoDraft().project!;
    const project = editProject(original, {
      ...original.data,
      materials: original.data.materials.map((item, i) =>
        i === 0 ? { ...item, content: '<script>alert("example")</script>' } : item,
      ),
    });
    const html = renderToStaticMarkup(createElement(ProjectContribution, { project }));
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("saves employer rationale and next step without advancing stages or exposing private fields to candidates", () => {
    const state = select(submit(), "employer-ewa-i1");
    const action: Action = {
      type: "contribution_review",
      applicationId: "application-alicja",
      rationale: "Prywatne uzasadnienie Ewy",
      nextStep: "Prywatne pytanie do konsultanta",
    };
    let reviewed = transition(state, action, now);
    const application = reviewed.applications.at(-1)!;
    expect(application.stage).toBe("submitted");
    expect(application.events).toEqual(state.applications.at(-1)!.events);
    expect(application.contributionReview?.reviewerId).toBe("employer-ewa-i1");
    expect(parseState(serializeState(reviewed)).applications.at(-1)?.contributionReview).toEqual(
      application.contributionReview,
    );
    reviewed = transition(
      reviewed,
      {
        type: "stage",
        applicationId: application.id,
        stage: "reviewed",
        note: "Prywatna notatka etapu",
      },
      now,
    );
    const visible = candidateApplicationView(reviewed.applications.at(-1)!);
    const candidateJson = JSON.stringify(visible);
    for (const privateText of [
      action.rationale,
      action.nextStep,
      "Prywatna notatka etapu",
      "sourceNotes",
      "generatedAnswer",
      "contributionReview",
    ])
      expect(candidateJson).not.toContain(privateText);
    const html = renderToStaticMarkup(
      createElement(
        MemoryRouter,
        null,
        createElement(ApplicationRecord, {
          application: visible,
          audience: "candidate",
          companyName: "BrightLabs",
          history: visible.events,
        }),
      ),
    );
    expect(html).not.toContain(action.rationale);
    expect(html).not.toContain(action.nextStep);
    expect(() => transition(select(reviewed, "candidate-alicja-i1"), action)).toThrow("pracodawcy");
    expect(() => transition(select(reviewed, "employer-northstar"), action)).toThrow("zgłoszenia");
    expect(() => transition(reviewed, { ...action, rationale: " " })).toThrow();
    const terminal = transition(reviewed, {
      type: "stage",
      applicationId: application.id,
      stage: "rejected",
      note: "",
    });
    expect(() => transition(terminal, action)).toThrow("zgłoszenia");
  });

  it("rejects invalid references, duplicated material IDs and broken review ownership", () => {
    const state = demoState();
    const project = demoDraft(state).project!;
    const broken = structuredClone(project);
    broken.data.activities[0].materialId = "missing";
    expect(projectSchema.safeParse(broken).success).toBe(false);
    broken.data.activities[0].materialId = "M1";
    broken.data.materials.push(broken.data.materials[0]);
    expect(projectSchema.safeParse(broken).success).toBe(false);
    const reviewed = transition(select(submit(), "employer-ewa-i1"), {
      type: "contribution_review",
      applicationId: "application-alicja",
      rationale: "Uzasadnienie",
      nextStep: "Pytanie",
    });
    reviewed.applications.at(-1)!.contributionReview!.reviewerId = "candidate-alicja-i1";
    expect(stateSchema.safeParse(reviewed).success).toBe(false);
  });

  it("renders the same declarations and available materials in both future E1 presentations, without stale interpretations", () => {
    const project = demoDraft().project!;
    const plain = renderToStaticMarkup(
      createElement(ProjectContribution, { project, presentation: "plain" }),
    );
    const i1 = renderToStaticMarkup(
      createElement(ProjectContribution, { project, presentation: "i1" }),
    );
    for (const activity of project.data.activities) {
      expect(plain).toContain(activity.claim);
      expect(i1).toContain(activity.claim);
    }
    for (const material of project.data.materials) {
      expect(plain).toContain(material.content);
      expect(i1).toContain(material.content);
    }
    expect(plain).not.toContain(project.explanation!.entries[0].explanation);
    expect(i1).toContain("Nie potwierdza autorstwa ani kompetencji");
    expect(i1).toContain(project.explanation!.entries[0].explanation);
    expect(i1).toContain("Czego nie ustalono");
  });
});

describe("v1 migration and v2 recovery", () => {
  it("migrates old saved scenarios and imports while retaining the original v1 bytes", () => {
    const raw = JSON.stringify(legacy());
    const storage = memory([[LEGACY_STORAGE_KEY, raw]]);
    const loaded = readState(storage);
    expect(loaded.blocked).toBe(false);
    expect(loaded.state).toEqual(initialState());
    expect(loaded.state.applications[0].project).toBeUndefined();
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBe(raw);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    saveState(storage, loaded.state);
    expect(storage.getItem(LEGACY_STORAGE_KEY)).toBe(raw);
    expect(JSON.parse(storage.getItem(STORAGE_KEY)!).version).toBe(2);
    expect(parseState(raw)).toEqual(initialState());
  });

  it("gives v2 precedence and protects corrupt/future saves rather than falling back to v1", () => {
    const old = JSON.stringify(legacy());
    for (const raw of ["", "{", JSON.stringify({ ...initialState(), version: 99 })]) {
      const storage = memory([
        [LEGACY_STORAGE_KEY, old],
        [STORAGE_KEY, raw],
      ]);
      const loaded = readState(storage);
      expect(loaded.blocked).toBe(true);
      expect(loaded.original).toBe(raw);
      expect(storage.getItem(STORAGE_KEY)).toBe(raw);
    }
    const storage = memory([
      [LEGACY_STORAGE_KEY, old],
      [STORAGE_KEY, serializeState(demoState())],
    ]);
    expect(readState(storage).state.people.some((item) => item.id === "candidate-alicja-i1")).toBe(
      true,
    );
  });

  it("rejects mislabeled I1 imports and leaves the previous serialized state untouched", () => {
    const state = demoState();
    const storage = memory();
    saveState(storage, state);
    const before = storage.getItem(STORAGE_KEY);
    const mislabeled = { ...state, version: 1 };
    expect(() => parseState(JSON.stringify(mislabeled))).toThrow("Dotychczasowy stan");
    const broken = structuredClone(state);
    demoDraft(broken).project!.data.activities[0].materialId = "missing";
    expect(() => parseState(JSON.stringify(broken))).toThrow();
    expect(storage.getItem(STORAGE_KEY)).toBe(before);
  });
});
