import imgLogoInpe from "../assets/inpe-logo.png";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMore from "highcharts/highcharts-more";
import highchartsWindbarb from "highcharts/modules/windbarb";
import highchartsHeatMap from "highcharts/modules/heatmap";
import highchartsVector from "highcharts/modules/vector";
import highchartsAcessibility from "highcharts/modules/accessibility";
import highchartsExport from "highcharts/modules/exporting";
import highchartsExportData from "highcharts/modules/export-data";
import highchartsBoost from "highcharts/modules/boost";
highchartsMore(Highcharts);
highchartsWindbarb(Highcharts);
highchartsHeatMap(Highcharts);
highchartsVector(Highcharts);
highchartsAcessibility(Highcharts);
highchartsExport(Highcharts);
highchartsExportData(Highcharts);
highchartsBoost(Highcharts);

export default function Chart({
  city,
  date,
  dataCharts = null,
  dataCsv = null,
  product,
}) {
  const dateTime = `${date.year}-${date.month}-${date.day} ${date.turn}:00:00`;
  const pointStart = Date.UTC(
    parseInt(dateTime.substr(0, 4)),
    parseInt(dateTime.substr(5, 2)) - 1,
    parseInt(dateTime.substr(8, 2)),
    parseInt(dateTime.substr(11, 2)),
    parseInt(dateTime.substr(14, 2)),
    parseInt(dateTime.substr(17, 2))
  );

  // console.log("date", date);
  // console.log("dataCharts", dataCharts);
  // console.log("dataCsv", dataCsv);
  // console.log("product", product);

  // Função para converter CSV em dados para o heatmap
  const parseCsvToHeatmapData = (csvString, valueType) => {
    const rows = csvString.trim().split("\n");
    const data = [];
    const headers = rows[0].split(",");

    let minDate = Infinity;
    let maxDate = -Infinity;

    // Iterar sobre as linhas de dados
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(",");
      const date = new Date(row[0] + " UTC").getTime(); // Coluna 'date' transformada em timestamp UTC
      const elevation = parseFloat(row[1]); // Coluna 'elevation'
      const co = parseFloat(row[2]); // Coluna 'co'
      const pm25 = parseFloat(row[3]); // Coluna 'pm25'
      const nox = parseFloat(row[4]); // Coluna 'nox'

      // Para fazer o gráfico de vento, é preciso de quatro valores:
      // - Eixo X: date
      // - Eixo Y: elevation
      // - Comprimento: speed
      // - Ângulo: wdir
      const wdir = parseFloat(Number(row[5]).toFixed(4)); // Coluna 'wdir'
      const speed = parseFloat(Number(row[6]).toFixed(2)); // Coluna 'speed'

      // Verificar min e max da data
      if (date < minDate) minDate = date;
      if (date > maxDate) maxDate = date;

      // Escolhe o valor que quer plotar no heatmap (co, pm25 ou nox)
      let valueToPlot;
      if (valueType === "co") {
        valueToPlot = co;
      } else if (valueType === "pm25") {
        valueToPlot = pm25;
      } else if (valueType === "nox") {
        valueToPlot = nox;
      } else if (valueType === "wind") {
        valueToPlot = [speed, wdir]; // Adiciona speed e wdir como elementos separados em um array
      } else {
        valueToPlot = co; // Valor padrão
      }

      // Para gráficos de vento, adiciona speed e wdir como elementos separados
      if (valueType === "wind") {
        data.push([date, elevation, ...valueToPlot]); // Espalha os valores de speed e wdir
      } else {
        data.push([date, elevation, valueToPlot]); // Adiciona o valor escolhido
      }
    }

    return { data, minDate, maxDate };
  };

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
      exitFullscreen: "Sair da tela cheia",
      viewData: "Ver tabela de dados",
      hideData: "Ocultar tabela de dados",
    },
    accessibility: {
      enabled: false,
    },
    credits: {
      enabled: false,
      text: "Previsão numérica do CPTEC",
      href: "https://previsaonumerica.cptec.inpe.br",
      position: {
        x: 0,
      },
    },
  });

  // Type Options of the chart
  let options = "";

  // Temperatura, pressão e precipitação
  if (product === "tempPressPrec") {
    const existsItemp = dataCharts.data.some((item) =>
      item.hasOwnProperty("temp")
    );
    const existsIpress = dataCharts.data.some((item) =>
      item.hasOwnProperty("press")
    );
    const existsIprec = dataCharts.data.some((item) =>
      item.hasOwnProperty("prec")
    );
    const existsTempPressPrec = existsItemp && existsIpress && existsIprec;
    if (!existsTempPressPrec) {
      return null;
    }
    const iTemp = existsItemp
      ? dataCharts.data.map((item) => parseFloat(item.temp.toFixed(1)))
      : [];
    const iPress = existsIpress
      ? dataCharts.data.map((item) => parseFloat(item.press.toFixed(1)))
      : [];
    const iPrec = existsIprec
      ? dataCharts.data.map((item) => parseFloat(item.prec.toFixed(1)))
      : [];
    const optionsTempPressPrec = {
      chart: {
        zoomType: "xy",
        backgroundColor: "transparent",
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
    options = optionsTempPressPrec;
  }

  // Temperatura mínima, máxima e média
  if (product === "tempMinMaxMedia") {
    const existsTemp_mn = dataCharts.data.some((item) =>
      item.hasOwnProperty("temp_mn")
    );
    const existsTemp_mx = dataCharts.data.some((item) =>
      item.hasOwnProperty("temp_mx")
    );
    const existsTempMinMax = existsTemp_mn && existsTemp_mx;
    if (!existsTempMinMax) {
      return null;
    }
    const tempMinMax = existsTempMinMax
      ? dataCharts.data.map((item) => [
          parseFloat(item.temp_mn.toFixed(2)),
          parseFloat(item.temp_mx.toFixed(2)),
        ])
      : [];
    const tempAverage = existsTempMinMax
      ? dataCharts.data.map((item) =>
          parseFloat(
            ((parseFloat(item.temp_mn) + parseFloat(item.temp_mx)) / 2).toFixed(
              2
            )
          )
        )
      : [];
    const optionsTempMinMaxMedia = {
      chart: {
        type: "arearange",
        zoomType: "x",
        scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1,
        },
        backgroundColor: "transparent",
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
    options = optionsTempMinMaxMedia;
  }

  // Pressão
  if (product === "press") {
    const existsPress = dataCharts.data.some((item) =>
      item.hasOwnProperty("prec")
    );
    if (!existsPress) {
      return null;
    }
    const press = existsPress
      ? dataCharts.data.map((item) => parseFloat(item.press.toFixed(2)))
      : [];
    const optionsPress = {
      chart: {
        zoomType: "x",
        backgroundColor: "transparent",
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
    options = optionsPress;
  }

  // Precipitação
  if (product === "prec") {
    const existsPrec = dataCharts.data.some((item) =>
      item.hasOwnProperty("prec")
    );
    if (!existsPrec) {
      return null;
    }
    const prec = existsPrec
      ? dataCharts.data.map((item) => parseFloat(item.prec.toFixed(2)))
      : [];
    const optionsPrec = {
      chart: {
        type: "area",
        zoomType: "x",
        backgroundColor: "transparent",
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
    options = optionsPrec;
  }

  // Vento
  if (product === "wind") {
    const existsWind = dataCharts.data.some((item) =>
      item.hasOwnProperty("wind")
    );
    if (!existsWind) {
      return null;
    }
    const wind = existsWind
      ? dataCharts.data.map((item) => [
          parseFloat(item.wind_speed.toFixed(2)),
          parseFloat(item.wind_dir.toFixed(2)),
        ])
      : [];
    const optionsWind = {
      chart: {
        zoomType: "x",
        backgroundColor: "transparent",
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
    options = optionsWind;
  }

  // Umidade relativa
  if (product === "ur") {
    const existsUr = dataCharts.data.some((item) => item.hasOwnProperty("ur"));
    if (!existsUr) {
      return null;
    }
    const ur = existsUr
      ? dataCharts.data.map((item) => parseFloat(item.ur.toFixed(2)))
      : [];
    const optionsUr = {
      chart: {
        zoomType: "x",
        backgroundColor: "transparent",
      },
      title: {
        text: "Umidade Relativa a 2m (%)",
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
    options = optionsUr;
  }

  // Nuvens
  if (product === "cloud") {
    const existsLowCloud = dataCharts.data.some((item) =>
      item.hasOwnProperty("low_cloud")
    );
    const existsMidCloud = dataCharts.data.some((item) =>
      item.hasOwnProperty("mid_cloud")
    );
    const existsHighCloud = dataCharts.data.some((item) =>
      item.hasOwnProperty("high_cloud")
    );
    const existsCloud = existsLowCloud && existsMidCloud && existsHighCloud;
    if (!existsCloud) {
      return null;
    }
    const lowCloud = existsLowCloud
      ? dataCharts.data.map((item) => parseFloat(item.low_cloud.toFixed(2)))
      : [];
    const midCloud = existsMidCloud
      ? dataCharts.data.map((item) => parseFloat(item.mid_cloud.toFixed(2)))
      : [];
    const highCloud = existsHighCloud
      ? dataCharts.data.map((item) => parseFloat(item.high_cloud.toFixed(2)))
      : [];
    const optionsCloud = {
      chart: {
        type: "area",
        zoomType: "x",
        backgroundColor: "transparent",
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
    options = optionsCloud;
  }

  // Monóxido de carbono
  if (product === "co") {
    const existsCo_40 = dataCharts.data.some((item) =>
      item.hasOwnProperty("co_40")
    );
    const existsCo_700 = dataCharts.data.some((item) =>
      item.hasOwnProperty("co_700")
    );
    const existsCo_1400 = dataCharts.data.some((item) =>
      item.hasOwnProperty("co_1400")
    );
    const existsCo_5400 = dataCharts.data.some((item) =>
      item.hasOwnProperty("co_5400")
    );
    const existsCo_10200 = dataCharts.data.some((item) =>
      item.hasOwnProperty("co_10200")
    );
    const existsCo =
      existsCo_40 &&
      existsCo_700 &&
      existsCo_1400 &&
      existsCo_5400 &&
      existsCo_10200;
    if (!existsCo) {
      return null;
    }
    const co_40 = existsCo_40
      ? dataCharts.data.map((item) => parseFloat(item.co_40.toFixed(2)))
      : [];
    const co_700 = existsCo_700
      ? dataCharts.data.map((item) => parseFloat(item.co_700.toFixed(2)))
      : [];
    const co_1400 = existsCo_1400
      ? dataCharts.data.map((item) => parseFloat(item.co_1400.toFixed(2)))
      : [];
    const co_5400 = existsCo_5400
      ? dataCharts.data.map((item) => parseFloat(item.co_5400.toFixed(2)))
      : [];
    const co_10200 = existsCo_10200
      ? dataCharts.data.map((item) => parseFloat(item.co_10200.toFixed(2)))
      : [];
    const optionsCo = {
      chart: {
        type: "line",
        zoomType: "x",
        backgroundColor: "transparent",
      },
      title: {
        text: "Monóxido de Carbono (ppbv)",
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
          name: "40 metros",
          showInLegend: true,
          tooltip: {
            valueSuffix: " ppbv",
          },
        },
        {
          data: co_700,
          name: "700 metros",
          showInLegend: true,
          tooltip: {
            valueSuffix: " ppbv",
          },
        },
        {
          data: co_1400,
          name: "1400 metros",
          showInLegend: true,
          tooltip: {
            valueSuffix: " ppbv",
          },
        },
        {
          data: co_5400,
          name: "5400 metros",
          showInLegend: true,
          tooltip: {
            valueSuffix: " ppbv",
          },
        },
        {
          data: co_10200,
          name: "10200 metros",
          showInLegend: true,
          tooltip: {
            valueSuffix: " ppbv",
          },
        },
      ],
    };
    options = optionsCo;
  }

  // Material micro-particulado
  if (product === "pm25") {
    const existsPm25_40 = dataCharts.data.some((item) =>
      item.hasOwnProperty("pm25_40")
    );
    const existsPm25_700 = dataCharts.data.some((item) =>
      item.hasOwnProperty("pm25_700")
    );
    const existsPm25_1400 = dataCharts.data.some((item) =>
      item.hasOwnProperty("pm25_1400")
    );
    const existsPm25_5400 = dataCharts.data.some((item) =>
      item.hasOwnProperty("pm25_5400")
    );
    const existsPm25_10200 = dataCharts.data.some((item) =>
      item.hasOwnProperty("pm25_10200")
    );
    const existsPm25 =
      existsPm25_40 &&
      existsPm25_700 &&
      existsPm25_1400 &&
      existsPm25_5400 &&
      existsPm25_10200;
    if (!existsPm25) {
      return null;
    }
    const pm25_40 = existsPm25
      ? dataCharts.data.map((item) => parseFloat(item.pm25_40.toFixed(2)))
      : [];
    const pm25_700 = existsPm25_700
      ? dataCharts.data.map((item) => parseFloat(item.pm25_700.toFixed(2)))
      : [];
    const pm25_1400 = existsPm25_1400
      ? dataCharts.data.map((item) => parseFloat(item.pm25_1400.toFixed(2)))
      : [];
    const pm25_5400 = existsPm25_5400
      ? dataCharts.data.map((item) => parseFloat(item.pm25_5400.toFixed(2)))
      : [];
    const pm25_10200 = existsPm25_10200
      ? dataCharts.data.map((item) => parseFloat(item.pm25_10200.toFixed(2)))
      : [];
    const optionsPm25 = {
      chart: {
        type: "line",
        zoomType: "x",
        backgroundColor: "transparent",
      },
      title: {
        text: "Material Particulado - 2.5um (µg/m3)",
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
          name: "40 metros",
          showInLegend: true,
          tooltip: {
            valueSuffix: " µg/m³",
          },
        },
        {
          data: pm25_700,
          name: "700 metros",
          showInLegend: true,
          tooltip: {
            valueSuffix: " µg/m³",
          },
        },
        {
          data: pm25_1400,
          name: "1400 metros",
          showInLegend: true,
          tooltip: {
            valueSuffix: " µg/m³",
          },
        },
        {
          data: pm25_5400,
          name: "5400 metros",
          showInLegend: true,
          tooltip: {
            valueSuffix: " µg/m³",
          },
        },
        {
          data: pm25_10200,
          name: "10200 metros",
          showInLegend: true,
          tooltip: {
            valueSuffix: " µg/m³",
          },
        },
      ],
    };
    options = optionsPm25;
  }

  // console.log("dataCsv", dataCsv)
  // console.log("parseCsvToHeatmapData(dataCsv, 'co')", parseCsvToHeatmapData(dataCsv, "co"))
  // console.log("parseCsvToHeatmapData(dataCsv, 'pm25')", parseCsvToHeatmapData(dataCsv, "pm25"))
  // console.log("parseCsvToHeatmapData(dataCsv, 'nox')", parseCsvToHeatmapData(dataCsv, "nox"))

  // Heatmap de monóxido de carbono
  if (product === "csvCo") {
    const { data, minDate, maxDate } = parseCsvToHeatmapData(dataCsv, "co");
    const customLabels = {
      1: "39",
      2: "122",
      3: "212",
      4: "309",
      5: "413",
      6: "527",
      7: "649",
      8: "781",
      9: "923",
      10: "1077",
      11: "1243",
      12: "1423",
      13: "1617",
      14: "1826",
      15: "2052",
      16: "2297",
      17: "2560",
      18: "2845",
      19: "3153",
      20: "3485",
      21: "3844",
      22: "4231",
      23: "4650",
      24: "5102",
      25: "5590",
      26: "6117",
      27: "6687",
      28: "7301",
      29: "7966",
      30: "8683",
      31: "9459",
      32: "10290",
    };
    const optionsHeatmapCo = {
      chart: {
        type: "heatmap",
        backgroundColor: "transparent",
        height: "100%",
      },
      title: {
        text: "Heatmap - Monóxido de Carbono (CO)",
        align: "left",
        x: 40,
      },
      subtitle: {
        text: "Variação de CO ao longo da elevação e do tempo",
        align: "left",
        x: 40,
      },
      xAxis: {
        type: "datetime", // O eixo x será baseado na data e hora
        min: minDate, // Valor mínimo da data
        max: maxDate, // Valor máximo da data
        labels: {
          align: "left",
          x: 5,
          y: 14,
          format: "{value:%d/%m %Hh}", // Formato da data
        },
        showLastLabel: false,
        tickLength: 16,
      },
      yAxis: {
        title: {
          text: "Elevação em 32 níveis (m)", // O eixo y representa a elevação
        },
        labels: {
          formatter: function () {
            return customLabels[this.value] || this.value; // Retorna o label personalizado
          },
        },
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [4, 8, 12, 16, 20, 24, 28, 32], // Posições do eixo y em níveis
        tickWidth: 1,
        min: 1,
        max: 32, // Configuração para 32 níveis de elevação
        reversed: false,
      },
      colorAxis: {
        stops: [
          [0, "#3060cf"], // Azul para valores baixos
          [0.5, "#fffbbc"], // Amarelo para valores médios
          [1, "#c4463a"], // Vermelho para valores altos
        ],
        min: 0,
        max: 500,
        startOnTick: false,
        endOnTick: false,
        labels: {
          format: "{value} ppm",
        },
      },
      legend: {
        align: "center",
        symbolWidth: 420,
      },
      series: [
        {
          data: data, // Função que processa o CSV e gera os dados
          boostThreshold: 100,
          borderWidth: 0,
          nullColor: "#EFEFEF",
          colsize: 3 * 36e5, // Intervalo de 3 horas (ajuste conforme necessidade)
          tooltip: {
            headerFormat: "Concentração de CO<br/>",
            pointFormat:
              "{point.x:%d/%m %H:%M}, elevação: {point.y} m: <b>{point.value} ppm</b>",
          },
        },
      ],
    };
    options = optionsHeatmapCo;
  }

  // Heatmap de material micro-particulado
  if (product === "csvPm25") {
    const { data, minDate, maxDate } = parseCsvToHeatmapData(dataCsv, "pm25");
    const customLabels = {
      1: "39",
      2: "122",
      3: "212",
      4: "309",
      5: "413",
      6: "527",
      7: "649",
      8: "781",
      9: "923",
      10: "1077",
      11: "1243",
      12: "1423",
      13: "1617",
      14: "1826",
      15: "2052",
      16: "2297",
      17: "2560",
      18: "2845",
      19: "3153",
      20: "3485",
      21: "3844",
      22: "4231",
      23: "4650",
      24: "5102",
      25: "5590",
      26: "6117",
      27: "6687",
      28: "7301",
      29: "7966",
      30: "8683",
      31: "9459",
      32: "10290",
    };
    const optionsHeatmapPm25 = {
      chart: {
        type: "heatmap",
        backgroundColor: "transparent",
        height: "100%",
      },
      title: {
        text: "Heatmap - Material Micro-particulado (PM25)",
        align: "center",
        x: 40,
      },
      subtitle: {
        text: "Variação de PM25 ao longo da elevação e do tempo",
        align: "center",
        x: 40,
      },
      xAxis: {
        type: "datetime", // O eixo x será baseado na data e hora
        min: minDate, // Valor mínimo da data
        max: maxDate, // Valor máximo da data
        labels: {
          align: "left",
          x: 5,
          y: 14,
          format: "{value:%d/%m %Hh}", // Formato da data
        },
        showLastLabel: false,
        tickLength: 16,
      },
      yAxis: {
        title: {
          text: "Elevação em 32 níveis (m)", // O eixo y representa a elevação
        },
        labels: {
          formatter: function () {
            return customLabels[this.value] || this.value; // Retorna o label personalizado
          },
        },
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [4, 8, 12, 16, 20, 24, 28, 32], // Posições do eixo y em níveis
        tickWidth: 1,
        min: 1,
        max: 32, // Configuração para 32 níveis de elevação
        reversed: false,
      },
      colorAxis: {
        stops: [
          [0, "#3060cf"], // Azul para valores baixos
          [0.5, "#fffbbc"], // Amarelo para valores médios
          [1, "#c4463a"], // Vermelho para valores altos
        ],
        min: 0,
        max: 10,
        startOnTick: false,
        endOnTick: false,
        labels: {
          format: "{value} µg/m³",
        },
      },
      legend: {
        align: "center",
        symbolWidth: 420,
      },
      series: [
        {
          data: data, // Função que processa o CSV e gera os dados
          boostThreshold: 100,
          borderWidth: 0,
          nullColor: "#EFEFEF",
          colsize: 3 * 36e5, // Intervalo de 3 horas (ajuste conforme necessidade)
          tooltip: {
            headerFormat: "Concentração de PM25<br/>",
            pointFormat:
              "{point.x:%d/%m %H:%M}, elevação: {point.y} m: <b>{point.value} µg/m³</b>",
          },
        },
      ],
    };
    options = optionsHeatmapPm25;
  }

  // Heatmap de óxidos de nitrogenio
  if (product === "csvNox") {
    const { data, minDate, maxDate } = parseCsvToHeatmapData(dataCsv, "nox");
    const customLabels = {
      1: "39",
      2: "122",
      3: "212",
      4: "309",
      5: "413",
      6: "527",
      7: "649",
      8: "781",
      9: "923",
      10: "1077",
      11: "1243",
      12: "1423",
      13: "1617",
      14: "1826",
      15: "2052",
      16: "2297",
      17: "2560",
      18: "2845",
      19: "3153",
      20: "3485",
      21: "3844",
      22: "4231",
      23: "4650",
      24: "5102",
      25: "5590",
      26: "6117",
      27: "6687",
      28: "7301",
      29: "7966",
      30: "8683",
      31: "9459",
      32: "10290",
    };
    const optionsHeatmapNox = {
      chart: {
        type: "heatmap",
        backgroundColor: "transparent",
        height: "100%",
      },
      title: {
        text: "Óxidos de Nitrogênio (NOx)",
        align: "center",
        x: 40,
      },
      subtitle: {
        text: "Variação de NOx ao longo da elevação e do tempo",
        align: "center",
        x: 40,
      },
      xAxis: {
        type: "datetime", // O eixo x será baseado na data e hora
        min: minDate, // Valor mínimo da data
        max: maxDate, // Valor máximo da data
        labels: {
          align: "left",
          x: 5,
          y: 14,
          format: "{value:%d/%m %Hh}", // Formato da data
        },
        showLastLabel: false,
        tickLength: 16,
      },
      yAxis: {
        title: {
          text: "Elevação em 32 níveis (m)", // O eixo y representa a elevação
        },
        labels: {
          formatter: function () {
            return customLabels[this.value] || this.value; // Retorna o label personalizado
          },
        },
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [4, 8, 12, 16, 20, 24, 28, 32], // Posições do eixo y em níveis
        tickWidth: 1,
        min: 1,
        max: 32, // Configuração para 32 níveis de elevação
        reversed: false,
      },
      colorAxis: {
        stops: [
          [0, "#3060cf"], // Azul para valores baixos
          [0.5, "#fffbbc"], // Amarelo para valores médios
          [1, "#c4463a"], // Vermelho para valores altos
        ],
        min: 0,
        max: 1,
        startOnTick: false,
        endOnTick: false,
        labels: {
          format: "{value} ppbv",
        },
      },
      legend: {
        align: "center",
        symbolWidth: 420,
      },
      series: [
        {
          data: data, // Função que processa o CSV e gera os dados
          boostThreshold: 100,
          borderWidth: 0,
          nullColor: "#EFEFEF",
          colsize: 3 * 36e5, // Intervalo de 3 horas (ajuste conforme necessidade)
          tooltip: {
            headerFormat: "Óxidos de Nitrogênio<br/>",
            pointFormatter: function () {
              const level = this.y; // Obtem o nível da elevação
              return `${Highcharts.dateFormat(
                "%d/%m %H:%M",
                this.x
              )}, elevação: nível ${level}: ${customLabels[level]}: <b>${
                this.value
              } ppbv</b>`;
            },
          },
        },
      ],
    };
    options = optionsHeatmapNox;
  }

  // Vector plot de vento
  if (product === "csvWind") {
    const { data, minDate, maxDate } = parseCsvToHeatmapData(dataCsv, "wind");
    const customLabels = {
      1: "39",
      2: "122",
      3: "212",
      4: "309",
      5: "413",
      6: "527",
      7: "649",
      8: "781",
      9: "923",
      10: "1077",
      11: "1243",
      12: "1423",
      13: "1617",
      14: "1826",
      15: "2052",
      16: "2297",
      17: "2560",
      18: "2845",
      19: "3153",
      20: "3485",
      21: "3844",
      22: "4231",
      23: "4650",
      24: "5102",
      25: "5590",
      26: "6117",
      27: "6687",
      28: "7301",
      29: "7966",
      30: "8683",
      31: "9459",
      32: "10290",
    };
    const optionsWind = {
      chart: {
        backgroundColor: "transparent",
        height: "100%",
      },
      boost: {
        useGPUTranslations: true, // Utiliza GPU para renderização
        seriesThreshold: 1, // Ativa o boost para qualquer gráfico
      },
      plotOptions: {
        series: {
          turboThreshold: 5000, // Necessário para exibir as setinhas. Deve ser igual ou maior que a quantidade de elementos do array "data" que vem do parseCsvToHeatmapData(dataCsv, "wind"). Se tiver 1056 elementos esse array, deve ser maior ou igual a 1056. É bom deixar um valor bem alto para que sejam exibidas as setinhas.
        },
      },
      title: {
        text: "Direção e velocidade do vento",
        align: "center",
        x: 40,
      },
      subtitle: {
        text: "Variação de direção e velocidade do vento ao longo da elevação e do tempo",
        align: "center",
        x: 40,
      },
      xAxis: {
        title: {
          text: "Tempo/Datas",
        },
        min: minDate,
        max: maxDate,
        type: "datetime",
        gridLineWidth: 1,
      },
      yAxis: {
        title: {
          text: "Elevação em 32 níveis (m)", // O eixo y representa a elevação
        },
        labels: {
          formatter: function () {
            return customLabels[this.value] || this.value; // Retorna o label personalizado
          },
        },
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [4, 8, 12, 16, 20, 24, 28, 32], // Posições do eixo y em níveis
        tickWidth: 1,
        min: 1,
        max: 32, // Configuração para 32 níveis de elevação
        reversed: false,
      },
      series: [
        {
          data: data,
          type: "vector",
          name: "Direção e velocidade do vento",
          color: Highcharts.getOptions().colors[1],
          tooltip: {
            headerFormat: "Direção e velocidade do vento<br/>", // Cabeçalho do tooltip
            pointFormatter: function () {
              const date = Highcharts.dateFormat("%d/%m %H:%M", this.x); // Formata a data
              const elevationLevel = this.y; // Nível da elevação
              const speed = this.series.data[this.index].length; // Velocidade (deve ser passada no data)
              const direction = this.series.data[this.index].direction; // Direção (deve ser passada no data)
              return (
                `Data: ${date}<br/>` +
                `Elevação: nível ${elevationLevel}: <b>${customLabels[elevationLevel]} m</b><br/>` +
                `Velocidade: <b>${speed} m/s</b><br/>` +
                `Direção: <b>${direction}°</b>`
              );
            },
          },
        },
      ],
    };
    options = optionsWind;
  }

  // Heatmap e vector plot de vento e monóxido de carbono
  if (product === "csvWindCo") {
    const {
      data: dataCo,
      minDate,
      maxDate,
    } = parseCsvToHeatmapData(dataCsv, "co");
    const { data: dataWind } = parseCsvToHeatmapData(dataCsv, "wind");
    const dataWindColor = dataWind.map((point) => ({
      x: point[0], // Assumindo que a primeira posição é x
      y: point[1], // Assumindo que a segunda posição é y
      length: point[2], // Assumindo que a terceira posição é a velocidade
      direction: point[3], // Assumindo que a quarta posição é a direção
      color: "#000000", // Cor preta para as setas
    }));
    const customLabels = {
      1: "39",
      2: "122",
      3: "212",
      4: "309",
      5: "413",
      6: "527",
      7: "649",
      8: "781",
      9: "923",
      10: "1077",
      11: "1243",
      12: "1423",
      13: "1617",
      14: "1826",
      15: "2052",
      16: "2297",
      17: "2560",
      18: "2845",
      19: "3153",
      20: "3485",
      21: "3844",
      22: "4231",
      23: "4650",
      24: "5102",
      25: "5590",
      26: "6117",
      27: "6687",
      28: "7301",
      29: "7966",
      30: "8683",
      31: "9459",
      32: "10290",
    };
    const stops = [
      [0, "#FFFFFF"],
      [50, "#B9EBDF"],
      [100, "#D2F0DD"],
      [150, "#FDF4D3"],
      [200, "#F3EB99"],
      [300, "#F5D263"],
      [400, "#FCB419"],
      [500, "#FD7647"],
      [750, "#FD4D2E"],
      [1000, "#FF2C1A"],
      [1500, "#FD0301"],
      [2000, "#D90C44"],
      [2500, "#D00B76"],
      [3000, "#9725C2"],
      [4250, "#750476"],
    ];
    const generateLegend = (idChart) => {
      // Gerar a legenda personalizada com o gradiente
      const gradientStops = stops
        .map(([value, color], index) => {
          const stopPercentage = (index / (stops.length - 1)) * 100; // Distribuir uniformemente no gradiente
          return `${color} ${stopPercentage}%`;
        })
        .join(", ");
      // A legenda HTML
      const legendHTML = `
        <div class="w-full flex justify-center items-center">
          <div class="flex-1 text-center text-sm mx-2">
            <div class="w-full flex flex-col items-center overflow-x-auto mt-1 mb-3">
              <div class="w-full h-3 rounded" style="background: linear-gradient(to right, ${gradientStops});"></div>
              <div class="flex justify-between w-full mt-1">
                ${stops
                  .map(([value]) => {
                    return `
                      <span class="flex-1 text-center text-sm">${value}</span>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </div>
          <div>
            <a
              href="https://www.gov.br/acessoainformacao/pt-br"
              className="flex items-center justify-center p-2"
            >
              <img
                src=${imgLogoInpe}
                alt="INPE"
                class="max-w-14 lg:max-w-16"
              />
            </a>
          </div>
        </div>
      `;
      // Inserir a legenda no DOM
      document
        .getElementById(idChart)
        .insertAdjacentHTML("afterend", legendHTML);
    };
    const optionsHeatmapVectorWindCo = {
      chart: {
        backgroundColor: "transparent",
        height: "100%",
        events: {
          load: function () {
            // Aqui, 'this' refere-se à instância do gráfico
            const chart = this;
            console.log("chart", chart);
            console.log("chart container id", chart.container.id);
            // Chamar a função global para gerar a legenda personalizada
            generateLegend(chart.container.id);
          },
        },
      },
      boost: {
        useGPUTranslations: true, // Utiliza GPU para renderização
        seriesThreshold: 1, // Ativa o boost para qualquer gráfico
      },
      plotOptions: {
        series: {
          turboThreshold: 5000, // Necessário para exibir as setinhas. Deve ser igual ou maior que a quantidade de elementos do array "data" que vem do parseCsvToHeatmapData(dataCsv, "wind"). Se tiver 1056 elementos esse array, deve ser maior ou igual a 1056. É bom deixar um valor bem alto para que sejam exibidas as setinhas.
        },
      },
      title: {
        text: "Vento e Monóxido de Carbono (ppbv)",
        align: "center",
        x: 40,
      },
      xAxis: {
        type: "datetime", // O eixo x será baseado na data e hora
        min: minDate, // Valor mínimo da data
        max: maxDate, // Valor máximo da data
        labels: {
          align: "left",
          x: 5,
          y: 14,
          format: "{value:%d/%m %Hh}", // Formato da data
        },
        showLastLabel: false,
        tickLength: 16,
      },
      yAxis: {
        title: {
          text: "Altitude (m)", // O eixo y representa a elevação
        },
        labels: {
          formatter: function () {
            return customLabels[this.value] || this.value; // Retorna o label personalizado
          },
        },
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [4, 8, 12, 16, 20, 24, 28, 32], // Posições do eixo y em níveis
        tickWidth: 1,
        min: 1,
        max: 32, // Configuração para 32 níveis de elevação
        reversed: false,
      },
      colorAxis: {
        min: 0,
        max: 1,
        stops: stops,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: dataCo, // Função que processa o CSV e gera os dados
          name: "Monóxido de carbono (CO)",
          type: "heatmap",
          borderWidth: 0,
          colsize: 3 * 36e5, // Intervalo de 3 horas (ajuste conforme necessidade)
          tooltip: {
            shared: true, // Compartilha o tooltip com heatmap e vetor
            headerFormat:
              "Direção e velocidade do vento com monóxido de carbono<br/>",
            pointFormatter: function () {
              const date = Highcharts.dateFormat("%d/%m %H:%M", this.x);
              const elevationLevel = this.y;

              // Encontra os dados na série heatmap
              const heatmapIndex = dataCo.findIndex(
                (item) => item[0] === this.x && item[1] === this.y
              );
              const co =
                heatmapIndex !== -1
                  ? dataCo[heatmapIndex][2]
                  : "não disponível";

              // Encontra a velocidade e direção do vento na série vector (dataWind)
              const windPoint = dataWind.find(
                (item) => item[0] === this.x && item[1] === this.y
              );
              const speed = windPoint ? windPoint[2] : "não disponível";
              const direction = windPoint ? windPoint[3] : "não disponível";

              return (
                `Data: ${date}<br/>` +
                `Elevação: nível ${elevationLevel}: <b>${customLabels[elevationLevel]} m</b><br/>` +
                `Velocidade: <b>${speed} m/s</b><br/>` +
                `Direção: <b>${direction}°</b><br/>` +
                `Concentração de CO: <b>${co} ppbv</b>`
              );
            },
          },
          point: {
            events: {
              mouseOver: function () {
                // Destaca as setas correspondentes no vetor
                const vectorData = this.series.chart.series[1]; // A série do vetor
                const correspondingWind = vectorData.data.find(
                  (point) => point.x === this.x && point.y === this.y
                );
                if (correspondingWind) {
                  correspondingWind.setState("hover"); // Aplica o estado hover
                }
              },
              mouseOut: function () {
                // Restaura o estado das setas
                const vectorData = this.series.chart.series[1];
                vectorData.data.forEach((point) => {
                  point.setState("");
                });
              },
            },
          },
          enableMouseTracking: true,
        },
        {
          data: dataWindColor,
          type: "vector",
          name: "Direção e velocidade do vento",
          color: Highcharts.getOptions().colors[1],
          tooltip: {
            enabled: false, // Desabilita o tooltip para a série de vetor
          },
          enableMouseTracking: false,
          states: {
            inactive: {
              opacity: 1, // Mantém a série de vetor totalmente opaca quando outra série está em foco
            },
            hover: {
              enabled: true,
              brightness: 0.25, // Ajuste de brilho para hover
              color: "#000000", // Cor para o hover
            },
          },
        },
      ],
    };
    options = optionsHeatmapVectorWindCo;
  }

  // Heatmap e vector plot de vento e material micro-particulado
  if (product === "csvWindPm25") {
    const {
      data: dataPm25,
      minDate,
      maxDate,
    } = parseCsvToHeatmapData(dataCsv, "pm25");
    const { data: dataWind } = parseCsvToHeatmapData(dataCsv, "wind");
    const dataWindColor = dataWind.map((point) => ({
      x: point[0], // Assumindo que a primeira posição é x
      y: point[1], // Assumindo que a segunda posição é y
      length: point[2], // Assumindo que a terceira posição é a velocidade
      direction: point[3], // Assumindo que a quarta posição é a direção
      color: "#000000", // Cor preta para as setas
    }));
    const customLabels = {
      1: "39",
      2: "122",
      3: "212",
      4: "309",
      5: "413",
      6: "527",
      7: "649",
      8: "781",
      9: "923",
      10: "1077",
      11: "1243",
      12: "1423",
      13: "1617",
      14: "1826",
      15: "2052",
      16: "2297",
      17: "2560",
      18: "2845",
      19: "3153",
      20: "3485",
      21: "3844",
      22: "4231",
      23: "4650",
      24: "5102",
      25: "5590",
      26: "6117",
      27: "6687",
      28: "7301",
      29: "7966",
      30: "8683",
      31: "9459",
      32: "10290",
    };
    const stops = [
      [0, "#FFFFFF"],
      [12.5, "#B9EBDF"],
      [30, "#FDF4D3"],
      [55, "#F3EB99"],
      [80, "#FBB825"],
      [110, "#FF6E42"],
      [160, "#FF3E23"],
      [210, "#FD0901"],
      [275, "#D50B53"],
      [400, "#D00B76"],
      [450, "#9725C2"],
      [500, "#750476"],
    ];
    const generateLegend = (idChart) => {
      // Gerar a legenda personalizada com o gradiente
      const gradientStops = stops
        .map(([value, color], index) => {
          const stopPercentage = (index / (stops.length - 1)) * 100; // Distribuir uniformemente no gradiente
          return `${color} ${stopPercentage}%`;
        })
        .join(", ");
      // A legenda HTML
      const legendHTML = `
        <div class="w-full flex justify-center items-center">
          <div class="flex-1 text-center text-sm mx-2">
            <div class="w-full flex flex-col items-center overflow-x-auto mt-1 mb-3">
              <div class="w-full h-3 rounded" style="background: linear-gradient(to right, ${gradientStops});"></div>
              <div class="flex justify-between w-full mt-1">
                ${stops
                  .map(([value]) => {
                    return `
                      <span class="flex-1 text-center text-sm">${value}</span>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </div>
          <div>
            <a
              href="https://www.gov.br/acessoainformacao/pt-br"
              className="flex items-center justify-center p-2"
            >
              <img
                src=${imgLogoInpe}
                alt="INPE"
                class="max-w-14 lg:max-w-16"
              />
            </a>
          </div>
        </div>
      `;
      // Inserir a legenda no DOM
      document
        .getElementById(idChart)
        .insertAdjacentHTML("afterend", legendHTML);
    };
    const optionsHeatmapVectorWindPm25 = {
      chart: {
        backgroundColor: "transparent",
        height: "100%",
        events: {
          load: function () {
            // Aqui, 'this' refere-se à instância do gráfico
            const chart = this;
            console.log("chart", chart);
            console.log("chart container id", chart.container.id);
            // Chamar a função global para gerar a legenda personalizada
            generateLegend(chart.container.id);
          },
        },
      },
      boost: {
        useGPUTranslations: true, // Utiliza GPU para renderização
        seriesThreshold: 1, // Ativa o boost para qualquer gráfico
      },
      plotOptions: {
        series: {
          turboThreshold: 5000, // Necessário para exibir as setinhas. Deve ser igual ou maior que a quantidade de elementos do array "data" que vem do parseCsvToHeatmapData(dataCsv, "wind"). Se tiver 1056 elementos esse array, deve ser maior ou igual a 1056. É bom deixar um valor bem alto para que sejam exibidas as setinhas.
        },
      },
      title: {
        text: "Vento e Material Micro-particulado 2.5nm (µg/m³)",
        align: "center",
        x: 40,
      },
      xAxis: {
        type: "datetime", // O eixo x será baseado na data e hora
        min: minDate, // Valor mínimo da data
        max: maxDate, // Valor máximo da data
        labels: {
          align: "left",
          x: 5,
          y: 14,
          format: "{value:%d/%m %Hh}", // Formato da data
        },
        showLastLabel: false,
        tickLength: 16,
      },
      yAxis: {
        title: {
          text: "Altitude (m)", // O eixo y representa a elevação
        },
        labels: {
          formatter: function () {
            return customLabels[this.value] || this.value; // Retorna o label personalizado
          },
        },
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [4, 8, 12, 16, 20, 24, 28, 32], // Posições do eixo y em níveis
        tickWidth: 1,
        min: 1,
        max: 32, // Configuração para 32 níveis de elevação
        reversed: false,
      },
      colorAxis: {
        min: 0,
        max: 1,
        stops: stops,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: dataPm25, // Função que processa o CSV e gera os dados
          name: "Material Micro-particulado 2.5nm (µg/m³)",
          type: "heatmap",
          borderWidth: 0,
          colsize: 3 * 36e5, // Intervalo de 3 horas (ajuste conforme necessidade)
          tooltip: {
            shared: true, // Compartilha o tooltip com heatmap e vetor
            headerFormat:
              "Direção e velocidade do vento com material micro-particulado 2.5nm<br/>",
            pointFormatter: function () {
              const date = Highcharts.dateFormat("%d/%m %H:%M", this.x);
              const elevationLevel = this.y;

              // Encontra os dados na série heatmap
              const heatmapIndex = dataPm25.findIndex(
                (item) => item[0] === this.x && item[1] === this.y
              );
              const pm25 =
                heatmapIndex !== -1
                  ? dataPm25[heatmapIndex][2]
                  : "não disponível";

              // Encontra a velocidade e direção do vento na série vector (dataWind)
              const windPoint = dataWind.find(
                (item) => item[0] === this.x && item[1] === this.y
              );
              const speed = windPoint ? windPoint[2] : "não disponível";
              const direction = windPoint ? windPoint[3] : "não disponível";

              return (
                `Data: ${date}<br/>` +
                `Elevação: nível ${elevationLevel}: <b>${customLabels[elevationLevel]} m</b><br/>` +
                `Velocidade: <b>${speed} m/s</b><br/>` +
                `Direção: <b>${direction}°</b><br/>` +
                `Material Micro-particulado 2.5nm: <b>${pm25} µg/m³</b>`
              );
            },
          },
          point: {
            events: {
              mouseOver: function () {
                // Destaca as setas correspondentes no vetor
                const vectorData = this.series.chart.series[1]; // A série do vetor
                const correspondingWind = vectorData.data.find(
                  (point) => point.x === this.x && point.y === this.y
                );
                if (correspondingWind) {
                  correspondingWind.setState("hover"); // Aplica o estado hover
                }
              },
              mouseOut: function () {
                // Restaura o estado das setas
                const vectorData = this.series.chart.series[1];
                vectorData.data.forEach((point) => {
                  point.setState("");
                });
              },
            },
          },
          enableMouseTracking: true,
        },
        {
          data: dataWindColor,
          type: "vector",
          name: "Direção e velocidade do vento",
          color: Highcharts.getOptions().colors[1],
          tooltip: {
            enabled: false, // Desabilita o tooltip para a série de vetor
          },
          enableMouseTracking: false,
          states: {
            inactive: {
              opacity: 1, // Mantém a série de vetor totalmente opaca quando outra série está em foco
            },
            hover: {
              enabled: true,
              brightness: 0.25, // Ajuste de brilho para hover
              color: "#000000", // Cor para o hover
            },
          },
        },
      ],
    };
    options = optionsHeatmapVectorWindPm25;
  }

  // Heatmap e vector plot de vento e óxidos de nitrogênio
  if (product === "csvWindNox") {
    const {
      data: dataNox,
      minDate,
      maxDate,
    } = parseCsvToHeatmapData(dataCsv, "nox");
    const { data: dataWind } = parseCsvToHeatmapData(dataCsv, "wind");
    const dataWindColor = dataWind.map((point) => ({
      x: point[0], // Assumindo que a primeira posição é x
      y: point[1], // Assumindo que a segunda posição é y
      length: point[2], // Assumindo que a terceira posição é a velocidade
      direction: point[3], // Assumindo que a quarta posição é a direção
      color: "#000000", // Cor preta para as setas
    }));
    const customLabels = {
      1: "39",
      2: "122",
      3: "212",
      4: "309",
      5: "413",
      6: "527",
      7: "649",
      8: "781",
      9: "923",
      10: "1077",
      11: "1243",
      12: "1423",
      13: "1617",
      14: "1826",
      15: "2052",
      16: "2297",
      17: "2560",
      18: "2845",
      19: "3153",
      20: "3485",
      21: "3844",
      22: "4231",
      23: "4650",
      24: "5102",
      25: "5590",
      26: "6117",
      27: "6687",
      28: "7301",
      29: "7966",
      30: "8683",
      31: "9459",
      32: "10290",
    };
    const stops = [
      [0.1, "#FFFFFF"],
      [0.5, "#B9EBDF"],
      [0.9, "#D2F0DD"],
      [2.5, "#FDF4D3"],
      [4.5, "#F3EB99"],
      [9, "#F5D263"],
      [13, "#FCB419"],
      [17, "#FD7647"],
      [21, "#FD4D2E"],
      [25, "#FF2C1A"],
      [29, "#FD0301"],
      [37.5, "#D90C44"],
      [47.5, "#D20D5F"],
      [57.5, "#D00B76"],
      [100, "#9725C2"],
      [140, "#750476"],
    ];
    const generateLegend = (idChart) => {
      // Gerar a legenda personalizada com o gradiente
      const gradientStops = stops
        .map(([value, color], index) => {
          const stopPercentage = (index / (stops.length - 1)) * 100; // Distribuir uniformemente no gradiente
          return `${color} ${stopPercentage}%`;
        })
        .join(", ");
      // A legenda HTML
      const legendHTML = `
        <div class="w-full flex justify-center items-center">
          <div class="flex-1 text-center text-sm mx-2">
            <div class="w-full flex flex-col items-center overflow-x-auto mt-1 mb-3">
              <div class="w-full h-3 rounded" style="background: linear-gradient(to right, ${gradientStops});"></div>
              <div class="flex justify-between w-full mt-1">
                ${stops
                  .map(([value]) => {
                    return `
                      <span class="flex-1 text-center text-sm">${value}</span>
                    `;
                  })
                  .join("")}
              </div>
            </div>
          </div>
          <div>
            <a
              href="https://www.gov.br/acessoainformacao/pt-br"
              className="flex items-center justify-center p-2"
            >
              <img
                src=${imgLogoInpe}
                alt="INPE"
                class="max-w-14 lg:max-w-16"
              />
            </a>
          </div>
        </div>
      `;
      // Inserir a legenda no DOM
      document
        .getElementById(idChart)
        .insertAdjacentHTML("afterend", legendHTML);
    };
    const optionsHeatmapVectorWindNox = {
      chart: {
        backgroundColor: "transparent",
        height: "100%",
        events: {
          load: function () {
            // Aqui, 'this' refere-se à instância do gráfico
            const chart = this;
            console.log("chart", chart);
            console.log("chart container id", chart.container.id);
            // Chamar a função global para gerar a legenda personalizada
            generateLegend(chart.container.id);
          },
        },
      },
      boost: {
        useGPUTranslations: true, // Utiliza GPU para renderização
        seriesThreshold: 1, // Ativa o boost para qualquer gráfico
      },
      plotOptions: {
        series: {
          turboThreshold: 5000, // Necessário para exibir as setinhas. Deve ser igual ou maior que a quantidade de elementos do array "data" que vem do parseCsvToHeatmapData(dataCsv, "wind"). Se tiver 1056 elementos esse array, deve ser maior ou igual a 1056. É bom deixar um valor bem alto para que sejam exibidas as setinhas.
        },
      },
      title: {
        text: "Vento e Óxidos de Nitrogênio (ppbv)",
        align: "center",
        x: 40,
      },
      xAxis: {
        type: "datetime", // O eixo x será baseado na data e hora
        min: minDate, // Valor mínimo da data
        max: maxDate, // Valor máximo da data
        labels: {
          align: "left",
          x: 5,
          y: 14,
          format: "{value:%d/%m %Hh}", // Formato da data
        },
        showLastLabel: false,
        tickLength: 16,
      },
      yAxis: {
        title: {
          text: "Altitude (m)", // O eixo y representa a elevação
        },
        labels: {
          formatter: function () {
            return customLabels[this.value] || this.value; // Retorna o label personalizado
          },
        },
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false,
        endOnTick: false,
        tickPositions: [4, 8, 12, 16, 20, 24, 28, 32], // Posições do eixo y em níveis
        tickWidth: 1,
        min: 1,
        max: 32, // Configuração para 32 níveis de elevação
        reversed: false,
      },
      colorAxis: {
        min: 0,
        max: 1,
        stops: stops,
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          data: dataNox, // Função que processa o CSV e gera os dados
          name: "Óxido de nitrogênio (NOx)",
          type: "heatmap",
          borderWidth: 0,
          colsize: 3 * 36e5, // Intervalo de 3 horas (ajuste conforme necessidade)
          tooltip: {
            shared: true, // Compartilha o tooltip com heatmap e vetor
            headerFormat:
              "Direção e velocidade do vento com óxidos de nitrogênio<br/>",
            pointFormatter: function () {
              const date = Highcharts.dateFormat("%d/%m %H:%M", this.x);
              const elevationLevel = this.y;

              // Encontra os dados na série heatmap
              const heatmapIndex = dataNox.findIndex(
                (item) => item[0] === this.x && item[1] === this.y
              );
              const nox =
                heatmapIndex !== -1
                  ? dataNox[heatmapIndex][2]
                  : "não disponível";

              // Encontra a velocidade e direção do vento na série vector (dataWind)
              const windPoint = dataWind.find(
                (item) => item[0] === this.x && item[1] === this.y
              );
              const speed = windPoint ? windPoint[2] : "não disponível";
              const direction = windPoint ? windPoint[3] : "não disponível";

              return (
                `Data: ${date}<br/>` +
                `Elevação: nível ${elevationLevel}: <b>${customLabels[elevationLevel]} m</b><br/>` +
                `Velocidade: <b>${speed} m/s</b><br/>` +
                `Direção: <b>${direction}°</b><br/>` +
                `Óxido de nitrogénio (NOx): <b>${nox} ppbv</b>`
              );
            },
          },
          point: {
            events: {
              mouseOver: function () {
                // Destaca as setas correspondentes no vetor
                const vectorData = this.series.chart.series[1]; // A série do vetor
                const correspondingWind = vectorData.data.find(
                  (point) => point.x === this.x && point.y === this.y
                );
                if (correspondingWind) {
                  correspondingWind.setState("hover"); // Aplica o estado hover
                }
              },
              mouseOut: function () {
                // Restaura o estado das setas
                const vectorData = this.series.chart.series[1];
                vectorData.data.forEach((point) => {
                  point.setState("");
                });
              },
            },
          },
          enableMouseTracking: true,
        },
        {
          data: dataWindColor,
          type: "vector",
          name: "Direção e velocidade do vento",
          color: Highcharts.getOptions().colors[1],
          tooltip: {
            enabled: false, // Desabilita o tooltip para a série de vetor
          },
          enableMouseTracking: false,
          states: {
            inactive: {
              opacity: 1, // Mantém a série de vetor totalmente opaca quando outra série está em foco
            },
            hover: {
              enabled: true,
              brightness: 0.25, // Ajuste de brilho para hover
              color: "#000000", // Cor para o hover
            },
          },
        },
      ],
    };
    options = optionsHeatmapVectorWindNox;
  }

  return (
    <div>
      {city !== null && <p className="pt-4 text-center">{city}</p>}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
