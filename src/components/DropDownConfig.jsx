import { useContext, useEffect } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

import { formatDate } from "../lib/formatDate";

export default function DropDownConfig({
  frame,
  setFrame,
  model,
  setModel,
  periodStart,
  dates,
  resetTimer,
}) {
  const { config, setConfig, frames, setFrames, models, regions } =
    useContext(ConfigContext);

  // Regions of product selected
  const modelProductRegions = models
    .find((model) => model.value === frame.model)
    .options.products.find(
      (product) => product.value === frame.product
    ).regions;
  const productRegions = modelProductRegions.map((region) => {
    return {
      label: regions.find((r) => r.value === region).label,
      value: region,
    };
  });

  // Products of model selected
  const modelProducts = models.find((model) => model.value === frame.model)
    .options.products;

  // Groups of product selected
  const modelGroups = model.options.groups;

  // Products of group selected
  const productGroups = modelProducts.filter(
    (product) => product.group === frame.group
  );

  // console.log("models", models)
  // console.log("model", model)
  // console.log("frame", frame)
  // console.log("frame.group", frame.group)
  // console.log("frame.product", frame.product)
  // console.log("modelProductRegions", modelProductRegions)
  // console.log("productRegions", productRegions)
  // console.log("modelProducts", modelProducts)
  // console.log("modelGroups", modelGroups)
  // console.log("productGroups", productGroups)

  const classSelect =
    "py-2 px-2 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";
  // const classRadio = "block shrink-0 mr-1 border border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"

  const handleChangeModel = (e) => {
    const model = models.find((model) => model.value === e.target.value);
    setModel(model);
    resetTimer(model.forecastTime);
    setFrame({
      ...frame,
      model: e.target.value,
      group: model.default.product.group,
      product: model.default.product.value,
      region: model.default.product.region,
      forecastTime: model.forecastTime,
      isPlaying: false,
    });
    setFrames([
      ...frames.slice(0, frame.id - 1),
      {
        ...frame,
        model: e.target.value,
        group: model.default.product.group,
        product: model.default.product.value,
        region: model.default.product.region,
        forecastTime: model.forecastTime,
        isPlaying: false,
      },
      ...frames.slice(frame.id),
    ]);
    setConfig((prev) => ({ ...prev, framesWithImagesLoaded: [] }));
    // console.log("handleChangeModel (model)", model)
    // console.log("handleChangeModel (frame)", frame)
    // console.log("frame.region", frame.region)
    // console.log("model.possibleValues.region", model.possibleValues.region.find(region => region.value === frame.region))
    // console.log("model.possibleValues.region.find", model.possibleValues.region.find(region => region.value === frame.region))
  };

  const handleChangeRegion = (e) => {
    // console.log("handleChangeRegion model", model)
    resetTimer(model.forecastTime);
    setFrame({ ...frame, region: e.target.value, isPlaying: false });
    setFrames([
      ...frames.slice(0, frame.id - 1),
      {
        ...frame,
        region: e.target.value,
        forecastTime: model.forecastTime,
        isPlaying: false,
      },
      ...frames.slice(frame.id),
    ]);
    setConfig((prev) => ({ ...prev, framesWithImagesLoaded: [] }));
  };

  const handleChangeGroup = (e) => {
    const firstProductGroup = modelProducts.find(
      (product) => product.group === e.target.value
    );
    const forecastTime = firstProductGroup.forecastTime ?? model.forecastTime;
    resetTimer(forecastTime);
    setFrame({
      ...frame,
      group: e.target.value,
      product: firstProductGroup.value,
      forecastTime: forecastTime,
      isPlaying: false,
    });
    setFrames([
      ...frames.slice(0, frame.id - 1),
      {
        ...frame,
        group: e.target.value,
        product: firstProductGroup.value,
        forecastTime: forecastTime,
        isPlaying: false,
      },
      ...frames.slice(frame.id),
    ]);
    setConfig((prev) => ({ ...prev, framesWithImagesLoaded: [] }));
    // console.log("DropDownConfig handleChangeGroup periodStart", periodStart)
  };

  const handleChangeProduct = (e) => {
    // console.log("model", model)
    const product = model.options.products.find(
      (product) => product.value === e.target.value
    );
    const forecastTime = product.forecastTime ?? model.forecastTime;
    resetTimer(forecastTime);
    setFrame({ ...frame, product: e.target.value, isPlaying: false });
    setFrames([
      ...frames.slice(0, frame.id - 1),
      {
        ...frame,
        product: e.target.value,
        forecastTime: forecastTime,
        isPlaying: false,
      },
      ...frames.slice(frame.id),
    ]);
    setConfig((prev) => ({ ...prev, framesWithImagesLoaded: [] }));
  };

  const handleChangeInit = (e) => {
    resetTimer(model.forecastTime);
    setFrame({ ...frame, init: e.target.value, isPlaying: false });
    setFrames([
      ...frames.slice(0, frame.id - 1),
      {
        ...frame,
        init: e.target.value,
        forecastTime: model.forecastTime,
        isPlaying: false,
      },
      ...frames.slice(frame.id),
    ]);
    setConfig((prev) => ({ ...prev, framesWithImagesLoaded: [] }));
  };

  // console.log("dates", dates)

  // console.log("frames", frames)
  // console.log("options", model.options)
  // console.log("id", id)
  // console.log("TopFrame (frame)", frame)

  return (
    <div>
      <form>
        <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-md w-60 md:w-72 z-50">
          <div className="border-b border-gray-200 p-4">
            <div className="mb-2">
              <label
                htmlFor="model"
                className="block w-full pb-3 text-sm font-bold"
              >
                Modelo e produto
              </label>
              <select
                name="model"
                id="model"
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
                    name="group"
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
                  name="product"
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
          <div className="border-b border-gray-200 p-4">
            <div className="mb-2">
              <label
                htmlFor="region"
                className="block w-full pb-3 text-sm font-bold"
              >
                Região
              </label>
              <select
                name="region"
                id="region"
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
          <div className="border-b border-gray-200 p-4">
            <div>
              <label
                htmlFor="init"
                className="block w-full pb-3 text-sm font-bold"
              >
                Inicialização
              </label>
              {dates.length > 0 ? (
                <select
                  name="init"
                  id="init"
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
