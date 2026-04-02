import { useContext, useMemo } from "react";
import { FaArrowLeft, FaCloudSun, FaLink, FaRoute } from "react-icons/fa";

import { ConfigContext } from "../contexts/ConfigContext";
import { buildFramePathname } from "../lib/frameUrlState";

function buildDefaultFrame(model) {
  return {
    id: 1,
    model: model.value,
    product: model.default.product.value,
    group: model.default.product.group,
    region: model.default.product.region,
    city: null,
    forecastTime: model.forecastTime,
    init: null,
    isPlaying: false,
  };
}

function getErrorCopy(reason) {
  switch (reason) {
    case "model":
      return {
        title: "Modelo nao encontrado",
        description:
          "O caminho informado nao corresponde a nenhum modelo disponivel nesta pagina.",
      };
    case "selection":
      return {
        title: "Produto nao encontrado",
        description:
          "O modelo existe, mas o produto informado na URL nao faz parte das combinacoes validas.",
      };
    case "location":
      return {
        title: "Regiao nao encontrada",
        description:
          "A combinacao de modelo e produto existe, mas a regiao ou cidade informada nao e valida.",
      };
    case "init":
      return {
        title: "Inicializacao invalida",
        description:
          "O formato da data na URL nao esta no padrao esperado para a previsao numerica.",
      };
    default:
      return {
        title: "Endereco nao encontrado",
        description:
          "A URL digitada nao corresponde a uma rota valida desta previsao numerica.",
      };
  }
}

export default function RouteNotFound() {
  const { models, routeState, homeFrame, goToFrameRoute, goToHomeRoute } =
    useContext(ConfigContext);

  const errorCopy = getErrorCopy(routeState?.reason);
  const invalidPath = routeState?.pathname || window.location.pathname;

  const modelLinks = useMemo(
    () =>
      models.map((model) => ({
        label: model.label,
        pathname: buildFramePathname(models, buildDefaultFrame(model)),
        frame: buildDefaultFrame(model),
      })),
    [models]
  );

  return (
    <section className="px-4 py-6 md:py-8 lg:py-10">
      <div className="mx-auto max-w-6xl rounded-[32px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-sky-50 shadow-[0_30px_80px_rgba(14,60,132,0.12)] overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 md:p-10 lg:p-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">
              <FaRoute />
              Erro 404 na rota
            </div>

            <div className="max-w-2xl">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
                {errorCopy.title}
              </h1>
              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                {errorCopy.description} Use um dos atalhos abaixo para voltar a
                uma combinacao valida sem sair da aplicacao.
              </p>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center gap-3 text-slate-900">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <FaLink />
                </div>
                <div>
                  <div className="text-sm font-semibold">URL recebida</div>
                  <div className="text-xs text-slate-500">
                    Caminho que nao foi reconhecido pela pagina
                  </div>
                </div>
              </div>
              <div className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 px-4 py-3 font-mono text-sm text-slate-100">
                {invalidPath}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={goToHomeRoute}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#1351b4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0f3f8d]"
              >
                <FaCloudSun />
                Abrir pagina inicial
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                    return;
                  }

                  goToHomeRoute();
                }}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <FaArrowLeft />
                Voltar para uma rota valida
              </button>
            </div>
          </div>

          <aside className="border-t border-slate-200 bg-[#071D41] p-6 text-white md:p-10 lg:border-l lg:border-t-0">
            <div className="max-w-md">
              <h2 className="text-xl font-semibold">Modelos disponiveis</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Se voce digitou a rota manualmente, use um destes atalhos para
                abrir um modelo valido com a configuracao inicial padrao.
              </p>
            </div>

            <div className="mt-8 grid gap-3">
              {modelLinks.map((modelLink) => {
                const isHomeModel = modelLink.pathname === buildFramePathname(models, homeFrame);

                return (
                  <button
                    key={modelLink.pathname}
                    type="button"
                    onClick={() => goToFrameRoute(modelLink.frame)}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-sky-300/40 hover:bg-white/10"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {modelLink.label}
                      </div>
                      <div className="mt-1 text-xs text-slate-300">
                        {isHomeModel ? "Pagina inicial recomendada" : modelLink.pathname}
                      </div>
                    </div>
                    <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-sky-200 transition group-hover:border-sky-300/60 group-hover:text-sky-100">
                      Abrir
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}