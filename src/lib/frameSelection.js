import jsonCities from "../data/cities.json";
import { isValidForecastInit } from "./formatDate.js";

const cityIds = new Set(jsonCities.map((city) => city.id));

export function getDefaultProduct(model) {
  if (!model?.options?.products) {
    return null;
  }

  return (
    model.options.products.find(
      (product) => product.value === model.default?.product?.value
    ) ?? model.options.products[0] ?? null
  );
}

export function findProduct(model, productValue) {
  return (
    model?.options?.products?.find((product) => product.value === productValue) ??
    null
  );
}

export function findProductForSelection(model, { productValue, groupValue } = {}) {
  if (!model?.options?.products) {
    return null;
  }

  return (
    findProduct(model, productValue) ??
    model.options.products.find((product) => product.group === groupValue) ??
    getDefaultProduct(model)
  );
}

export function findProductForModelChange(
  targetModel,
  sourceModel,
  sourceProductValue
) {
  const exactProduct = findProduct(targetModel, sourceProductValue);
  if (exactProduct) {
    return { product: exactProduct, preserveSelection: true };
  }

  const configuredFallback =
    targetModel?.compatibility?.productFallbacks?.[sourceModel?.value]?.[
      sourceProductValue
    ];
  const fallbackProduct = findProduct(targetModel, configuredFallback);
  if (fallbackProduct) {
    return { product: fallbackProduct, preserveSelection: true };
  }

  return { product: getDefaultProduct(targetModel), preserveSelection: false };
}

export function hasRegions(product) {
  return Array.isArray(product?.regions) && product.regions.length > 0;
}

export function resolveCity(model, product, preferredCity, fallbackCity) {
  if (hasRegions(product)) {
    return null;
  }

  const candidates = [
    preferredCity,
    product?.defaultCity,
    model?.default?.product?.city,
    model?.defaultCity,
    fallbackCity,
  ];

  for (const candidate of candidates) {
    const cityId =
      typeof candidate === "number"
        ? candidate
        : typeof candidate === "string" && /^\d+$/.test(candidate)
        ? Number(candidate)
        : null;

    if (Number.isInteger(cityId) && cityIds.has(cityId)) {
      return cityId;
    }
  }

  return null;
}

export function resolveRegion(model, product, preferredRegion, fallbackRegion) {
  if (!hasRegions(product)) {
    return null;
  }

  const candidates = [
    preferredRegion,
    product.defaultRegion,
    model.default?.product?.region,
    fallbackRegion,
    product.regions[0],
  ];

  return candidates.find((region) => product.regions.includes(region)) ?? null;
}

function getPeriodValue(product, model, key) {
  return product?.[key] ?? model?.[key];
}

function getRunTurn(init) {
  return typeof init === "string" ? init.slice(11, 13) : null;
}

export function expandForecastInits(dates, model) {
  const filteredDates = Array.isArray(dates)
    ? dates.filter(isValidForecastInit)
    : [];
  const turns = Object.keys(model?.periodsByTurn ?? {}).filter((turn) =>
    /^\d{2}$/.test(turn)
  );
  if (turns.length <= 1) {
    return filteredDates;
  }

  const validDates = [...new Set(filteredDates)];
  const latest00 = validDates
    .filter((date) => getRunTurn(date) === "00")
    .sort((a, b) => b.localeCompare(a))[0];
  const expandedDates = new Set(validDates);

  if (latest00 && turns.length > 1) {
    for (const date of validDates) {
      if (date === latest00 || getRunTurn(date) !== "00") {
        continue;
      }

      for (const turn of turns) {
        if (turn !== "00") {
          expandedDates.add(`${date.slice(0, 10)} ${turn}z`);
        }
      }
    }
  }

  return [...expandedDates].sort((a, b) => b.localeCompare(a));
}

export function getForecastPeriod(model, product, init) {
  const turn = getRunTurn(init);
  const turnPeriod = turn ? model?.periodsByTurn?.[turn] : null;
  const productHasForecastTime = Object.prototype.hasOwnProperty.call(
    product ?? {},
    "forecastTime"
  );

  return {
    periodStart:
      product?.periodStart ?? turnPeriod?.periodStart ?? model?.periodStart,
    periodEnd:
      turnPeriod?.periodEnd ?? getPeriodValue(product, model, "periodEnd"),
    periodHours:
      product?.periodHours ?? turnPeriod?.periodHours ?? model?.periodHours,
    forecastTime: productHasForecastTime
      ? product.forecastTime
      : turnPeriod?.forecastTime ?? model?.forecastTime,
  };
}

export function isForecastTimeValid(model, product, forecastTime, init) {
  if (forecastTime === null || forecastTime === undefined || forecastTime === "") {
    return false;
  }

  const { periodStart, periodEnd, periodHours } = getForecastPeriod(
    model,
    product,
    init
  );

  if (periodStart === undefined || periodEnd === undefined || !periodHours) {
    return true;
  }

  const value = Number(forecastTime);
  const start = Number(periodStart);
  const end = Number(periodEnd);
  const step = Number(periodHours);

  return (
    Number.isFinite(value) &&
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    Number.isFinite(step) &&
    step > 0 &&
    value >= start &&
    value <= end &&
    (value - start) % step === 0
  );
}

export function resolveForecastTime(
  model,
  product,
  preferredForecastTime,
  fallbackForecastTime,
  init
) {
  const period = getForecastPeriod(model, product, init);

  if (product && Object.prototype.hasOwnProperty.call(product, "forecastTime")) {
    if (product.forecastTime === null) {
      return null;
    }

    if (isForecastTimeValid(model, product, preferredForecastTime, init)) {
      return preferredForecastTime;
    }

    return period.forecastTime;
  }

  if (isForecastTimeValid(model, product, preferredForecastTime, init)) {
    return preferredForecastTime;
  }

  if (period.forecastTime !== undefined) {
    return period.forecastTime;
  }

  if (period.periodStart !== undefined) {
    return period.periodStart;
  }

  return fallbackForecastTime ?? null;
}
