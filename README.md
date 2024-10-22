# Previsão Numérica de Tempo

Neste projeto utilizaremos [React](https://react.dev/) e [Vite](https://vitejs.dev/) para o desenvolvimento.

Para abrir este repositório no Sandbox.io e ver uma **demonstração**, acessar: [https://codesandbox.io/s/github/sessojunior/inpe-previsao-react](https://codesandbox.io/s/github/sessojunior/inpe-previsao-react).

Imagem de pré-visualização do aplicativo em funcionamento:

![Pré-visualização do aplicativo](/public/screenshot.jpg)

Imagem apenas ilustrativa.

## Arquivos e diretórios

O projeto também está organizado em diversos arquivos e diretórios, onde:

- **/.git** - Diretório de configurações para o git. Não é feito o upload para o Github.
- **/dist** - Diretório que é disponibilizado para a produção após rodar o _npm run build_. É possível ver uma prévia depois com _npm run preview_
- **/node_modules** - Diretório descartável, contendo as dependências do projeto. Não é feito o upload para o Github. Pode ser removido e depois gerado novamente utilizado _npm install_, instalando todas as dependências necessárias que estão no arquivo \*package.json\*\*.
- **/public** - Diretório contendo as imagens de favicon e a imagem _image-not-found.jpg_ que é exibida quando não é encontrada uma imagem de previsão.
- **/src** - Diretório contendo os arquivos principais do projeto, componentes e layout.
  - **/assets** - Diretório contendo as imagens de logotipos do governo para o cabeçalho e rodapé.
  - **/components** - Diretório contendo todos os arquivos dos componentes do aplicativo. Está dividido em uma hierarquia, porém ambos no mesmo diretório, para fácil acesso:
    - **TopBar.jsx** - Arquivo de componente que fica na barra do topo acima dos frames e abaixo do cabeçalho. Contém um botão de exibir e ocultar cabeçalho e rodapé, título do aplicativo, e botões de dar play na animaçõa em todos os frames, botão de exibir apenas um frame, dois frames ou 4 frames de uma só vez.
    - **Frames.jsx** - Arquivo de componente que engloba exibir todos os frames.
      - **Frame.jsx** - Arquivo de componente que exibe um frame.
        - **FrameTop.jsx** - Arquivo de componente que fica no topo de cada um dos frames. Contém um botão de dropdown de configurar modelo, nome e região, botões de retornar, play de animação e avançar imagens de previsão do tempo, tempo de previsão (forecast) que está sendo exibido e botão de selecionar tempo de previsão manualmente.
          - **DropDownConfig.jsx** - Arquivo de componente de dropdown que permite selecionar o modelo, grupo do produto, produto, região e data de inicialização do modelo.
          - **DropDownTime.jsx** - Arquivo de componente que exibe as horas de previsão disponíveis para a configuração selecionada e permite trocar manualmente de previsão.
        - **FrameImage.jsx** - Arquivo de componente que exibe a imagem de previsão e um botão para download da imagem em uma nova aba do navegador.
  - **/contexts** - Diretório contendo arquivo com Context API de configurações do aplicativo. Reúne e disponibiliza de forma global o conteúdo dos arquivos JSON, define e salva configurações como exibir ou ocultar cabeçalho e rodapé, quantidade de frames (quadros) na tela, configurações de cada frame etc.
  - **/data** - Diretório contendo arquivos JSON essenciais para o funcionamento do aplicativo. Contém os seguintes arquivos:
    - **models.json** - Arquivo JSON com dados e configurações dos modelos.
    - **regions.json** - Arquivo JSON com uma lista de informações sobre regiões.
  - **/layouts** - Diretório contendo arquivos de componentes de layout. Contém os seguintes arquivos:
    - **Header.jsx** - Arquivo de componente de cabeçalho com logotipo e links de navegação
    - **Container.jsx** - Arquivo de componente que engloba todo o conteúdo principal, como barra do topo _(TopBar.jsx)_ e os quadros _(Frames.jsx)_.
    - **Footer.jsx** - Arquivo de componente de rodapé, contendo logotipo, links de navegação e outras informações.
  - **/lib** - Diretório que contém funções que podem ser utilizadas em todo o aplicativo, como formatação de datas.
  - **App.jsx** - Arquivo principal que contém os componentes pais e engloba tudo com o Context API.
  - **input.css** - Arquivo criado para estilização com o Tailwind, conforme a documentação oficial do Taiwind.
  - **main.jsx** - Arquivo que é o ponto de entrada para o aplicativo em React.
  - **output.css** - Arquivo de estilização do Tailwind. É gerado automaticamente ao rodar _npm run tailwind_.
- **index.html** - Página inicial do aplicativo
- **tailwind.config.js** - Arquivo contendo configurações do Tailwind, para estilização.
- **package.json** - Arquivo contendo as dependências e configurações do projeto

## Arquivos JSON no servidor backend

É necessário ter arquivos JSON que serão acessados pelo aplicativo e que informarão, as datas dos produtos que foram gerados. Esses arquivos ficaram no servidor backend e deverão ter o seguinte conteúdo:

- **model** - _(string)_. É o nome do modelo para a URL. Em minúsculo, sem acentuação e sem espaços
- **datesRun** - _(array de strings: string[])_. É um array, no seguinte padrão YYYY-MM-DD HHz (onde Y é ano (4 dígitos), M é mês (2 dígitos), D é dia (2 dígitos) e H é o turno (2 dígitos) e z é fixo, após o turno.

O endereço de URL deste arquivo JSON deverá estar no parâmetro **urlDates** do arquivo JSON **models.json**. Cada modelo deverá ter o seu arquivo JSON.

**Exemplo de arquivo:**

```json
{
  "model": "bam",
  "datesRun": ["2024-04-02 12z", "2024-04-02 00z"]
}
```

**Informações importantes:**

É necessário que no mesmo diretório contenha um arquivo **.htaccess**, caso o servidor seja Apache, para evitar o seguinte erro:

_Access to fetch at 'https://s1.cptec.inpe.br/grafico/Modelos/portal_previsao_numerica/mod_wrf.json' from origin 'http://...' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled._

A solução mais fácil para esse problema é criar um arquivo **.htaccess** no mesmo diretório que estão os arquivos .json do CPTEC. Esse arquivo **.htaccess** deve ter o seguinte conteúdo:

```bash
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin *
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

## Arquivos JSON da pasta _/data_

O projeto necessita de arquivos JSON que estão no diretório **/data** para rodar o aplicativo. São eles:

- **regions.json** - Arquivo JSON contendo nome e slug de cada região
- **models.json** - Arquivo JSON contendo as configurações padrão e opções possíveis de cada modelo, nome, slug da URL, template da URL da imagem, URL do arquivo JSON no servidor de backend contendo as datas, tempo de rodada, período ou intervalo (em horas) que tem cada imagem, período ou intervalo inicial e final, nome e valor dos grupos possíveis, nome, valor, grupo e regiões de cada produto.

Entrando mais em detalhes, abaixo a descrição de cada arquivo.

### Arquivo JSON _regions.json_

É um array contendo vários objetos com:

- **label** - _(string)_. Nome da região
- **value** - _(string)_. Slug de URL da região

Exemplo:

```json
[
  {
    "label": "América do Sul",
    "value": "ams"
  },

  ...
]
```

### Arquivo JSON _models.json_

É um array de objetos contendo o valor padrão e demais valores possíveis de cada modelo:

- **id** - _(number)_. É o identificador único do modelo. O primeiro modelo deve começar com 1 e os seguintes de forma incremental e crescente. Exemplo: 1, 2, 3...
- **label** - _(string)_. Nome que irá aparecer para o usuário na caixa de seleção do formulário. Exemplo: "BRAMS 08".
- **value** - _(string)_. Slug de URL e também valor do modelo. Serve para identificar o modelo também de forma única, a fins de comparação nos scripts. Também é o formato usado na URL para a obtenção da imagem. Exemplo: "BRAMS08".
- **urlImage** - _(string)_. Template de URL contendo informações de como as variáveis de cada modelo são transferidos para a URL.
  - **{{model}}** - _(string)_. Valor ou slug do modelo. Exemplos: "BRAMS08".
  - **{{region}}** - _(string)_. Região do produto do modelo. Exemplos: "sul", "ams", "norte", "bra".
  - **{{product}}** - _(string)_. Produto do modelo. Exemplos: "prec_pnmm", "aprec", "ageop_500", "cis_vento_3000".
  - **{{year}}** - _(string)_. Ano da rodada (YYYY). Exemplo: "2024".
  - **{{month}}** - _(string)_. Mês da rodada (MM). Exemplo: "08".
  - **{{day}}** - _(string)_. Dia da rodada (DD). Exemplo: "14".
  - **{{turn}}** - _(string)_. Turno da rodada (HH). Exemplos: "00", "12".
  - **{{forecastTime}}** - _(string)_. Hora (HHH) de execução atual da imagem. Tempo de previsão (forecast time). Exemplos: "000", "003", "012", "072", "144".
- **urlDates** - _(string)_. URL que obterá o arquivo JSON contendo as datas disponíveis do modelo com o parâmetro _datesRun_.
- **urlCharts** - _(string)_. Template de URL que obterá o arquivo JSON para geração dos gráficos com highcharts.
  - **{{year}}** - _(string)_. Ano da rodada (YYYY). Exemplo: "2024".
  - **{{month}}** - _(string)_. Mês da rodada (MM). Exemplo: "08".
  - **{{day}}** - _(string)_. Dia da rodada (DD). Exemplo: "14".
  - **{{turn}}** - _(string)_. Turno da rodada (HH). Exemplos: "00", "12".
  - **{{cityId}}** - _(string)_. ID da cidade. Exemplo: "1083".
- **timeRun** - _(number)_. Tempo (em horas) que leva para rodar todo o modelo, ou de quanto em quanto tempo esse modelo é rodado.
- **periodHours** - _(number)_. As figuras são geradas em um intervalo de horas. Esse é o intervalo de horas de cada figura de previsão do modelo. É necessário para calcular e obter um array com as horas de previsão. Por exemplo, para um número de 3, será gerado um array ["000", "003", "006", ...] e para um número 6, será gerado um array ["000", "006", "012", ...]. Valores possíveis: 1, 3 ou 6.
- **periodStart** - _(string)_. Tempo inicial da figura para o array de tempos. Exemplo: "000".
- **periodEnd** - _(string)_. Tempo final da figura para o array de tempos. Exemplos: "180", "240".
- **forecastTime** - _(string)_. É o valor em horas do tempo que irá ser exibido inicialmente. Exemplos: "000", "024".
- **default** - _(Object)_. Valores padrão para o modelo.
  - **product** - _(Object)_. Valor padrão de produto. Quando é selecionado um novo modelo, carrega esse valor padrão de produto.
    - **value** - _(string)_. Valor de slug do produto.
    - **group** - _(string)_. Valor de slug do grupo.
    - **region** - _(string)_. Valor de slug da região.
- **options** - _(Object)_. Valores possíveis do modelo que o usuário pode selecionar.
  - **groups** - _(array de objetos: Object[])_. Grupos do modelo que podem ser selecionados pelo usuário. Aqui ficam agrupados os nomes (value) dos produtos que são parecidos. Exemplo: Grupo _ageop_ para os produtos _"ageop_250"_, _"ageop_500"_, _"ageop_700"_ etc.
    - **label** - _(string)_. Nome do grupo que irá aparecer para o usuário escolher.
    - **value** - _(string)_. Valor de slug do grupo.
  - **products** - _(array de objetos: Object[])_. Produtos do modelo que podem selecionados pelo usuário.
    - **label** - _(string ou null: string | null)_. Nome do produto que irá aparecer para o usuário. Exemplos: _"Nível de 250"_, onde o grupo é _"ageop"_. Pode ser _null_ também, se não tiver variações. Por exemplo: _null_, onde o _value_ e o _group_ são do mesmo nome, como _"prec_pnmm"_.
    - **value** - _(string)_. Valor de slug do produto. Exemplos: "prec_pnmm", "aprec", "ageop_500", "ageop_850", "lapserate", "cis_vento_1000", "cis_vento_3000".
    - **group** - _(string)_. Valor de slug do grupo que o produto pertence. Exemplo: "prec", "cis_vento", "lapserate", "ageop".
    - **regions** - (array de strings: string[]). Os valores possíveis são os que estão nos parâmetros **value** do arquivo JSON **regions.json**. Exemplo: _["ams", "bra", "nte"]_. No caso, aqui são somente os valores de região que este produto possui. Pode ser _null_ em caso de não ser seleção por região e sim um campo de texto com seleção por cidade.
    - **forecastTime** - _(null)_. Opcional, deve ser fornecido como _null_ caso não tenha o forecastTime, como é o caso dos meteogramas.

Exemplo:

```json
[
  {
    "id": 1,
    "label": "BRAMS 8 km",
    "value": "BRAMS08",
    "urlImage": "https://s1.cptec.inpe.br/grafico/Modelos/{{model}}/pn/{{product}}/{{year}}/{{month}}/{{day}}/{{turn}}/{{model}}_{{product}}_{{region}}_{{year}}{{month}}{{day}}{{turn}}z_{{forecastTime}}z.png",
    "urlDates": "https://s1.cptec.inpe.br/grafico/Modelos/portal_previsao_numerica/mod_brams.json",
    "urlCharts": "https://ftp.cptec.inpe.br/modelos/produtos/BRAMS/ams_08km/grh/json2/{{year}}/{{month}}/{{day}}/{{turn}}/{{cityId}}.json",
    "timeRun": 12,
    "periodHours": 3,
    "periodStart": "000",
    "periodEnd": "168",
    "forecastTime": "000",
    "default": {
      "product": {
        "value": "aprec",
        "group": "aprec",
        "region": "ams"
      }
    },
    "options": {
      "groups": [
        {
          "label": "Água Precipitável",
          "value": "aprec"
        },
        {
          "label": "Altura Geopotencial",
          "value": "ageop"
        },
        {
          "label": "Cisalhamento do Vento",
          "value": "cis_vento"
        },
        {
          "label": "Lapserate",
          "value": "lapserate"
        },
        {
          "label": "Precipitação",
          "value": "prec"
        },
        {
          "label": "Pressão",
          "value": "pnmm_vento"
        },
        {
          "label": "Precipitação, pressão e espessura",
          "value": "prec_pnmm"
        },
        {
          "label": "Temperatura",
          "value": "t"
        },
        {
          "label": "Umidade Relativa mínima em 2m",
          "value": "urmin_2m"
        },
        {
          "label": "Vento em níveis",
          "value": "vento"
        },
        {
          "label": "Vorticidade",
          "value": "vort"
        },
        {
          "label": "Meteogramas",
          "value": "meteograms"
        }
      ],
      "products": [
        {
          "label": null,
          "value": "aprec",
          "group": "aprec",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": "Nível de 250hPa",
          "value": "ageop_250",
          "group": "ageop",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 500hPa",
          "value": "ageop_500",
          "group": "ageop",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 700hPa",
          "value": "ageop_700",
          "group": "ageop",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 850hPa",
          "value": "ageop_850",
          "group": "ageop",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 925hPa",
          "value": "ageop_925",
          "group": "ageop",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "1000 metros",
          "value": "cis_vento_1000",
          "group": "cis_vento",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "2000 metros",
          "value": "cis_vento_2000",
          "group": "cis_vento",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "3000 metros",
          "value": "cis_vento_3000",
          "group": "cis_vento",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": null,
          "value": "lapserate",
          "group": "lapserate",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Precipitação acumulada",
          "value": "prec_acum",
          "group": "prec",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": "Precipitação acumulada em 3h",
          "value": "prec_3h",
          "group": "prec",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": "Precipitação acumulada em 24h",
          "value": "prec",
          "group": "prec",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": null,
          "value": "prec_pnmm",
          "group": "prec_pnmm",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": null,
          "value": "pnmm_vento",
          "group": "pnmm_vento",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Temperatura mínima em 2m",
          "value": "tmin_2m",
          "group": "t",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ],
          "periodStart": "024",
          "periodEnd": "240",
          "periodHours": 24
        },
        {
          "label": "Temperatura máxima em 2m",
          "value": "tmax_2m",
          "group": "t",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ],
          "periodStart": "024",
          "periodEnd": "240",
          "periodHours": 24
        },
        {
          "label": "Temperatura em 2m",
          "value": "t_2m",
          "group": "t",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": null,
          "value": "urmin_2m",
          "group": "urmin_2m",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ],
          "periodStart": "024",
          "periodEnd": "240",
          "periodHours": 24
        },
        {
          "label": "Vento em 10m",
          "value": "vento_10m",
          "group": "vento",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": "Nível de 250hPa",
          "value": "vento_250",
          "group": "vento",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": "Nível de 700hPa",
          "value": "vento_700",
          "group": "vento",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": "Nível de 850hPa",
          "value": "vento_850",
          "group": "vento",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": "Nível de 925hPa",
          "value": "vento_925",
          "group": "vento",
          "regions": [
            "ams",
            "bra",
            "sul",
            "sud",
            "coe",
            "nde",
            "nte"
          ]
        },
        {
          "label": "Nível de 250hPa",
          "value": "vort_250",
          "group": "vort",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 500hPa",
          "value": "vort_500",
          "group": "vort",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 700hPa",
          "value": "vort_700",
          "group": "vort",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 850hPa",
          "value": "vort_850",
          "group": "vort",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 925hPa",
          "value": "vort_925",
          "group": "vort",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": null,
          "value": "meteograms",
          "group": "meteograms",
          "regions": null,
          "forecastTime": null
        }
      ]
    }
  },

  ...
```

## URLs válidas

Exemplos de URLs válidas:

URLs padrão dos modelos:

https://s1.cptec.inpe.br/grafico/Modelos/BRAMS08/pn/aprec/2024/10/08/00/BRAMS08_aprec_ams_2024100800z_000z.png

https://s1.cptec.inpe.br/grafico/Modelos/{{model}}/pn/{{product}}/{{year}}/{{month}}/{{day}}/{{turn}}/{{model}}_{{product}}_{{region}}_{{year}}{{month}}{{day}}{{turn}}z_{{forecastTime}}z.png

Meteogramas, não exibe a região e sim um combobox para escolher a cidade. Repare no endereço que não tem a região e sim o código IBGE da cidade:

https://s1.cptec.inpe.br/grafico/Modelos/SMEC/pn/meteograms/2024/10/08/00/SMEC_meteograms_1200104_2024100800z.png

https://s1.cptec.inpe.br/grafico/Modelos/{{model}}/pn/{{product}}/{{year}}/{{month}}/{{day}}/{{turn}}/{{model}}_{{product}}_{{city}}_{{year}}{{month}}{{day}}{{turn}}z.png

## Observações

Cada modelo possui as chaves _periodStart_ e _periodEnd_, que funcionam para todos os produtos São fixos. Ou seja, não devem variar na quantidade de horas ao alterar um produto ou região do modelo. Por exemplo, para o modelo BRAMS 08, todos os produtos começam com "000" e terminam com "180". Para o BAM, todos os produtos poderiam começar com "000" e terminar com "240".

Ou seja, se um modelo for até 180 horas e de 3 em 3 horas, todos os produtos e variáveis ou níveis deste modelo serão assim.

Entretanto, alguns produtos por serem mais específicos, possuem particularidades, como é o caso de temperatura mínima, temperatura máxima e umidade relativa mínima, que tem um intervalo maior que é de 24 horas. Ou seja, roda 1 vez por dia. Neste caso, esses produtos teriam mais algumas chaves, específicas para estes produtos, como: _periodStart_, _periodEnd_ e _periodHours_.

## Sugestão de melhorias futuras

Algumas sugestões para serem desenvolvidas posteriormente:

- Quando apertamos em animar todos os modelos juntos, seria interessante olhar qual o prazo máximo de previsão de todos os modelos, entre 72, 168, 180, 240, etc. Qual for o menor, a animação de todos os quadros geral ir apenas até o menor.
- Um select no topo, ao lado do botão de animação de todos os quadros, para selecionar quantidade de horas de forecast de cada figura (1 em 1 hora, 2 em 2 horas, 3 em 3 horas, 6 em 6 horas).
- Arquivo de log para acompanhar o que os usuários acessam.
- Uso do Next.js ao invés de React.js.

## Instruções usadas para deploy no Github

Para os passos abaixo, é necessário que o projeto já esteja em um repositório no Github.

1. Instalar dependência de desenvolvimento abaixo:

```bash
npm install gh-pages --save-dev
```

2. Em package.json adicionar em "scripts", no final, exatamente as chaves "predeploy" e "deploy" com as configurações:

```json
  "scripts": {
    ...
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
```

O "predeploy" faz com que os arquivos de produção sejam gerados, a partir disso a Git gera a build que são os arquivos finais e o "deploy" salva em uma pasta "dist".

3. Em seguida adicionar em package.json, no início, antes do "name":

```json
{
  "homepage": "https://sessojunior.github.io/inpe-previsao-react",
  "name": ...
}
```

O padrão que é seguido aqui é https://**[nomedousuario]**.github.io/**[nomedorepositorio]**.

4. No arquivo vite.config.js, acrescentar o "base" com o **nomedorepositorio**, no final, pode ser após "plugins" da função defineConfig():

```js
export default defineConfig({
  plugins: [react()],
  base: "/inpe-previsao-react",
});
```

Isso é necessário para o deploy com o **Vite**.

5. Seria interessante, comitar e subir essas alterações no repositório, para ficar correto lá.

```bash
git add .
git commit -m "Add deploy config"
git push
```

5. Para colocar esse projeto no ar, executar no terminal:

```bash
npm run deploy
```

Esse comando irá gerar os arquivos de build e enviar já para o Github. Se exibir uma mensagem de "Published", quer dizer que deu certo.

6. Para acessar a página, ir no navegador para a página do Github, clicar em **Settings** e na navegação lateral, do lado esquerdo, clicar em **Pages**. Irá exibir a página de **Github Pages**. Nesta página irá aparecer, após o deploy, o link da página final. Demora um pouco para aparecer (cerca de 4 ou 5 minutos). Após um tempo, recarregando a página, irá exibir uma caixinha com o link, com o seguinte:

**Your site is live at [https://sessojunior.github.io/inpe-previsao-react](https://sessojunior.github.io/inpe-previsao-react)**
Last **deployed** by...

7. Basta clicar no link informado na caixinha e pronto!
