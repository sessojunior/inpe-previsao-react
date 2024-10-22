import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import highchartsWindbarb from "highcharts/modules/windbarb";
import highchartsAcessibility from "highcharts/modules/accessibility";
highchartsMore(Highcharts);
highchartsWindbarb(Highcharts);
highchartsAcessibility(Highcharts);

export default function Chart({ date, chart, type }) {
  const dateTime = `${date.year}-${date.month}-${date.day} ${date.turn}:00:00`;
  const pointStart = Date.UTC(
    parseInt(dateTime.substr(0, 4)),
    parseInt(dateTime.substr(5, 2)) - 1,
    parseInt(dateTime.substr(8, 2)),
    parseInt(dateTime.substr(11, 2)),
    parseInt(dateTime.substr(14, 2)),
    parseInt(dateTime.substr(17, 2))
  );

  // Global options
  Highcharts.setOptions({
    global: {
      useUTC: true,
    },
    lang: {
      months: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
      ],
      shortMonths: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      weekdays: [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ],
      exportData: {
        annotationHeader: "Anotações",
        categoryDatetimeHeader: "Data e hora",
        categoryHeader: "Categoria",
      },
      loading: ["Carregando o gráfico..."],
      contextButtonTitle: "Exportar gráfico",
      decimalPoint: ",",
      thousandsSep: ".",
      downloadJPEG: "Baixar imagem JPEG",
      downloadPDF: "Baixar arquivo PDF",
      downloadPNG: "Baixar imagem PNG",
      downloadSVG: "Baixar vetor SVG",
      printChart: "Imprimir gráfico",
      rangeSelectorFrom: "De",
      rangeSelectorTo: "Para",
      rangeSelectorZoom: "Zoom",
      resetZoom: "Resetar zoom",
      resetZoomTitle: "Resetar zoom para original",
      viewFullscreen: "Ver em tela cheia",
      viewData: "Ver tabela de dados",
      hideData: "Ocultar tabela de dados",
    },
    accessibility: {
      enabled: false,
    },
    credits: {
      text: "Previsão numérica do CPTEC",
      href: "https://previsaonumerica.cptec.inpe.br",
      position: {
        x: 0,
      },
    },
  });

  // Temperatura, pressão e precipitação
  const existsItemp = chart.data.some((item) => item.hasOwnProperty("temp"));
  const existsIpress = chart.data.some((item) => item.hasOwnProperty("press"));
  const existsIprec = chart.data.some((item) => item.hasOwnProperty("prec"));
  const existsTempPressPrec = existsItemp && existsIpress && existsIprec;
  const iTemp = existsItemp
    ? chart.data.map((item) => parseFloat(item.temp.toFixed(1)))
    : [];
  const iPress = existsIpress
    ? chart.data.map((item) => parseFloat(item.press.toFixed(1)))
    : [];
  const iPrec = existsIprec
    ? chart.data.map((item) => parseFloat(item.prec.toFixed(1)))
    : [];
  const optionsTempPressPrec = {
    chart: {
      zoomType: "xy",
      backgroundColor: "rgba(0,0,0,0)",
    },
    title: {
      text: `Temperatura, pressão e precipitação`,
      align: "center",
    },
    subtitle: {
      text: `Fonte: CPTEC`,
      align: "center",
    },
    xAxis: [
      {
        type: "datetime",
        offset: 0,
        crosshair: true,
      },
    ],
    yAxis: [
      {
        // Primeiro yAxis
        labels: {
          format: "{value}°C",
          style: {
            color: Highcharts.getOptions().colors[2],
          },
        },
        title: {
          text: "Temperatura",
          style: {
            color: Highcharts.getOptions().colors[2],
          },
        },
        opposite: true,
      },
      {
        // Segundo yAxis
        gridLineWidth: 0,
        title: {
          text: "Precipitação",
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
        labels: {
          format: "{value} mm",
          style: {
            color: Highcharts.getOptions().colors[0],
          },
        },
      },
      {
        // Terceiro yAxis
        gridLineWidth: 0,
        title: {
          text: "Pressão",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        labels: {
          format: "{value} mb",
          style: {
            color: Highcharts.getOptions().colors[1],
          },
        },
        opposite: true,
      },
    ],
    plotOptions: {
      series: {
        // Configura o eixo X para ser a partir da data fornecida
        pointStart: pointStart,
        pointInterval: 36e5,
      },
    },
    tooltip: {
      shared: true,
      xDateFormat: "%d/%m/%Y %H:%M",
      valueDecimals: 1,
    },
    legend: {
      layout: "vertical",
      align: "left",
      x: 80,
      verticalAlign: "top",
      y: 55,
      floating: true,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || // theme
        "rgba(255,255,255,0.25)",
    },
    series: [
      {
        id: "prec",
        name: "Precipitação",
        type: "area",
        yAxis: 1,
        data: iPrec,
        connectNulls: false,
        fillOpacity: 0.5,
        //color: "#2542FF",
        tooltip: {
          valueSuffix: " mm/h",
        },
      },
      {
        name: "Pressão",
        type: "spline",
        yAxis: 2,
        data: iPress,
        marker: {
          enabled: false,
        },
        dashStyle: "shortdot",
        //color: "#2542FF",
        tooltip: {
          valueSuffix: " hPa",
        },
      },
      {
        name: "Temperatura",
        type: "spline",
        data: iTemp,
        //color: "#2542FF",
        tooltip: {
          valueSuffix: " °C",
        },
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              floating: false,
              layout: "horizontal",
              align: "center",
              verticalAlign: "bottom",
              x: 0,
              y: 0,
            },
            yAxis: [
              {
                labels: {
                  align: "right",
                  x: 0,
                  y: -6,
                },
                showLastLabel: false,
              },
              {
                labels: {
                  align: "left",
                  x: 0,
                  y: -6,
                },
                showLastLabel: false,
              },
              {
                visible: false,
              },
            ],
          },
        },
      ],
    },
  };

  // Temperatura mínima, máxima e média
  const existsTemp_mn = chart.data.some((item) =>
    item.hasOwnProperty("temp_mn")
  );
  const existsTemp_mx = chart.data.some((item) =>
    item.hasOwnProperty("temp_mx")
  );
  const existsTempMinMax = existsTemp_mn && existsTemp_mx;
  const tempMinMax = existsTempMinMax
    ? chart.data.map((item) => [
        parseFloat(item.temp_mn.toFixed(2)),
        parseFloat(item.temp_mx.toFixed(2)),
      ])
    : [];
  const tempAverage = existsTempMinMax
    ? chart.data.map((item) =>
        parseFloat(
          ((parseFloat(item.temp_mn) + parseFloat(item.temp_mx)) / 2).toFixed(2)
        )
      )
    : [];
  const optionsTempMinMaxMedia = {
    chart: {
      type: "arearange",
      zoomType: "x",
      backgroundColor: "rgba(0,0,0,0)",
      scrollablePlotArea: {
        minWidth: 600,
        scrollPositionX: 1,
      },
    },
    title: {
      text: "Temperatura mínima, maxima e média",
      align: "center",
    },
    subtitle: {
      text: "Fonte: CPTEC",
      align: "center",
    },
    xAxis: [
      {
        type: "datetime",
        offset: 0,
        crosshair: true,
      },
    ],
    yAxis: {
      title: {
        text: null,
      },
    },
    plotOptions: {
      series: {
        // Configura o eixo X para ser a partir da data fornecida
        pointStart: pointStart,
        pointInterval: 36e5,
      },
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: "°C",
      xDateFormat: "%d/%m/%Y %H:%M",
      valueDecimals: 1,
    },
    legend: {
      enabled: false,
    },
    series: [
      {
        name: "Temperaturas mín. e máx.",
        showInLegend: false,
        data: tempMinMax,
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, "#ff0000"],
            [1, "#0000ff"],
          ],
        },
      },
      {
        name: "Temperatura média",
        showInLegend: false,
        type: "spline",
        data: tempAverage,
        //color: "#2542FF",
        tooltip: {
          valueSuffix: " °C",
        },
      },
    ],
  };

  // Pressão
  const existsPress = chart.data.some((item) => item.hasOwnProperty("prec"));
  const press = existsPress
    ? chart.data.map((item) => parseFloat(item.press.toFixed(2)))
    : [];
  const optionsPress = {
    chart: {
      zoomType: "x",
      backgroundColor: "rgba(0,0,0,0)",
    },
    title: {
      text: "Pressão reduzida ao nível do mar (hPa)",
      align: "center",
    },
    subtitle: {
      text: "Fonte: CPTEC",
      align: "center",
    },
    yAxis: {
      title: {
        text: "Pressão ao nível do mar",
      },
    },
    xAxis: {
      type: "datetime",
      offset: 40,
    },
    plotOptions: {
      series: {
        // Configura o eixo X para ser a partir da data fornecida
        pointStart: pointStart,
        pointInterval: 36e5,
      },
    },
    series: [
      {
        data: press,
        name: "Pressão ao nivel do mar",
        color: "#3cb1ff",
        showInLegend: false,
        tooltip: {
          valueSuffix: " hPa",
        },
      },
    ],
  };

  // Precipitação
  const existsPrec = chart.data.some((item) => item.hasOwnProperty("prec"));
  const prec = existsPrec
    ? chart.data.map((item) => parseFloat(item.prec.toFixed(2)))
    : [];
  const optionsPrec = {
    chart: {
      type: "area",
      zoomType: "x",
      backgroundColor: "rgba(0,0,0,0)",
    },

    title: {
      text: "Precipitação (mm/h)",
      align: "center",
    },
    subtitle: {
      text: "Fonte: CPTEC",
      align: "center",
    },
    xAxis: [
      {
        type: "datetime",
        offset: 0,
        crosshair: true,
      },
    ],
    yAxis: {
      min: 0,
      title: {
        text: "milimetros por hora",
      },
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: "mm/h",
      xDateFormat: "%d/%m/%Y %H:%M",
      valueDecimals: 2,
    },
    plotOptions: {
      area: {
        dataLabels: {
          enabled: false, // Oculta os rótulos de dados no gráfico
        },
        // Configura o eixo X para ser a partir da data fornecida
        pointStart: pointStart,
        pointInterval: 36e5,
        marker: {
          enabled: false,
          symbol: "circle",
          radius: 2,
          states: {
            hover: {
              enabled: true,
            },
          },
        },
      },
    },
    series: [
      {
        name: "Precipitação",
        data: prec,
        fillOpacity: 0.5,
      },
    ],
  };

  // Vento
  const existsWind = chart.data.some((item) => item.hasOwnProperty("wind"));
  const wind = existsWind
    ? chart.data.map((item) => [
        parseFloat(item.wind_speed.toFixed(2)),
        parseFloat(item.wind_dir.toFixed(2)),
      ])
    : [];
  const optionsWind = {
    chart: {
      zoomType: "x",
      backgroundColor: "rgba(0,0,0,0)",
    },
    title: {
      text: "Vento em 1000 hPa (m/s)",
      align: "center",
    },
    subtitle: {
      text: "Fonte: CPTEC",
      align: "center",
    },
    xAxis: {
      type: "datetime",
      offset: 40,
    },
    tooltip: {
      crosshairs: true,
      shared: true,
      valueSuffix: "mm/h",
      xDateFormat: "%d/%m/%Y %H:%M",
      valueDecimals: 2,
    },
    plotOptions: {
      series: {
        // Configura o eixo X para ser a partir da data fornecida
        pointStart: pointStart,
        pointInterval: 36e5,
      },
    },
    series: [
      {
        type: "windbarb",
        data: wind,
        name: "Vento",
        color: Highcharts.getOptions().colors[1],
        showInLegend: false,
        tooltip: {
          valueSuffix: " m/s",
        },
      },
      {
        type: "area",
        keys: ["y", "rotation"], // rotation is not used here
        data: wind,
        color: Highcharts.getOptions().colors[0],
        fillColor: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1,
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [
              1,
              Highcharts.color(Highcharts.getOptions().colors[0])
                .setOpacity(0.25)
                .get(),
            ],
          ],
        },
        name: "Velocidade do vento",
        tooltip: {
          valueSuffix: " m/s",
        },
        states: {
          inactive: {
            opacity: 1,
          },
        },
      },
    ],
  };

  // Umidade relativa
  const existsUr = chart.data.some((item) => item.hasOwnProperty("ur"));
  const ur = existsUr
    ? chart.data.map((item) => parseFloat(item.ur.toFixed(2)))
    : [];
  const optionsUr = {
    chart: {
      zoomType: "x",
      backgroundColor: "rgba(0,0,0,0)",
    },
    title: {
      text: "Umidade Relativa a 2m do solo (%)",
      align: "center",
    },
    subtitle: {
      text: "Fonte: CPTEC",
      align: "center",
    },
    yAxis: {
      title: {
        text: "Umidade relativa",
      },
    },
    xAxis: {
      type: "datetime",
      offset: 40,
    },
    plotOptions: {
      series: {
        // Configura o eixo X para ser a partir da data fornecida
        pointStart: pointStart,
        pointInterval: 36e5,
      },
    },
    series: [
      {
        data: ur,
        name: "Umidade Relativa",
        color: Highcharts.getOptions().colors[1],
        showInLegend: false,
        tooltip: {
          valueSuffix: " %",
        },
      },
    ],
  };

  // Nuvens
  const existsLowCloud = chart.data.some((item) =>
    item.hasOwnProperty("low_cloud")
  );
  const existsMidCloud = chart.data.some((item) =>
    item.hasOwnProperty("mid_cloud")
  );
  const existsHighCloud = chart.data.some((item) =>
    item.hasOwnProperty("high_cloud")
  );
  const existsCloud = existsLowCloud && existsMidCloud && existsHighCloud;
  const lowCloud = existsLowCloud
    ? chart.data.map((item) => parseFloat(item.low_cloud.toFixed(2)))
    : [];
  const midCloud = existsMidCloud
    ? chart.data.map((item) => parseFloat(item.mid_cloud.toFixed(2)))
    : [];
  const highCloud = existsHighCloud
    ? chart.data.map((item) => parseFloat(item.high_cloud.toFixed(2)))
    : [];
  const optionsCloud = {
    chart: {
      type: "area",
      zoomType: "x",
      backgroundColor: "rgba(0,0,0,0)",
    },
    title: {
      text: "Cobertura de nuvens (%)",
      align: "center",
    },
    subtitle: {
      text: "Fonte: CPTEC",
      align: "center",
    },
    yAxis: {
      title: {
        text: "Cobertura de nuvens",
      },
    },
    xAxis: {
      type: "datetime",
      offset: 40,
    },
    plotOptions: {
      series: {
        // Configura o eixo X para ser a partir da data fornecida
        pointStart: pointStart,
        pointInterval: 36e5,
      },
    },
    series: [
      {
        data: highCloud,
        name: "Nuvens altas",
        color: "#b7ff00",
        showInLegend: true,
        tooltip: {
          valueSuffix: " %",
        },
      },
      {
        data: midCloud,
        name: "Nuvens médias",
        color: "#ff8000",
        showInLegend: true,
        tooltip: {
          valueSuffix: " %",
        },
      },
      {
        data: lowCloud,
        name: "Nuvens baixas",
        color: "#3cb1ff",
        showInLegend: true,
        tooltip: {
          valueSuffix: " %",
        },
      },
    ],
  };

  // Monóxido de carbono
  const existsCo_40 = chart.data.some((item) => item.hasOwnProperty("co_40"));
  const existsCo_700 = chart.data.some((item) => item.hasOwnProperty("co_700"));
  const existsCo_1400 = chart.data.some((item) =>
    item.hasOwnProperty("co_1400")
  );
  const existsCo_5400 = chart.data.some((item) =>
    item.hasOwnProperty("co_5400")
  );
  const existsCo_10200 = chart.data.some((item) =>
    item.hasOwnProperty("co_10200")
  );
  const existsCo =
    existsCo_40 &&
    existsCo_700 &&
    existsCo_1400 &&
    existsCo_5400 &&
    existsCo_10200;
  const co_40 = existsCo_40
    ? chart.data.map((item) => parseFloat(item.co_40.toFixed(2)))
    : [];
  const co_700 = existsCo_700
    ? chart.data.map((item) => parseFloat(item.co_700.toFixed(2)))
    : [];
  const co_1400 = existsCo_1400
    ? chart.data.map((item) => parseFloat(item.co_1400.toFixed(2)))
    : [];
  const co_5400 = existsCo_5400
    ? chart.data.map((item) => parseFloat(item.co_5400.toFixed(2)))
    : [];
  const co_10200 = existsCo_10200
    ? chart.data.map((item) => parseFloat(item.co_10200.toFixed(2)))
    : [];
  const optionsCo = {
    chart: {
      type: "line",
      zoomType: "x",
      backgroundColor: "rgba(0,0,0,0)",
    },
    title: {
      text: "Monóxido de Carbono (ppb)",
      align: "center",
    },
    subtitle: {
      text: "Fonte: CPTEC",
      align: "center",
    },
    yAxis: {
      title: {
        text: "Monóxido de Carbono",
      },
    },
    xAxis: {
      type: "datetime",
      offset: 40,
    },
    plotOptions: {
      series: {
        // Configura o eixo X para ser a partir da data fornecida
        pointStart: pointStart,
        pointInterval: 108e5,
      },
    },
    series: [
      {
        data: co_40,
        name: "40 metros do solo",
        showInLegend: true,
        tooltip: {
          valueSuffix: " ppb",
        },
      },
      {
        data: co_700,
        name: "700 metros do solo",
        showInLegend: true,
        tooltip: {
          valueSuffix: " ppb",
        },
      },
      {
        data: co_1400,
        name: "1400 metros do solo",
        showInLegend: true,
        tooltip: {
          valueSuffix: " ppb",
        },
      },
      {
        data: co_5400,
        name: "5400 metros do solo",
        showInLegend: true,
        tooltip: {
          valueSuffix: " ppb",
        },
      },
      {
        data: co_10200,
        name: "10200 metros do solo",
        showInLegend: true,
        tooltip: {
          valueSuffix: " ppb",
        },
      },
    ],
  };

  // Material micro-particulado
  const existsPm25_40 = chart.data.some((item) =>
    item.hasOwnProperty("pm25_40")
  );
  const existsPm25_700 = chart.data.some((item) =>
    item.hasOwnProperty("pm25_700")
  );
  const existsPm25_1400 = chart.data.some((item) =>
    item.hasOwnProperty("pm25_1400")
  );
  const existsPm25_5400 = chart.data.some((item) =>
    item.hasOwnProperty("pm25_5400")
  );
  const existsPm25_10200 = chart.data.some((item) =>
    item.hasOwnProperty("pm25_10200")
  );
  const existsPm25 =
    existsPm25_40 &&
    existsPm25_700 &&
    existsPm25_1400 &&
    existsPm25_5400 &&
    existsPm25_10200;
  const pm25_40 = existsPm25
    ? chart.data.map((item) => parseFloat(item.pm25_40.toFixed(2)))
    : [];
  const pm25_700 = existsPm25_700
    ? chart.data.map((item) => parseFloat(item.pm25_700.toFixed(2)))
    : [];
  const pm25_1400 = existsPm25_1400
    ? chart.data.map((item) => parseFloat(item.pm25_1400.toFixed(2)))
    : [];
  const pm25_5400 = existsPm25_5400
    ? chart.data.map((item) => parseFloat(item.pm25_5400.toFixed(2)))
    : [];
  const pm25_10200 = existsPm25_10200
    ? chart.data.map((item) => parseFloat(item.pm25_10200.toFixed(2)))
    : [];
  const optionsPm25 = {
    chart: {
      type: "line",
      zoomType: "x",
      backgroundColor: "rgba(0,0,0,0)",
    },
    title: {
      text: "Material Micro-particulado 2.5nm (ug/m³)",
      align: "center",
    },
    subtitle: {
      text: "Fonte: CPTEC",
      align: "center",
    },
    yAxis: {
      title: {
        text: "Material Micro-particulado",
      },
    },
    xAxis: {
      type: "datetime",
      offset: 40,
    },
    plotOptions: {
      series: {
        // Configura o eixo X para ser a partir da data fornecida
        pointStart: pointStart,
        pointInterval: 108e5,
      },
    },
    series: [
      {
        data: pm25_40,
        name: "40 metros do solo",
        showInLegend: true,
        tooltip: {
          valueSuffix: " ug/m³",
        },
      },
      {
        data: pm25_700,
        name: "700 metros do solo",
        showInLegend: true,
        tooltip: {
          valueSuffix: " ug/m³",
        },
      },
      {
        data: pm25_1400,
        name: "1400 metros do solo",
        showInLegend: true,
        tooltip: {
          valueSuffix: " ug/m³",
        },
      },
      {
        data: pm25_5400,
        name: "5400 metros do solo",
        showInLegend: true,
        tooltip: {
          valueSuffix: " ug/m³",
        },
      },
      {
        data: pm25_10200,
        name: "10200 metros do solo",
        showInLegend: true,
        tooltip: {
          valueSuffix: " ug/m³",
        },
      },
    ],
  };

  // Type Options
  let options = "";
  if (type === "tempPressPrec") {
    if (!existsTempPressPrec) {
      return null;
    }
    options = optionsTempPressPrec;
  } else if (type === "tempMinMaxMedia") {
    if (!existsTempMinMax) {
      return null;
    }
    options = optionsTempMinMaxMedia;
  } else if (type === "press") {
    if (!existsPress) {
      return null;
    }
    options = optionsPress;
  } else if (type === "prec") {
    if (!existsPrec) {
      return null;
    }
    options = optionsPrec;
  } else if (type === "wind") {
    if (!existsWind) {
      return null;
    }
    options = optionsWind;
  } else if (type === "ur") {
    if (!existsUr) {
      return null;
    }
    options = optionsUr;
  } else if (type === "cloud") {
    if (!existsCloud) {
      return null;
    }
    options = optionsCloud;
  } else if (type === "co") {
    if (!existsCo) {
      return null;
    }
    options = optionsCo;
  } else if (type === "pm25") {
    if (!existsPm25) {
      return null;
    }
    options = optionsPm25;
  }

  //console.log("chart", chart);

  return (
    <div>
      <p className="pt-4 -mb-2 text-center">{chart.area}</p>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
