# inpe-previsao-react

Projeto de Previsão Numérica de Tempo

Neste projeto utilizaremos [React](https://react.dev/) e [Vite](https://vitejs.dev/) para o desenvolvimento.

Para abrir este repositório no Sandbox.io, acessar: [https://githubbox.com/sessojunior/inpe-previsao-react](https://githubbox.com/sessojunior/inpe-previsao-react).

Arquivo **models.json**:

- **{{model}}** - Modelo. Ex: bam, wrf
- **{{region}}** - Região. Ex: sul, mas, norte, brasil
- **{{product}}** - Produto ou campo. Ex: isobaricos
- **{{year}}** - Ano (YYYY). Ex: 2024
- **{{month}}** - Mês (MM). Ex: 08
- **{{day}}** - Dia (DD). Ex: 14
- **{{turn}}** - Turno (HH) que executa o modelo. Ex: 00, 12
- **{{forecastTime}}** - Hora (HHH) de execução atual da imagem. Tempo de previsão (forecast time). Ex: 024, 040, 072, 128, 320

Arquivo models.json:

```bash
[
  {
    "id": 1,
    "label": "BAM",
    "value": "bam",
    "urlImage": "https://s1.cptec.inpe.br/grafico/Modelos/{{model}}/{{region}}/{{product}}/{{year}}/{{month}}/{{day}}/{{turn}}/modelo_{{forecastTime}}h_glo_{{year}}{{month}}{{day}}{{turn}}Z.png",
    "urlDates": "http://localhost:5173/src/data/bam_dates.json",
    "defaultValues": {
      "region": {
        "label": "Sul",
        "value": "sul"
      },
      "product": {
        "label": "Campo 3A",
        "value": "c1"
      },
      "timeRun": 12
    },
    "possibleValues": {
      "region": [
        {
          "label": "Norte",
          "value": "norte"
        },
        {
          "label": "Sul",
          "value": "sul"
        },
        {
          "label": "Centro-Oeste",
          "value": "co"
        },
        {
          "label": "Nordeste",
          "value": "nde"
        },
        {
          "label": "Sudeste",
          "value": "sde"
        }
      ],
      "product": [
        {
          "label": "Campo 3A",
          "value": "c1"
        },
        {
          "label": "Campo 4A",
          "value": "c2"
        },
        {
          "label": "Campo 7A",
          "value": "c3"
        }
      ],
      "time": [
        "024",
        "030",
        "036",
        "040",
        "048",
        "060",
        "072",
        "084",
        "096"
      ]
    }
  },
  ...
```

Em urlDates é o endereço URL que será obtido um arquivo JSON com conteúdo dessa forma:

```bash
{
  "model": "bam",
  "datesRun": [
    "2024-08-07 12z",
    "2024-08-07 00z",
    "2024-08-06 12z",
    "2024-08-06 00z",
    "2024-08-05 12z",
    "2024-08-05 00z",
    "2024-08-04 12z"
  ]
}
```

Onde:

- **model**: é o nome do modelo para a URL. Em minúsculo, sem acentuação e sem espaços
- **datesRun**: é um array, no seguinte padrão YYYY-MM-DD HHz (onde Y é ano (4 dígitos), M é mês (2 dígitos), D é dia (2 dígitos) e H é o turno (2 dígitos) e z é fixo, após o turno.

Observação:

As horas de previsão precisam ser fixas para cada modelo. Ou seja, não devem variar na quantidade de horas ao alterar um produto ou região do modelo.

Informações importantes:

Geralmente dá o seguinte erro:

Access to fetch at 'https://s1.cptec.inpe.br/grafico/Modelos/portal_previsao_numerica/mod_wrf.json' from origin 'http://...' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

A solução é criar um arquivo .htaccess no mesmo diretório que estão os arquivos .json do CPTEC. Esse arquivo .htaccess deve ter o seguinte conteúdo:

<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin *
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>

Sugestão de melhorias futuras:

* Um select no topo, ao lado do botão de animação de todos os quadros, para selecionar quantidade de horas de forecast de cada figura (1 em 1 hora, 2 em 2 horas, 3 em 3 horas, 6 em 6 horas)
* Log para acompanhar o que o usuário acessa
* Uso de Next.js

Requisitos:

* Se um modelo for até 180 horas e de 3 em 3 horas, todos os produtos e variáveis ou níveis deste modelo deverão ser assim.
