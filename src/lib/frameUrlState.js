import jsonAppConfig from "../data/config.json";

const REDIRECT_STORAGE_KEY = "spa-redirect-path";

function trimTrailingSlash(path) {
  if (!path || path === "/") {
    return "";
  }

  return path.endsWith("/") ? path.slice(0, -1) : path;
}

function slugifyText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getDefaultProduct(model) {
  return (
    model?.options?.products.find(
      (product) => product.value === model.default.product.value
    ) ?? model?.options?.products?.[0] ?? null
  );
}

function decodeSegment(segment) {
  try {
    return decodeURIComponent(segment ?? "");
  } catch {
    return segment ?? "";
  }
}

function getPathSegments(pathname) {
  const basePath = getBasePath();
  let relativePath = pathname || "/";

  if (basePath && relativePath === basePath) {
    relativePath = "/";
  } else if (basePath && relativePath.startsWith(`${basePath}/`)) {
    relativePath = relativePath.slice(basePath.length);
  }

  return relativePath
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeSegment(segment));
}

function buildFrameRouteSegments(model, frame) {
  const product =
    model.options.products.find((item) => item.value === frame.product) ??
    getDefaultProduct(model);

  if (!product) {
    return [];
  }

  const locationSlug = frame.city ? `city-${frame.city}` : frame.region;
  if (!locationSlug) {
    return [];
  }

  const segments = [getModelSlug(model), product.value, locationSlug];
  const initSlug = formatInitSlug(frame.init);

  if (initSlug) {
    segments.push(initSlug);
  }

  return segments;
}

export function getBasePath() {
  return trimTrailingSlash(import.meta.env.BASE_URL || "/");
}

export function getModelSlug(model) {
  if (!model) {
    return null;
  }

  if (model.slug) {
    return model.slug;
  }

  const urlDatesMatch = model.urlDates?.match(/\/mod_([^/.]+)\.json$/i);
  if (urlDatesMatch) {
    return urlDatesMatch[1].toLowerCase();
  }

  return slugifyText(model.label || model.value);
}

export function getInitialModel(models) {
  const configuredHomeModelSlug =
    typeof jsonAppConfig?.home?.modelSlug === "string"
      ? jsonAppConfig.home.modelSlug.trim().toLowerCase()
      : null;

  const homeModel = configuredHomeModelSlug
    ? models.find(
        (model) => getModelSlug(model)?.toLowerCase() === configuredHomeModelSlug
      )
    : null;

  return (
    homeModel ?? models[0] ?? null
  );
}

export function formatInitSlug(init) {
  if (!init) {
    return null;
  }

  const match = String(init).match(/^(\d{4}-\d{2}-\d{2}) (\d{2})z$/i);
  if (!match) {
    return null;
  }

  return `${match[1]}-${match[2]}z`;
}

export function parseInitSlug(initSlug) {
  if (!initSlug) {
    return null;
  }

  const match = String(initSlug).match(/^(\d{4}-\d{2}-\d{2})-(\d{2})z$/i);
  if (!match) {
    return null;
  }

  return `${match[1]} ${match[2]}z`;
}

export function buildFramePathname(models, frame) {
  const model =
    models.find((item) => item.value === frame?.model) ?? getInitialModel(models);
  if (!model || !frame) {
    return `${getBasePath() || "/"}/`.replace(/\/\//g, "/");
  }

  const basePath = getBasePath();
  const segments = buildFrameRouteSegments(model, frame);
  if (segments.length === 0) {
    return `${basePath || ""}/`;
  }

  return `${basePath || ""}/${segments
    .map((segment) => encodeURIComponent(segment))
    .join("/")}/`;
}

export function inspectFramePathname(models, pathname) {
  const segments = getPathSegments(pathname);

  if (segments.length === 0) {
    return {
      status: "base",
      pathname,
    };
  }

  if (segments.length < 3 || segments.length > 4) {
    return {
      status: "invalid",
      reason: "shape",
      pathname,
      segments,
    };
  }

  const [modelSlug, selectionSlug, locationSlug, initSlug] = segments;
  const model = models.find((item) => getModelSlug(item) === modelSlug);

  if (!model) {
    return {
      status: "invalid",
      reason: "model",
      pathname,
      segments,
    };
  }

  const directProduct = model.options.products.find(
    (item) => item.value === selectionSlug
  );
  const groupedProducts = model.options.products.filter(
    (product) => product.group === selectionSlug
  );

  if (!directProduct && groupedProducts.length === 0) {
    return {
      status: "invalid",
      reason: "selection",
      pathname,
      segments,
      model,
    };
  }

  if (!directProduct && groupedProducts.length > 1) {
    return {
      status: "invalid",
      reason: "selection",
      pathname,
      segments,
      model,
    };
  }

  const product = directProduct ?? groupedProducts[0] ?? getDefaultProduct(model);

  if (!product) {
    return {
      status: "invalid",
      reason: "selection",
      pathname,
      segments,
      model,
    };
  }

  let region = null;
  let city = null;

  if (locationSlug.startsWith("city-")) {
    const cityId = Number(locationSlug.slice(5));
    if (Number.isInteger(cityId) && cityId > 0) {
      city = cityId;
    } else {
      return {
        status: "invalid",
        reason: "location",
        pathname,
        segments,
        model,
        product,
      };
    }
  } else if (Array.isArray(product.regions) && product.regions.length > 0) {
    if (!product.regions.includes(locationSlug)) {
      return {
        status: "invalid",
        reason: "location",
        pathname,
        segments,
        model,
        product,
      };
    }

    region = locationSlug;
  }

  if (!city && !region) {
    return {
      status: "invalid",
      reason: "location",
      pathname,
      segments,
      model,
      product,
    };
  }

  if (initSlug && !parseInitSlug(initSlug)) {
    return {
      status: "invalid",
      reason: "init",
      pathname,
      segments,
      model,
      product,
    };
  }

  return {
    status: "valid",
    pathname,
    segments,
    model,
    product,
    frame: {
      model: model.value,
      group: product.group,
      product: product.value,
      region,
      city,
      forecastTime:
        product.forecastTime !== undefined
          ? product.forecastTime
          : model.forecastTime,
      init: parseInitSlug(initSlug),
      isPlaying: false,
    },
  };
}

export function parseFramePathname(models, pathname) {
  const inspection = inspectFramePathname(models, pathname);
  return inspection.status === "valid" ? inspection.frame : null;
}

export function restoreSpaRedirectPath() {
  const redirectPath = sessionStorage.getItem(REDIRECT_STORAGE_KEY);
  if (!redirectPath) {
    return;
  }

  sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
  window.history.replaceState(null, "", redirectPath);
}

export function getSpaRedirectStorageKey() {
  return REDIRECT_STORAGE_KEY;
}