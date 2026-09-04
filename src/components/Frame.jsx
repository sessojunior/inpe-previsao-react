import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

import FrameTop from "./FrameTop";
import FrameImage from "./FrameImage";

export default function Frame({ id }) {
  const {
    config,
    models,
    frames,
    resetFrames,
    updateFrame,
    setActiveFrameId,
  } =
    useContext(ConfigContext);

  const frame = frames.find((item) => item.id === id);
  const model = models.find((item) => item.value === frame?.model);
  const [dates, setDates] = useState([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [downloadImageUrl, setDownloadImageUrl] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    setDates([]);

    if (!model?.urlDates) {
      return () => {
        isCurrentRequest = false;
      };
    }

    async function fetchUrlDates() {
      try {
        const response = await fetch(model.urlDates);
        const data = await response.json();
        if (isCurrentRequest) {
          setDates(Array.isArray(data.datesRun) ? data.datesRun : []);
        }
      } catch (error) {
        if (isCurrentRequest) {
          console.log(error);
        }
      }
    }

    fetchUrlDates();

    return () => {
      isCurrentRequest = false;
    };
  }, [model?.urlDates, model?.value]);

  useEffect(() => {
    if (!frame?.init || dates.length === 0 || dates.includes(frame.init)) {
      return;
    }

    updateFrame(id, { init: dates[0] });
  }, [dates, frame?.init, id, updateFrame]);

  // Corrigindo bug de values errados no model ou frame
  // Se não foi possível carregar o arquivo JSON de Config.jsx
  if (!frame || !model) {
    console.error(
      "É provável que não tenha sido possível carregar o arquivo models.json ou regions.json em Config.jsx."
    );

    setTimeout(() => {
      resetFrames();
      window.location.reload();
    }, 5000);

    return (
      <div className="p-8 text-red-500">
        Foi feita uma atualização no aplicativo. Aguarde um momento que a página será recarregada novamente.
      </div>
    );
  }

  let classFrame = "";
  if (config.quantityFrames !== 1) {
    classFrame = "border-r border-b border-gray-r-300";
  }

  return (
    <div
      className={`flex flex-col p-4 w-full hover:bg-gray-50 ${classFrame}`}
      data-frame-id={id}
      onMouseEnter={() => setActiveFrameId(id)}
      onFocusCapture={() => setActiveFrameId(id)}
    >
      <FrameTop
        frame={frame}
        model={model}
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
