import { useEffect, useState, useContext } from "react";

import ImageNotFound from "../assets/not-found.png";
import FrameCharts from "./FrameCharts";

export default function FrameImage({
  frame,
  model,
  dates,
  loadingImages,
  setDownloadImageUrl,
}) {
  const [loading, setLoading] = useState(false);

  // Se o período que inicia ou termina for específico para o produto, por exemplo, um produto que inicia em "024", obtém a partir do produto o período de horas que o mesmo roda.
  const product =
    model.options.products.find((product) => product.value === frame.product) ||
    model.options.products[0];
  const periodStart = product.periodStart ?? model.periodStart;

  const publicImage = ImageNotFound;
  const init = frame.init ?? dates[0];
  const year = init?.slice(0, 4);
  const month = init?.slice(5, 7);
  const day = init?.slice(8, 10);
  const turn = init?.slice(11, 13);
  const forecastTime = frame.forecastTime ?? periodStart;

  const urlImage = model?.urlImage
    .replaceAll("{{model}}", model?.value)
    .replaceAll("{{region}}", frame?.region ?? frame?.city)
    .replaceAll("{{product}}", frame?.product)
    .replaceAll(
      "_{{forecastTime}}z",
      frame?.forecastTime ? `_${forecastTime}z` : ""
    )
    .replaceAll("{{timeRun}}", model?.timeRun)
    .replaceAll("{{turn}}", turn)
    .replaceAll("{{year}}", year)
    .replaceAll("{{month}}", month)
    .replaceAll("{{day}}", day);

  const altImage = `${frame?.model} - ${frame?.region}`;

  useEffect(() => {
    const loadImage = async () => {
      setLoading(true);

      try {
        const img = new Image();
        img.src = urlImage;
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(urlImage);
          img.onerror = () =>
            reject(
              new Error(
                `Erro ao carregar a imagem do frame ${frame.id}: ${urlImage}`
              )
            );
        });
      } catch (error) {
        //console.error(error);
      } finally {
        setLoading(false);
      }
    };

    // console.log("frame", frame);

    if (init && urlImage) {
      setDownloadImageUrl(urlImage);

      if (frame && !frame.isPlaying) {
        loadImage();
      }
    }
  }, [urlImage]);

  if (!frame || !model || dates.length === 0) return null;

  // Se é um meteograma, mostrar o gráfico
  if (frame?.city && model?.urlCharts) {
    // console.log("frame.city", frame.city);
    return (
      <FrameCharts
        date={{ year, month, day, turn }}
        cityId={frame.city}
        urlCharts={model.urlCharts}
        urlCsv={model.urlCsv}
      />
    );
  } else {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center relative min-h-96">
          {frame?.forecastTime !== null && (loadingImages || loading) && (
            <span
              className="absolute flex justify-center items-center"
              title="Após dar início na animação é necessário aguardar o carregamento das imagens..."
            >
              <svg
                className="animate-spin h-16 w-16 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
          )}
          <img
            src={urlImage}
            onError={(e) => {
              e.target.onError = null;
              e.target.src = publicImage;
            }}
            alt={altImage}
            className="rounded-md mt-4 max-w-full"
          />
        </div>
        {/* <div className="mt-4 flex justify-center flex-grow">
          <a href={urlImage} download="imagem-de-previsao.png" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700" title={urlImage}><span className="flex justify-center items-center"><FaDownload /><span className="ml-2">Download da imagem</span></span></a>
        </div> */}
      </div>
    );
  }
}
