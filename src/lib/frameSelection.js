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

  return (
    candidates.find(
      (city) => city !== null && city !== undefined && city !== ""
    ) ?? null
  );
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

export function isForecastTimeValid(model, product, forecastTime) {
  if (forecastTime === null || forecastTime === undefined || forecastTime === "") {
    return false;
  }

  const periodStart = getPeriodValue(product, model, "periodStart");
  const periodEnd = getPeriodValue(product, model, "periodEnd");
  const periodHours = getPeriodValue(product, model, "periodHours");

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

export function resolveForecastTime(model, product, preferredForecastTime, fallbackForecastTime) {
  if (product && Object.prototype.hasOwnProperty.call(product, "forecastTime")) {
    if (product.forecastTime === null) {
      return null;
    }

    if (isForecastTimeValid(model, product, preferredForecastTime)) {
      return preferredForecastTime;
    }

    return product.forecastTime;
  }

  if (isForecastTimeValid(model, product, preferredForecastTime)) {
    return preferredForecastTime;
  }

  if (model?.forecastTime !== undefined) {
    return model.forecastTime;
  }

  if (product?.periodStart !== undefined) {
    return product.periodStart;
  }

  return fallbackForecastTime ?? null;
}
