import { useState, useEffect, createContext } from "react";

import jsonModels from "../data/models.json";
import jsonRegions from "../data/regions.json";
import jsonCities from "../data/cities.json";

export const ConfigContext = createContext({});

export default function ConfigProvider({ children }) {
  const models = jsonModels;
  const regions = jsonRegions;
  const cities = jsonCities;

  let initialConfig = {
    showHeaderFooter: true,
    quantityFrames: 1,
    isAllPlaying: false, // Se todos os frames estão em play
    framesWithImagesLoaded: [], // Array para armazenar os IDs dos frames que já pré-carregaram as imagens
  };
  const [config, setConfig] = useState(
    JSON.parse(localStorage.getItem("config")) || initialConfig
  );

  let initialFrames = [];
  for (let i = 0; i < 4; i++) {
    initialFrames.push({
      id: i + 1,
      model: models[0].value,
      product: models[0].default.product.value,
      group: models[0].default.product.group,
      region: models[0].default.product.region,
      city: null,
      forecastTime: models[0].forecastTime,
      isPlaying: false,
      init: null,
    });
  }
  const [frames, setFrames] = useState(
    JSON.parse(localStorage.getItem("framesPrevisao")) || initialFrames
  );

  const updateLocalConfig = (config) => {
    const localConfig = {
      showHeaderFooter: config.showHeaderFooter,
      quantityFrames: config.quantityFrames,
      isAllPlaying: false, // Sempre false
      framesWithImagesLoaded: [], // Sempre vazio
    };
    console.log("localConfig", localConfig);
    localStorage.setItem("config", JSON.stringify(config));
    setConfig(localConfig);
  };

  const updateLocalFrames = (frames) => {
    const localFrames = frames.map((frame) => ({
      id: frame.id,
      model: frame.model,
      product: frame.product,
      group: frame.group,
      region: frame.region,
      city: frame.city ?? null,
      forecastTime: frame.forecastTime,
    }));
    localStorage.setItem("framesPrevisao", JSON.stringify(localFrames));
    setFrames(localFrames);
  };

  const startAllTimer = () => {
    console.log("startAllTimer");
    const localConfig = {
      ...config,
      isAllPlaying: true,
      framesWithImagesLoaded: [],
    };
    updateLocalConfig({
      ...config,
      isAllPlaying: false, // Manter false no localStorage
      framesWithImagesLoaded: [], // Manter vazio no localStorage
    });
    setConfig(localConfig);
  };

  const pauseAllTimer = () => {
    const localConfig = {
      ...config,
      isAllPlaying: false,
      framesWithImagesLoaded: [],
    };
    updateLocalConfig(localConfig);
    setConfig(localConfig);
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        setConfig,
        models,
        regions,
        cities,
        frames,
        startAllTimer,
        pauseAllTimer,
        updateLocalFrames,
        updateLocalConfig,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
