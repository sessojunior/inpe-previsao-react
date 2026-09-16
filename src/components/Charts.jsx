import { useEffect, useState } from "react";

import Chart from "./Chart";

export default function Charts({ date, urlCharts, urlCsv }) {
  const [dataCharts, setDataCharts] = useState(null);
  const [dataCsv, setDataCsv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestUrls, setRequestUrls] = useState(null);

  // console.log("date", date);
  // console.log("urlCharts", urlCharts);
  // console.log("urlCsv", urlCsv);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setDataCharts(null);
    setDataCsv(null);
    setError(null);
    setLoading(true);
    setRequestUrls({ urlCharts, urlCsv });

    async function fetchCharts() {
      try {
        const response = await fetch(urlCharts, { signal });

        if (response.ok === false) {
          const error = new Error(
            "Os dados do meteograma não estão disponíveis para esta seleção"
          );
          error.code = response.status === 404 ? "unavailable" : "request";
          error.status = response.status;
          throw error;
        }

        const data = await response.json();
        if (!Array.isArray(data?.datasets) || !data.datasets[0]) {
          const error = new Error(
            "Os dados do meteograma não estão disponíveis para esta seleção"
          );
          error.code = "unavailable";
          throw error;
        }
        if (!signal.aborted) {
          setDataCharts(data.datasets[0]);
        }
      } catch (error) {
        if (signal.aborted) return;
        if (error instanceof TypeError || error instanceof SyntaxError) {
          error.code = "unavailable";
        }
        console.log("Erro ao obter dados do JSON: " + urlCharts);
        // console.log(error);
        setError(error);
      }
    }

    async function fetchCsv() {
      try {
        const response = await fetch(urlCsv, { signal });

        if (response.ok === false) {
          const error = new Error(
            "Os dados do meteograma não estão disponíveis para esta seleção"
          );
          error.code = response.status === 404 ? "unavailable" : "request";
          error.status = response.status;
          throw error;
        }

        const text = await response.text();
        if (!text.trim()) {
          const error = new Error(
            "Os dados do meteograma não estão disponíveis para esta seleção"
          );
          error.code = "unavailable";
          throw error;
        }
        if (!signal.aborted) {
          setDataCsv(text);
        }
      } catch (error) {
        if (signal.aborted) return;
        if (error instanceof TypeError || error instanceof SyntaxError) {
          error.code = "unavailable";
        }
        console.log("Erro ao obter dados do CSV: " + urlCsv);
        // console.log(error);
        setError(error);
      }
    }

    async function fetchData() {
      await Promise.all([
        urlCharts ? fetchCharts() : null,
        urlCsv ? fetchCsv() : null,
      ]);
      if (!signal.aborted) {
        setLoading(false);
      }
    }

    fetchData();

    return () => controller.abort();
  }, [urlCharts, urlCsv]);

  // A nova seleção pode renderizar antes de o efeito limpar o estado anterior.
  const isCurrentSelection =
    requestUrls?.urlCharts === urlCharts && requestUrls?.urlCsv === urlCsv;

  if (!isCurrentSelection || loading) {
    return <div className="text-center pt-4">Carregando...</div>;
  }

  if (error) {
    const dataUnavailable = error.code === "unavailable";

    return (
      <div className="text-center pt-4" role="status">
        {dataUnavailable
          ? "Os dados do meteograma não estão disponíveis ou não puderam ser acessados para esta cidade e data."
          : `Não foi possível obter os dados do meteograma para o dia ${date.day}/${date.month}/${date.year}.`}
      </div>
    );
  }

  // Tipos de charts:
  // tempPressPrec - Temperatura, pressão e precipitação
  // tempMinMaxMedia - Temperatura mínima, maxima e média
  // press - Pressão
  // prec - Precipitação
  // wind - Vento
  // ur - Umidade relativa
  // cloud - Nuvens
  // co - Monóxido de carbono
  // pm25 - Material micro-particulado
  // csvCo - Heatmap de monóxido de carbono
  // csvPm25 - Heatmap de material micro-particulado
  // csvNox - Heatmap de óxido de nitrogenio
  // csvWind - Vector plot de vento
  // csvWindCo - Heatmap e vector plot de vento e monóxido de carbono
  // csvWindPm25 - Heatmap e vector plot de vento e material micro-particulado
  // csvWindNox - Heatmap e vector plot de vento e óxido de nitrogenio

  return (
    <div>
      {dataCharts !== null && (
        <>
          <Chart date={date} dataCharts={dataCharts} product="tempPressPrec" />
          <Chart
            date={date}
            dataCharts={dataCharts}
            product="tempMinMaxMedia"
          />
          <Chart date={date} dataCharts={dataCharts} product="press" />
          <Chart date={date} dataCharts={dataCharts} product="prec" />
          <Chart date={date} dataCharts={dataCharts} product="wind" />
          <Chart date={date} dataCharts={dataCharts} product="ur" />
          <Chart date={date} dataCharts={dataCharts} product="cloud" />
          <Chart date={date} dataCharts={dataCharts} product="co" />
          <Chart date={date} dataCharts={dataCharts} product="pm25" />
        </>
      )}
      {dataCsv !== null && (
        <>
          {/* <Chart date={date} dataCsv={dataCsv} product="csvCo" />
          <Chart date={date} dataCsv={dataCsv} product="csvPm25" />
          <Chart date={date} dataCsv={dataCsv} product="csvNox" />
          <Chart date={date} dataCsv={dataCsv} product="csvWind" /> */}
          <Chart date={date} dataCsv={dataCsv} product="csvWindCo" />
          <Chart date={date} dataCsv={dataCsv} product="csvWindPm25" />
          <Chart date={date} dataCsv={dataCsv} product="csvWindNox" />
        </>
      )}
    </div>
  );
}
