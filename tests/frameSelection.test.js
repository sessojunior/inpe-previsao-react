import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { register } from "node:module";

register(
  `data:text/javascript,${encodeURIComponent(`
    export async function resolve(specifier, context, defaultResolve) {
      const resolved = await defaultResolve(specifier, context, defaultResolve);
      if (resolved.url.endsWith(".json")) {
        return { ...resolved, importAttributes: { type: "json" } };
      }
      return resolved;
    }
  `)}`,
  import.meta.url
);

const {
  expandForecastInits,
  getForecastPeriod,
  resolveForecastTime,
} = await import(
  "../src/lib/frameSelection.js"
);

const models = JSON.parse(
  fs.readFileSync(new URL("../src/data/models.json", import.meta.url), "utf8")
);
const monan = models.find((model) => model.value === "MONAN");
const legacyModel = models.find((model) => model.value !== "MONAN");
const aprec = monan.options.products.find((product) => product.value === "aprec");

test("adds the available MONAN 12Z run when the trigger lists only 00Z", () => {
  assert.deepEqual(
    expandForecastInits(
      ["2026-09-28 00z", "2026-09-27 00z"],
      monan
    ),
    ["2026-09-28 00z", "2026-09-27 12z", "2026-09-27 00z"]
  );
});

test("keeps the original date list behavior for models without per-turn settings", () => {
  const dates = [
    "2026-09-27 00z",
    "2026-09-28 00z",
    "2026-09-27 00z",
  ];

  assert.deepEqual(expandForecastInits(dates, legacyModel), dates);
});

test("uses the MONAN 12Z five-day horizon", () => {
  assert.deepEqual(getForecastPeriod(monan, aprec, "2026-09-27 12z"), {
    periodStart: "012",
    periodEnd: "120",
    periodHours: 3,
    forecastTime: "012",
  });
});

test("keeps the MONAN 00Z seven-day horizon", () => {
  assert.deepEqual(getForecastPeriod(monan, aprec, "2026-09-27 00z"), {
    periodStart: "000",
    periodEnd: "168",
    periodHours: 3,
    forecastTime: "000",
  });
});

test("does not preserve a forecast time outside the selected MONAN run", () => {
  assert.equal(
    resolveForecastTime(monan, aprec, "150", undefined, "2026-09-27 12z"),
    "012"
  );
});

test("builds the MONAN 12Z image path from the selected initialization", () => {
  const init = "2026-09-27 12z";
  const forecastTime = "012";
  const url = monan.urlImage
    .replaceAll("{{model}}", monan.value)
    .replaceAll("{{product}}", aprec.value)
    .replaceAll("{{region}}", "ams")
    .replaceAll("{{year}}", init.slice(0, 4))
    .replaceAll("{{month}}", init.slice(5, 7))
    .replaceAll("{{day}}", init.slice(8, 10))
    .replaceAll("{{turn}}", init.slice(11, 13))
    .replaceAll("{{forecastTime}}", forecastTime);

  assert.equal(
    url,
    "https://s1.cptec.inpe.br/grafico/Modelos/MONAN/pn/aprec/2026/09/27/12/MONAN_aprec_ams_2026092712z_012z.png"
  );
});
