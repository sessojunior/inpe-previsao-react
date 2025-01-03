import { useState, useEffect, useContext } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

import FrameTop from "./FrameTop";
import FrameImage from "./FrameImage";

export default function Frame({ id }) {
  const { config, models, frames, updateLocalFrames } =
    useContext(ConfigContext);

  const [frame, setFrame] = useState(frames.find((item) => item.id === id));

  const [model, setModel] = useState(
    models.find((model) => model.value === frame?.model)
  );

  // Corrigindo bug de values errados no model ou frame
  // Se não foi possível carregar o arquivo JSON de Config.jsx
  if (!frame || !model) {
    console.error(
      "É provável que não tenha sido possível carregar o arquivo models.json ou regions.json em Config.jsx."
    );

    let localFrames = [];
    for (let i = 0; i < 4; i++) {
      localFrames.push({
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
    setTimeout(() => {
      updateLocalFrames(localFrames);
      window.location.reload();
    }, 5000);

    return (
      <div className="p-8 text-red-500">
        Foi feita uma atualização no aplicativo. Aguarde um momento que a página será recarregada novamente.
      </div>
    );
  }

  const [dates, setDates] = useState([]);

  useEffect(() => {
    async function fetchUrlDates() {
      try {
        const response = await fetch(model.urlDates);
        const data = await response.json();
        setDates(data.datesRun);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUrlDates();
  }, [model]);

  let classFrame = "";
  if (config.quantityFrames !== 1) {
    classFrame = "border-r border-b border-gray-r-300";
  }

  const [loadingImages, setLoadingImages] = useState(false);
  const [downloadImageUrl, setDownloadImageUrl] = useState("");

  return (
    <div className={`flex flex-col p-4 w-full hover:bg-gray-50 ${classFrame}`}>
      <FrameTop
        frame={frame}
        setFrame={setFrame}
        model={model}
        setModel={setModel}
        dates={dates}
        loadingImages={loadingImages}
        setLoadingImages={setLoadingImages}
        downloadImageUrl={downloadImageUrl}
      />
      <FrameImage
        frame={frame}
        model={model}
        dates={dates}
        loadingImages={loadingImages}
        setDownloadImageUrl={setDownloadImageUrl}
      />
    </div>
  );
}
