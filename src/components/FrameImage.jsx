import { useEffect, useState, useContext } from "react";
import { ConfigContext } from "../contexts/ConfigContext";

import ImageNotFound from "../assets/image-not-found.jpg";

export default function FrameImage({
  frame,
  model,
  dates,
  loadingImages,
  setDownloadImageUrl,
}) {
  // console.log("FrameImage")

  const { config } = useContext(ConfigContext);

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

  // console.log("frame", frame)
  // console.log("init", init)
  // console.log("dates", dates)
  // console.log("FrameImage model", model)
  // console.log("model.urlImage", model.urlImage)
  // console.log("FrameImage frame.forecastTime", frame.forecastTime)
  // console.log("FrameImage periodStart", periodStart)
  // console.log("FrameImage forecastTime", forecastTime)

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

  // console.log("frame.forecastTime", frame.forecastTime)
  // console.log("urlImage", urlImage);

  // console.log("config.isAllPlaying", config.isAllPlaying)
  // console.log("config.framesWithImagesLoaded", config.framesWithImagesLoaded)

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
        // console.log(`Imagem do frame ${frame.id} carregada com sucesso!`)
      } catch (error) {
        //console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (init && urlImage) {
      setDownloadImageUrl(urlImage);

      if (!frame.isPlaying) {
        loadImage();
      }
    }
  }, [urlImage]);

  if (!frame || !model || dates.length === 0) return null;

  // console.log("frame.id", frame.id)
  // console.log("loadingImages", loadingImages)
  // console.log("loading", loading)
  // console.log("(loadingImages || loading)", (loadingImages || (loading && !loadingImages)))

  return (
    <div>
      {/* <p className="pb-2">URL do modelo:
        <br /><b>{model.urlImage.replaceAll("{{", " {{").replaceAll("}}", "}} ")}</b></p>
      <p className="pb-2">URL convertida:
        <br />[<b>{
          model.urlImage.replaceAll("{{model}}", " " + model.value + " ")
            .replaceAll("{{region}}", " " + frame.region + " ")
            .replaceAll("{{product}}", " " + frame.product + " ")
            .replaceAll("{{forecastTime}}", " " + forecastTime + " ")
            .replaceAll("{{timeRun}}", " " + model.defaultValues.timeRun + " ")
            .replaceAll("{{turn}}", " " + turn + " ")
            .replaceAll("{{year}}", " " + year + " ")
            .replaceAll("{{month}}", " " + month + " ")
            .replaceAll("{{day}}", " " + day + " ")}</b>]</p>
      <p className="pb-2">Dados para a troca de imagem:</p>
      <p>[frame.model: <b>{frame.model}</b>]</p>
      <p>[frame.region: <b>{frame.region}</b>]</p>
      <p>[frame.product: <b>{frame.product}</b>]</p>
      <p>[model.possibleValues.time: <b>{model.possibleValues.time.map(time => time + " ")}</b>]</p>
      <p><b>[frame.forecastTime: <b>{frame.forecastTime}</b>]</b></p>
      <p><b>[forecastTime: <b>{forecastTime}</b>]</b></p>
      <p>[frame.isPlaying: <b>{frame.isPlaying ? "true" : "false"}</b>]</p>
      <p>[frame.timeRun: <b>{frame.timeRun}</b>]</p>
      <p>[frame.init: <b>{frame.init}</b>]</p>
      <p>[init: <b>{init}</b>]</p>
      <p>[timeRun: <b>{frame.timeRun}</b>]</p>
      <p>[year: <b>{year}</b>]</p>
      <p>[month: <b>{month}</b>]</p>
      <p>[day: <b>{day}</b>]</p>
      <p>[turn: <b>{turn}</b>]</p> */}
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
            className="rounded-md mt-4 w-full"
          />
        </div>
        {/* <div className="mt-4 flex justify-center flex-grow">
          <a href={urlImage} download="imagem-de-previsao.png" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700" title={urlImage}><span className="flex justify-center items-center"><FaDownload /><span className="ml-2">Download da imagem</span></span></a>
        </div> */}
      </div>
    </div>
  );
}
