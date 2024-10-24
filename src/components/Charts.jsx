import { useEffect, useState } from "react";

import Chart from "./Chart";

export default function Charts({ date, urlCharts, urlCsv }) {
  const [dataCharts, setDataCharts] = useState(null);
  const [dataCsv, setDataCsv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // console.log("date", date);
  // console.log("urlCharts", urlCharts);
  // console.log("urlCsv", urlCsv);

  useEffect(() => {
    async function fetchCharts() {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch(urlCharts);
        const data = await response.json();
        if (data.datasets?.length == 0) {
          throw new Error("Dados não encontrados no JSON");
        }
        setDataCharts(data.datasets[0]);
      } catch (error) {
        console.log("Erro ao obter dados do JSON: " + urlCharts);
        // console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchCsv() {
      setError(null);
      setLoading(true);
      try {
        const response = await fetch(urlCsv);
        const text = await response.text();
        if (text == "") {
          throw new Error("Dados não encontrados no CSV");
        }
        setDataCsv(text);
      } catch (error) {
        console.log("Erro ao obter dados do CSV: " + urlCsv);
        // console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (urlCharts) fetchCharts();
    if (urlCsv) fetchCsv();
  }, [date]);

  if (loading) {
    return <div className="text-center pt-4">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="text-center pt-4">
        Ocorreu um erro ao obter os dados para o dia {date.day}/{date.month}/
        {date.year}.
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
  // csvCoWind - Heatmap e vector plot de vento e monóxido de carbono

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
          <Chart date={date} dataCsv={dataCsv} product="csvCo" />
          <Chart date={date} dataCsv={dataCsv} product="csvPm25" />
          <Chart date={date} dataCsv={dataCsv} product="csvNox" />
          <Chart date={date} dataCsv={dataCsv} product="csvWind" />
          <Chart date={date} dataCsv={dataCsv} product="csvCoWind" />
        </>
      )}
    </div>
  );
}
