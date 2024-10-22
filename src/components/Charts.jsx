import { useEffect, useState } from "react";

import Chart from "./Chart";

export default function Charts({ date, urlCharts }) {
  const [chart, setChart] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJson() {
      setLoading(true);
      try {
        const response = await fetch(urlCharts);
        const data = await response.json();
        if (data.datasets?.length == 0) {
          throw new Error("Dados não encontrados no JSON");
        }
        setChart(data.datasets[0]);
      } catch (error) {
        console.log("Erro ao obter dados do JSON: " + url + ".", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    if (urlCharts) {
      fetchJson();
    }
  }, [date, urlCharts]);

  if (loading) {
    return <div className="text-center pt-4">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center pt-4">{error.message}</div>;
  }

  // console.log("urlCharts", urlCharts);
  // console.log(chart);

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

  if (loading) {
    return <div className="text-center pt-4">Carregando...</div>;
  }

  return (
    <div>
      <Chart date={date} chart={chart} type="tempPressPrec" />
      <Chart date={date} chart={chart} type="tempMinMaxMedia" />
      <Chart date={date} chart={chart} type="press" />
      <Chart date={date} chart={chart} type="prec" />
      <Chart date={date} chart={chart} type="wind" />
      <Chart date={date} chart={chart} type="ur" />
      <Chart date={date} chart={chart} type="cloud" />
      <Chart date={date} chart={chart} type="co" />
      <Chart date={date} chart={chart} type="pm25" />
    </div>
  );
}
