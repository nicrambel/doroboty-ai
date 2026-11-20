import { test, expect, type Page } from "./fixtures";
import AxeBuilder from "@axe-core/playwright";
import { STORAGE_KEY } from "../../src/features/prototype/storage";

async function profile(page: Page) {
  await page.goto("/#/auth/sign-in");
  await page.getByRole("button", { name: "Wejdź jako Anna Kowalska", exact: true }).click();
  await page.goto("/#/app/profil");
}
const persisted = (page: Page) => page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);

test("a second tab cannot overwrite, import or reset; it can resume after the writer closes", async ({
  page,
  context,
}) => {
  await profile(page);
  const second = await context.newPage();
  await second.goto("/#/app/profil");
  await expect(second.getByRole("status")).toContainText(
    "Scenariusz jest otwarty do edycji w innej karcie",
  );
  const old = (await persisted(page))!;
  await page.getByLabel("Imię i nazwisko", { exact: true }).fill("Fikcyjna zmiana z karty A");
  await page.getByRole("button", { name: "Zapisz profil", exact: true }).click();
  const saved = (await persisted(page))!;
  expect(saved).not.toBe(old);
  await second.getByLabel("Nagłówek zawodowy", { exact: true }).fill("Zmiana z karty B");
  await second.getByRole("button", { name: "Zapisz profil", exact: true }).click();
  await expect(second.getByLabel("Nagłówek zawodowy", { exact: true })).toHaveValue(
    "Zmiana z karty B",
  );
  await expect(second.getByText("Profil został zapisany.", { exact: true })).toHaveCount(0);
  expect(await persisted(second)).toBe(saved);
  await second.goto("/#/app/settings");
  const downloading = second.waitForEvent("download");
  await second.getByRole("button", { name: "Eksportuj dane", exact: true }).click();
  expect((await downloading).suggestedFilename()).toBe("doroboty-scenariusz.json");
  await second.getByLabel("Importuj plik scenariusza", { exact: true }).setInputFiles({
    name: "synthetic.json",
    mimeType: "application/json",
    buffer: Buffer.from(old),
  });
  await second.getByRole("button", { name: "Importuj", exact: true }).click();
  expect(await persisted(second)).toBe(saved);
  await expect(second.getByText("Dane zostały zaimportowane.", { exact: true })).toHaveCount(0);
  await second.getByRole("button", { name: "Resetuj scenariusz", exact: true }).click();
  await second.getByRole("button", { name: "Resetuj", exact: true }).click();
  expect(await persisted(second)).toBe(saved);
  await expect(second.getByText("Przywrócono scenariusz początkowy.", { exact: true })).toHaveCount(
    0,
  );
  await page.close();
  await second.reload();
  await second.goto("/#/app/profil");
  await expect(second.getByLabel("Imię i nazwisko", { exact: true })).toHaveValue(
    "Fikcyjna zmiana z karty A",
  );
  await second
    .getByLabel("Nagłówek zawodowy", { exact: true })
    .fill("Bezpieczny zapis po odświeżeniu");
  await second.getByRole("button", { name: "Zapisz profil", exact: true }).click();
  await expect(second.getByText("Profil został zapisany.", { exact: true })).toBeVisible();
  await second.reload();
  await expect(second.getByLabel("Nagłówek zawodowy", { exact: true })).toHaveValue(
    "Bezpieczny zapis po odświeżeniu",
  );
});

test("a storage change outside the cooperative lock is rejected without losing typed text", async ({
  page,
}) => {
  await profile(page);
  await page.evaluate((key) => {
    const next = JSON.parse(localStorage.getItem(key)!);
    next.people[0].name = "Fikcyjny zapis z wcześniejszej wersji aplikacji";
    localStorage.setItem(key, JSON.stringify(next));
  }, STORAGE_KEY);
  const external = await persisted(page);
  await page
    .getByRole("textbox", { name: "O mnie", exact: true })
    .fill("Niezapisany fikcyjny tekst do skopiowania");
  await page.getByRole("button", { name: "Zapisz profil", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Niczego nie nadpisano");
  await expect(page.getByRole("textbox", { name: "O mnie", exact: true })).toHaveValue(
    "Niezapisany fikcyjny tekst do skopiowania",
  );
  expect(await persisted(page)).toBe(external);
});

test("without browser locks, editing stays in memory and export remains available", async ({
  page,
}) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "locks", { value: undefined }));
  await profile(page);
  await expect(page.getByRole("status")).toContainText("Zmiany pozostają tylko w tej karcie");
  await page.getByLabel("Imię i nazwisko", { exact: true }).fill("Fikcyjna praca w pamięci");
  await page.getByRole("button", { name: "Zapisz profil", exact: true }).click();
  expect(await persisted(page)).toBeNull();
  await page.goto("/#/app/settings");
  const downloading = page.waitForEvent("download");
  await page.getByRole("button", { name: "Eksportuj dane", exact: true }).click();
  expect((await downloading).suggestedFilename()).toBe("doroboty-scenariusz.json");
});

test("settings and destructive confirmation have readable default, hover and keyboard states", async ({
  page,
}) => {
  await profile(page);
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#/app/settings");
    const reset = page.getByRole("button", { name: "Resetuj scenariusz", exact: true });
    const violations = async () => (await new AxeBuilder({ page }).analyze()).violations;
    expect(await violations()).toEqual([]);
    await reset.hover();
    await page.waitForTimeout(200);
    expect(await violations()).toEqual([]);
    await page.mouse.move(0, 0);
    await reset.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.getByRole("alertdialog").evaluate(async (element) => {
      await Promise.all(
        element.getAnimations({ subtree: true }).map((animation) => animation.finished),
      );
    });
    expect(await violations()).toEqual([]);
    await page.keyboard.press("Escape");
    await expect(reset).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.screenshot({
      path: `artifacts/launch-inspector/settings-${width}.png`,
      fullPage: true,
    });
  }
});
