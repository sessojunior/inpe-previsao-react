import { useCallback, useEffect, useRef, useState, createContext } from "react";

import jsonModels from "../data/models.json";
import jsonRegions from "../data/regions.json";
import jsonCities from "../data/cities.json";
import jsonAppConfig from "../data/config.json";
import { isValidForecastInit } from "../lib/formatDate";
import {
  buildFramePathname,
  getInitialModel,
  inspectFramePathname,
} from "../lib/frameUrlState";
import {
  findProductForSelection,
  hasRegions,
  resolveForecastTime,
  resolveCity,
  resolveRegion,
} from "../lib/frameSelection";

export const ConfigContext = createContext({});

const MAX_FRAMES = 4;

function buildDefaultFrame(model, id) {
  const product = findProductForSelection(model, {
    productValue: model.default?.product?.value,
    groupValue: model.default?.product?.group,
  });
  const productHasRegions = hasRegions(product);

  return {
    id,
    model: model.value,
    product: product?.value ?? null,
    group: product?.group ?? null,
    region: productHasRegions
      ? resolveRegion(model, product, model.default?.product?.region, null)
      : null,
    city: productHasRegions
      ? null
      : resolveCity(model, product, model.default?.product?.city, null),
    forecastTime: resolveForecastTime(model, product, null),
    isPlaying: false,
    init: null,
  };
}

function buildDefaultFrames(models) {
  const initialModel = getInitialModel(models);

  return Array.from({ length: MAX_FRAMES }, (_, index) =>
    buildDefaultFrame(initialModel, index + 1)
  );
}

function readJsonStorage(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function normalizeFrame(frame, models, fallbackFrame) {
  const baseFrame =
    fallbackFrame ?? buildDefaultFrame(getInitialModel(models), frame?.id ?? 1);
  const model =
    models.find((item) => item.value === frame?.model) ??
    models.find((item) => item.value === baseFrame.model) ??
    getInitialModel(models);

  const product = findProductForSelection(model, {
    productValue: frame?.product,
    groupValue: frame?.group,
  });

  const productHasRegions = hasRegions(product);
  const region = productHasRegions
    ? resolveRegion(model, product, frame?.region, baseFrame.region)
    : null;

  const city = productHasRegions
    ? null
    : resolveCity(model, product, frame?.city, baseFrame.city);

  return {
    id: baseFrame.id,
    model: model.value,
    product: product.value,
    group: product.group,
    region,
    city,
    forecastTime: resolveForecastTime(
      model,
      product,
      frame?.forecastTime,
      baseFrame.forecastTime
    ),
    isPlaying: Boolean(frame?.isPlaying),
    init: isValidForecastInit(frame?.init) ? frame.init : null,
  };
}

function getPersistedFrame(frame) {
  return {
    id: frame.id,
    model: frame.model,
    product: frame.product,
    group: frame.group,
    region: frame.region,
    city: frame.city ?? null,
    forecastTime: frame.forecastTime,
    init: frame.init ?? null,
  };
}

function sanitizeConfig(config, fallback) {
  const quantityFrames = [1, 2, 3, 4].includes(config?.quantityFrames)
    ? config.quantityFrames
    : fallback.quantityFrames;

  return {
    showHeaderFooter:
      typeof config?.showHeaderFooter === "boolean"
        ? config.showHeaderFooter
        : fallback.showHeaderFooter,
    quantityFrames,
    isAllPlaying: false,
    framesWithImagesLoaded: [],
  };
}

export default function ConfigProvider({ children }) {
  const models = jsonModels;
  const regions = jsonRegions;
  const cities = jsonCities;

  const initialConfig = {
    showHeaderFooter: jsonAppConfig.defaults?.showHeaderFooter ?? true,
    quantityFrames: jsonAppConfig.defaults?.quantityFrames ?? 1,
    isAllPlaying: false, // Se todos os frames estão em play
    framesWithImagesLoaded: [], // Array para armazenar os IDs dos frames que já pré-carregaram as imagens
  };

  const homeFrame = buildDefaultFrames(models)[0];
  const initialRouteState = inspectFramePathname(models, window.location.pathname);
  const shouldCanonicalizeRouteRef = useRef(
    initialRouteState.status !== "invalid"
  );

  const [config, setConfig] = useState(() =>
    sanitizeConfig(readJsonStorage("config"), initialConfig)
  );
  const [activeFrameId, setActiveFrameId] = useState(1);
  const [routeState, setRouteState] = useState(initialRouteState);

  useEffect(() => {
    if (activeFrameId > config.quantityFrames) {
      setActiveFrameId(1);
    }
  }, [activeFrameId, config.quantityFrames]);

  const [frames, setFrames] = useState(() => {
    const defaultFrames = buildDefaultFrames(models);
    const storedFrames = readJsonStorage("framesPrevisao");
    const hydratedFrames = defaultFrames.map((defaultFrame, index) =>
      normalizeFrame(storedFrames?.[index], models, defaultFrame)
    );

    if (initialRouteState.status === "valid") {
      hydratedFrames[0] = normalizeFrame(
        initialRouteState.frame,
        models,
        hydratedFrames[0]
      );
    } else if (initialRouteState.status === "base") {
      hydratedFrames[0] = defaultFrames[0];
    }

    return hydratedFrames;
  });

  const framesRef = useRef(frames);

  useEffect(() => {
    framesRef.current = frames;
  }, [frames]);

  const syncFramePath = useCallback(
    (frame) => {
      const nextPathname = buildFramePathname(models, frame);
      const nextRouteState = inspectFramePathname(models, nextPathname);

      if (window.location.pathname !== nextPathname) {
        window.history.replaceState(null, "", nextPathname);
      }

      setRouteState(nextRouteState);
    },
    [models]
  );

  const persistFrames = useCallback((nextFrames) => {
    localStorage.setItem(
      "framesPrevisao",
      JSON.stringify(nextFrames.map((frame) => getPersistedFrame(frame)))
    );
  }, []);

  const replaceFrames = useCallback(
    (nextFrames, options = {}) => {
      const { persist = true, syncUrl = false } = options;

      framesRef.current = nextFrames;
      setFrames(nextFrames);

      if (persist) {
        persistFrames(nextFrames);
      }

      if (syncUrl && nextFrames[0]) {
        syncFramePath(nextFrames[0]);
      }
    },
    [persistFrames, syncFramePath]
  );

  const updateFrame = useCallback(
    (frameId, updates, options = {}) => {
      const { persist = true, syncUrl = frameId === 1 } = options;
      const nextFrames = framesRef.current.map((frame) => {
        if (frame.id !== frameId) {
          return frame;
        }

        const partialUpdates =
          typeof updates === "function" ? updates(frame) : updates;

        return normalizeFrame({ ...frame, ...partialUpdates }, models, frame);
      });

      replaceFrames(nextFrames, { persist, syncUrl });
    },
    [models, replaceFrames]
  );

  const resetFrames = useCallback(() => {
    replaceFrames(buildDefaultFrames(models), { persist: true, syncUrl: false });
  }, [models, replaceFrames]);

  const goToFrameRoute = useCallback(
    (frame) => {
      updateFrame(1, frame, { persist: true, syncUrl: true });
    },
    [updateFrame]
  );

  const goToHomeRoute = useCallback(() => {
    goToFrameRoute(homeFrame);
  }, [goToFrameRoute, homeFrame]);

  useEffect(() => {
    if (!shouldCanonicalizeRouteRef.current) {
      return;
    }

    shouldCanonicalizeRouteRef.current = false;
    if (framesRef.current[0]) {
      syncFramePath(framesRef.current[0]);
    }
  }, [syncFramePath]);

  useEffect(() => {
    const handlePopState = () => {
      const nextRouteState = inspectFramePathname(models, window.location.pathname);
      setRouteState(nextRouteState);

      if (nextRouteState.status === "invalid") {
        return;
      }

      if (nextRouteState.status === "base") {
        goToFrameRoute(homeFrame);
        return;
      }

      updateFrame(1, nextRouteState.frame, { persist: true, syncUrl: false });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [goToFrameRoute, homeFrame, models, updateFrame]);

  const updateLocalConfig = (config) => {
    const localConfig = sanitizeConfig(config, initialConfig);
    localStorage.setItem("config", JSON.stringify(localConfig));
    setConfig(localConfig);
  };

  const updateLocalFrames = (nextFrames, options = {}) => {
    const normalizedFrames = nextFrames.map((frame, index) =>
      normalizeFrame(
        frame,
        models,
        framesRef.current[index] ?? buildDefaultFrame(getInitialModel(models), index + 1)
      )
    );

    replaceFrames(normalizedFrames, options);
  };

  const startAllTimer = () => {
    console.log("startAllTimer");
    updateLocalConfig({
      ...config,
      isAllPlaying: false, // Manter false no localStorage
      framesWithImagesLoaded: [], // Manter vazio no localStorage
    });
    setConfig((currentConfig) => ({
      ...currentConfig,
      isAllPlaying: true,
      framesWithImagesLoaded: [],
    }));
  };

  const pauseAllTimer = () => {
    updateLocalConfig({
      ...config,
      isAllPlaying: false,
      framesWithImagesLoaded: [],
    });
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
        activeFrameId,
        setActiveFrameId,
        models,
        regions,
        cities,
        frames,
        routeState,
        homeFrame,
        startAllTimer,
        pauseAllTimer,
        goToFrameRoute,
        goToHomeRoute,
        updateFrame,
        updateLocalFrames,
        updateLocalConfig,
        resetFrames,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
