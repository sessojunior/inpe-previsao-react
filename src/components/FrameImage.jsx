import { useCallback, useEffect, useRef, useState } from "react";

import ImageNotFound from "../assets/not-found.png";
import FrameCharts from "./FrameCharts";

const MAX_IMAGE_RETRIES = 3;
const RETRY_DELAYS_MS = [1500, 3000, 6000];
const BACKGROUND_RETRY_DELAY_MS = 15000;
const MAX_BACKGROUND_TRIES = 20;

export default function FrameImage({
  frame,
  model,
  dates,
  loadingImages,
  setDownloadImageUrl,
}) {
  const [loading, setLoading] = useState(false);

  // Quantidade máxima de novas tentativas antes de exibir a imagem de
  // "não encontrado". Algumas imagens ainda estão sendo geradas no servidor
  // do CPTEC (respondem 503) e passam a existir após alguns segundos/minutos,
  // então tentamos novamente com intervalos crescentes.

  // Após o fallback, continua verificando silenciosamente (a cada 15s, até
  // 20 vezes) se a imagem passou a existir no servidor, sem trocar a data.

  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [backgroundTries, setBackgroundTries] = useState(0);
  const retryTimerRef = useRef(null);
  const backgroundTimerRef = useRef(null);
  const mountedRef = useRef(true);
  const imageRequestRef = useRef(0);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Se o período que inicia ou termina for específico para o produto, por exemplo, um produto que inicia em "024", obtém a partir do produto o período de horas que o mesmo roda.
  const product =
    model.options.products.find((product) => product.value === frame.product) ||
    model.options.products[0];
  const periodStart = product.periodStart ?? model.periodStart;

  const publicImage = ImageNotFound;
  const init = frame.init ?? dates[0];
  const frameId = frame?.id;
  const isFramePlaying = frame?.isPlaying;
  const year = init?.slice(0, 4);
  const month = init?.slice(5, 7);
  const day = init?.slice(8, 10);
  const turn = init?.slice(11, 13);
  const forecastTime = frame.forecastTime ?? periodStart;
  const isChart = Boolean(frame?.city && model?.urlCharts);

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

  // Ao trocar de imagem (produto, região, horário ou data), cancela a nova
  // tentativa pendente e reinicia o contador.
  useEffect(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    if (backgroundTimerRef.current) {
      clearTimeout(backgroundTimerRef.current);
      backgroundTimerRef.current = null;
    }

    setAttempt(0);
    setFailed(false);
    setRetrying(false);
    setBackgroundTries(0);
  }, [urlImage]);

  // Ao desmontar, cancela qualquer nova tentativa agendada.
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }

      if (backgroundTimerRef.current) {
        clearTimeout(backgroundTimerRef.current);
      }
    };
  }, []);

  // Em caso de erro, tenta novamente com intervalo crescente; após esgotar
  // as tentativas, mostra a imagem de "não encontrado".
  const handleImageError = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }

    if (attempt < MAX_IMAGE_RETRIES) {
      setRetrying(true);
      const requestId = imageRequestRef.current;
      retryTimerRef.current = setTimeout(
        () => {
          if (
            mountedRef.current &&
            imageRequestRef.current === requestId
          ) {
            setAttempt((previous) => previous + 1);
          }
        },
        RETRY_DELAYS_MS[attempt] ?? 1500
      );
      return;
    }

    setRetrying(false);
    setFailed(true);
  }, [attempt]);

  // Enquanto a imagem estiver no fallback, continua tentando em segundo
  // plano até o servidor disponibilizar a imagem (sem trocar a data).
  useEffect(() => {
    if (!failed || backgroundTries >= MAX_BACKGROUND_TRIES) {
      return undefined;
    }

    const requestId = imageRequestRef.current;
    backgroundTimerRef.current = setTimeout(() => {
      const probe = new Image();
      probe.src = `${urlImage}?bg=${backgroundTries + 1}`;
      probe.onload = () => {
        if (
          !mountedRef.current ||
          imageRequestRef.current !== requestId
        ) {
          return;
        }

        setFailed(false);
        setRetrying(false);
        setAttempt((previous) => previous + 1);
        setBackgroundTries(0);
      };
      probe.onerror = () => {
        if (
          !mountedRef.current ||
          imageRequestRef.current !== requestId
        ) {
          return;
        }

        setBackgroundTries((previous) => previous + 1);
      };
    }, BACKGROUND_RETRY_DELAY_MS);

    return () => {
      if (backgroundTimerRef.current) {
        clearTimeout(backgroundTimerRef.current);
        backgroundTimerRef.current = null;
      }
    };
  }, [failed, backgroundTries, urlImage]);

  // Botão "Tentar novamente": força uma nova tentativa imediata.
  const handleRetry = useCallback(() => {
    if (backgroundTimerRef.current) {
      clearTimeout(backgroundTimerRef.current);
      backgroundTimerRef.current = null;
    }

    imageRequestRef.current += 1;
    setBackgroundTries(0);
    setFailed(false);
    setRetrying(true);
    setAttempt((previous) => previous + 1);
  }, []);

  // URL renderizada no <img>: a cada nova tentativa é adicionado um parâmetro
  // para forçar uma requisição nova (ignora respostas falhas em cache).
  const imageSrc = failed
    ? publicImage
    : attempt > 0
    ? `${urlImage}?retry=${attempt}`
    : urlImage;

  useEffect(() => {
    const requestId = imageRequestRef.current + 1;
    imageRequestRef.current = requestId;

    const loadImage = async () => {
      if (
        !mountedRef.current ||
        imageRequestRef.current !== requestId
      ) {
        return;
      }

      setLoading(true);

      try {
        const img = new Image();
        img.src = urlImage;
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(urlImage);
          img.onerror = () =>
            reject(
              new Error(
                `Erro ao carregar a imagem do frame ${frameId}: ${urlImage}`
              )
            );
        });
      } catch (error) {
        //console.error(error);
      } finally {
        if (
          mountedRef.current &&
          imageRequestRef.current === requestId
        ) {
          setLoading(false);
        }
      }
    };

    // console.log("frame", frame);

    if (isChart || !init || !urlImage) {
      setDownloadImageUrl("");
      if (mountedRef.current) {
        setLoading(false);
      }
      return;
    }

    if (mountedRef.current) {
      setDownloadImageUrl(urlImage);
      if (isFramePlaying) {
        setLoading(false);
        return;
      }

      loadImage();
    }
  }, [frameId, init, isChart, isFramePlaying, setDownloadImageUrl, urlImage]);

  if (!frame || !model || (!frame.init && dates.length === 0)) return null;

  // Se é um meteograma, mostrar o gráfico
  if (isChart) {
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
          {frame?.forecastTime !== null &&
            (loadingImages || loading || retrying) && (
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
            src={imageSrc}
            onLoad={() => setRetrying(false)}
            onError={failed ? undefined : handleImageError}
            alt={altImage}
            className={`rounded-md mt-4 max-w-full ${
              retrying ? "opacity-0" : ""
            }`}
          />
          {failed && (
            <button
              type="button"
              onClick={handleRetry}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 shadow"
              title="Tentar carregar a imagem novamente"
            >
              Tentar novamente
            </button>
          )}
        </div>
        {/* <div className="mt-4 flex justify-center flex-grow">
          <a href={urlImage} download="imagem-de-previsao.png" target="_blank" rel="noreferrer" className="px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-700" title={urlImage}><span className="flex justify-center items-center"><FaDownload /><span className="ml-2">Download da imagem</span></span></a>
        </div> */}
      </div>
    );
  }
}
