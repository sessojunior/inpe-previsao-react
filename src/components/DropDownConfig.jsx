import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

import { formatDate } from "../lib/formatDate";
import {
  findProduct,
  findProductForModelChange,
  findProductForSelection,
  resolveCity,
  resolveForecastTime,
  resolveRegion,
} from "../lib/frameSelection";

import ComboBox from "./ComboBox";

export default function DropDownConfig({
  frame,
  model,
  dates,
  resetTimer,
  isInputFocused,
  setIsInputFocused,
}) {
  const {
    config,
    models,
    regions,
    cities,
    updateLocalConfig,
    updateFrame,
  } = useContext(ConfigContext);

  // Cities
  const [selectedCity, setSelectedCity] = useState("");
  // City selected
  const cityUf = useCallback(() => {
    const city = cities.find((city) => city.id === frame.city);
    return city ? `${city.name} - ${city.uf}` : "";
  }, [cities, frame.city]);

  useEffect(() => {
    setSelectedCity(frame.city ? cityUf() : "");
  }, [cityUf, frame.city]);

  // Regions of product selected
  const modelProductRegions = useMemo(() => {
    const model = models.find((model) => model.value === frame.model);
    return (
      model?.options.products.find((product) => product.value === frame.product)
        ?.regions || []
    ); // Retorna um array vazio se não houver regiões
  }, [models, frame.model, frame.product]);

  const productRegions = useMemo(() => {
    return modelProductRegions.map((region) => ({
      label: regions.find((r) => r.value === region)?.label || "", // Usando optional chaining para evitar erros
      value: region,
    }));
  }, [modelProductRegions, regions]);

  // Products of model selected
  const modelProducts = useMemo(() => {
    return (
      models.find((model) => model.value === frame.model)?.options.products ||
      []
    );
  }, [models, frame.model]);

  // Groups of product selected
  const modelGroups = useMemo(() => model.options.groups, [model]);

  // Products of group selected
  const productGroups = useMemo(() => {
    return modelProducts.filter((product) => product.group === frame.group);
  }, [modelProducts, frame.group]);

  const classSelect =
    "py-2 px-2 block w-full border border-gray-200 rounded-lg text-sm focus:border-black focus:outline-2 disabled:opacity-50 disabled:pointer-events-none";
  const controlIds = {
    model: `model-${frame.id}`,
    group: `group-${frame.id}`,
    product: `product-${frame.id}`,
    region: `region-${frame.id}`,
    city: `city-${frame.id}`,
    init: `init-${frame.id}`,
  };
  // const classRadio = "block shrink-0 mr-1 border border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"

  const handleChangeModel = useCallback(
    (e) => {
      const nextModel = models.find((item) => item.value === e.target.value);
      if (!nextModel) {
        return;
      }

      const { product: nextProduct, preserveSelection } =
        findProductForModelChange(nextModel, model, frame.product);
      if (!nextProduct) {
        return;
      }

      const preferredRegion = preserveSelection ? frame.region : null;
      const preferredCity = preserveSelection ? frame.city : null;
      const forecastTime = resolveForecastTime(
        nextModel,
        nextProduct,
        preserveSelection ? frame.forecastTime : null
      );
      const region = resolveRegion(
        nextModel,
        nextProduct,
        preferredRegion,
        null
      );
      const city = resolveCity(nextModel, nextProduct, preferredCity, null);

      resetTimer(forecastTime);
      updateFrame(frame.id, {
        model: nextModel.value,
        group: nextProduct.group,
        product: nextProduct.value,
        region,
        forecastTime,
        isPlaying: false,
        city,
        init: null,
      });
      updateLocalConfig({
        ...config,
        framesWithImagesLoaded: [],
      });
    },
    [
      config,
      frame.city,
      frame.forecastTime,
      frame.id,
      frame.product,
      frame.region,
      model,
      models,
      resetTimer,
      updateFrame,
      updateLocalConfig,
    ]
  );

  const handleCitySelected = useCallback(
    (id) => {
      const product = findProduct(model, frame.product);
      const forecastTime = resolveForecastTime(
        model,
        product,
        frame.forecastTime
      );
      resetTimer(forecastTime);
      updateFrame(frame.id, {
        isPlaying: false,
        city: id,
        region: null,
        forecastTime,
      });
      updateLocalConfig({
        ...config,
        framesWithImagesLoaded: [],
      });
    },
    [
      config,
      frame.id,
      frame.product,
      frame.forecastTime,
      model,
      resetTimer,
      updateFrame,
      updateLocalConfig,
    ]
  );

  const handleChangeRegion = useCallback(
    (e) => {
      const product = findProduct(model, frame.product);
      const forecastTime = resolveForecastTime(
        model,
        product,
        frame.forecastTime
      );
      resetTimer(forecastTime);
      updateFrame(frame.id, {
        region: e.target.value,
        forecastTime,
        isPlaying: false,
        city: null,
      });
      updateLocalConfig({
        ...config,
        framesWithImagesLoaded: [],
      });
    },
    [
      config,
      frame.id,
      frame.product,
      frame.forecastTime,
      model,
      resetTimer,
      updateFrame,
      updateLocalConfig,
    ]
  );

  const handleChangeGroup = useCallback(
    (e) => {
      const nextProduct = findProductForSelection(model, {
        groupValue: e.target.value,
      });
      if (!nextProduct) {
        return;
      }

      const forecastTime = resolveForecastTime(
        model,
        nextProduct,
        frame.forecastTime
      );
      resetTimer(forecastTime);
      updateFrame(frame.id, {
        group: nextProduct.group,
        product: nextProduct.value,
        forecastTime,
        isPlaying: false,
      });
      updateLocalConfig({
        ...config,
        framesWithImagesLoaded: [],
      });
    },
    [
      config,
      frame.forecastTime,
      frame.id,
      model,
      resetTimer,
      updateFrame,
      updateLocalConfig,
    ]
  );

  const handleChangeProduct = useCallback(
    (e) => {
      const product = findProduct(model, e.target.value);
      if (!product) {
        return;
      }

      const forecastTime = resolveForecastTime(
        model,
        product,
        frame.forecastTime
      );
      resetTimer(forecastTime);
      updateFrame(frame.id, {
        product: product.value,
        group: product.group,
        forecastTime,
        isPlaying: false,
      });
      updateLocalConfig({
        ...config,
        framesWithImagesLoaded: [],
      });
    },
    [
      config,
      frame.forecastTime,
      frame.id,
      model,
      resetTimer,
      updateFrame,
      updateLocalConfig,
    ]
  );

  const handleChangeInit = useCallback(
    (e) => {
      const product = findProduct(model, frame.product);
      const forecastTime = resolveForecastTime(
        model,
        product,
        frame.forecastTime
      );
      resetTimer(forecastTime);
      updateFrame(frame.id, {
        init: e.target.value,
        forecastTime,
        isPlaying: false,
      });
      updateLocalConfig({
        ...config,
        framesWithImagesLoaded: [],
      });
    },
    [
      config,
      frame.id,
      frame.product,
      frame.forecastTime,
      model,
      resetTimer,
      updateFrame,
      updateLocalConfig,
    ]
  );

  return (
    <div>
      <form>
        <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-md w-60 md:w-72 z-50">
          <div className="border-b border-gray-200 p-4">
            <div className="mb-2">
              <label
                htmlFor={controlIds.model}
                className="block w-full pb-3 text-sm font-bold"
              >
                Modelo e produto
              </label>
              <select
                name={controlIds.model}
                id={controlIds.model}
                value={frame.model}
                onChange={(e) => handleChangeModel(e)}
                className={classSelect}
              >
                {models.map((model, index) => (
                  <option key={index} value={model.value}>
                    {model.label}
                  </option>
                ))}
              </select>
            </div>
            {frame.model !== frame.product && (
              <>
                <div className="mb-2">
                  <select
                    name={controlIds.group}
                    id={controlIds.group}
                    value={frame.group}
                    onChange={(e) => handleChangeGroup(e)}
                    className={classSelect}
                  >
                    {modelGroups.map((group, index) => (
                      <option key={index} value={group.value}>
                        {group.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {productGroups.length > 1 && (
              <div>
                <select
                  name={controlIds.product}
                  id={controlIds.product}
                  value={frame.product}
                  onChange={(e) => handleChangeProduct(e)}
                  className={classSelect}
                >
                  {productGroups.map((product, index) => (
                    <option key={index} value={product.value}>
                      {product.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          {modelProductRegions.length > 0 ? (
            <div className="border-b border-gray-200 p-4">
              <div className="mb-2">
                <label
                  htmlFor={controlIds.region}
                  className="block w-full pb-3 text-sm font-bold"
                >
                  Região
                </label>
                <select
                  name={controlIds.region}
                  id={controlIds.region}
                  value={frame.region}
                  onChange={(e) => handleChangeRegion(e)}
                  autoComplete="off"
                  className={classSelect}
                >
                  {productRegions.map((region, index) => (
                    <option key={index} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="border-b border-gray-200 p-4">
              <div className="mb-2">
                <label
                  htmlFor={controlIds.city}
                  className="block w-full pb-3 text-sm font-bold"
                >
                  Cidade
                </label>
                <ComboBox
                  cities={cities}
                  selectedCity={selectedCity.length > 0 ? selectedCity : ""}
                  setSelectedCity={setSelectedCity}
                  onCitySelected={handleCitySelected} // Passa a função para receber o id
                  isInputFocused={isInputFocused}
                  setIsInputFocused={setIsInputFocused}
                  inputId={controlIds.city}
                />
              </div>
            </div>
          )}
          <div className="border-b border-gray-200 p-4">
            <div>
              <label
                htmlFor={controlIds.init}
                className="block w-full pb-3 text-sm font-bold"
              >
                Inicialização
              </label>
              {dates.length > 0 ? (
                <select
                  name={controlIds.init}
                  id={controlIds.init}
                  value={frame.init === null ? dates[0] : frame.init}
                  onChange={(e) => handleChangeInit(e)}
                  className={classSelect}
                >
                  {dates.map((date, index) => (
                    <option key={index} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
              ) : (
                <p>Carregando...</p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
