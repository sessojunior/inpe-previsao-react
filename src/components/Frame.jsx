import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

import FrameTop from "./FrameTop";
import FrameImage from "./FrameImage";
import { isValidForecastInit } from "../lib/formatDate";

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
  const [datesStatus, setDatesStatus] = useState("loading");
  const [loadingImages, setLoadingImages] = useState(false);
  const [downloadImageUrl, setDownloadImageUrl] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let isCurrentRequest = true;

    setDates([]);
    setDatesStatus("loading");

    if (!model?.urlDates) {
      setDatesStatus("empty");
      return () => {
        isCurrentRequest = false;
      };
    }

    async function fetchUrlDates() {
      try {
        const response = await fetch(model.urlDates, {
          signal: controller.signal,
        });
        if (response.ok === false) {
          throw new Error(`Falha ao carregar datas: HTTP ${response.status}`);
        }
        const data = await response.json();
        if (isCurrentRequest) {
          const nextDates = Array.isArray(data.datesRun)
            ? data.datesRun.filter(isValidForecastInit)
            : [];
          setDates(nextDates);
          setDatesStatus(nextDates.length > 0 ? "ready" : "empty");
        }
      } catch (error) {
        if (error.name === "AbortError" || !isCurrentRequest) {
          return;
        }

        console.error(error);
        setDatesStatus("error");
      }
    }

    fetchUrlDates();

    return () => {
      isCurrentRequest = false;
      controller.abort();
    };
  }, [model?.urlDates, model?.value]);

  useEffect(() => {
    if (
      dates.length === 0 ||
      (frame?.init && dates.includes(frame.init))
    ) {
      return;
    }

    updateFrame(id, { init: dates[0] });
  }, [dates, frame?.init, id, updateFrame]);

  useEffect(() => {
    if (frame && model) {
      return undefined;
    }

    const recoveryTimer = setTimeout(() => {
      resetFrames();
      window.location.reload();
    }, 5000);

    return () => clearTimeout(recoveryTimer);
  }, [frame, model, resetFrames]);

  // Corrigindo bug de values errados no model ou frame
  // Se não foi possível carregar o arquivo JSON de Config.jsx
  if (!frame || !model) {
    console.error(
      "É provável que não tenha sido possível carregar o arquivo models.json ou regions.json em Config.jsx."
    );

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
        datesStatus={datesStatus}
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
