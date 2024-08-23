# Previsão Numérica de Tempo

Neste projeto utilizaremos [React](https://react.dev/) e [Vite](https://vitejs.dev/) para o desenvolvimento.

Para abrir este repositório no Sandbox.io e ver uma **demonstração**, acessar: [https://codesandbox.io/s/github/sessojunior/inpe-previsao-react](https://codesandbox.io/s/github/sessojunior/inpe-previsao-react).

Imagem de pré-visualização do aplicativo em funcionamento:

![Pré-visualização do aplicativo](/public/screenshot.jpg)

Imagem apenas ilustrativa.

## Arquivos e diretórios

O projeto também está organizado em diversos arquivos e diretórios, onde:

- **/.git** - Diretório de configurações para o git. Não é feito o upload para o Github.
- **/dist** - Diretório que é disponibilizado para a produção após rodar o *npm run build*. É possível ver uma prévia depois com *npm run preview*
- **/node_modules** - Diretório descartável, contendo as dependências do projeto. Não é feito o upload para o Github. Pode ser removido e depois gerado novamente utilizado *npm install*, instalando todas as dependências necessárias que estão no arquivo *package.json**.
- **/public** - Diretório contendo as imagens de favicon e a imagem *image-not-found.jpg* que é exibida quando não é encontrada uma imagem de previsão.
- **/src** - Diretório contendo os arquivos principais do projeto, componentes e layout.
  - **/assets** -  Diretório contendo as imagens de logotipos do governo para o cabeçalho e rodapé.
  - **/components** - Diretório contendo todos os arquivos dos componentes do aplicativo. Está dividido em uma hierarquia, porém ambos no mesmo diretório, para fácil acesso:
    - **TopBar.jsx** - Arquivo de componente que fica na barra do topo acima dos frames e abaixo do cabeçalho. Contém um botão de exibir e ocultar cabeçalho e rodapé, título do aplicativo, e botões de dar play na animaçõa em todos os frames, botão de exibir apenas um frame, dois frames ou 4 frames de uma só vez.
    - **Frames.jsx** - Arquivo de componente que engloba exibir todos os frames.
      - **Frame.jsx** - Arquivo de componente que exibe um frame.
        - **FrameTop.jsx** - Arquivo de componente que fica no topo de cada um dos  frames. Contém um botão de dropdown de configurar modelo, nome e região, botões de retornar, play de animação e avançar imagens de previsão do tempo, tempo de previsão (forecast) que está sendo exibido e botão de selecionar tempo de previsão manualmente.
          - **DropDownConfig.jsx** - Arquivo de componente de dropdown que permite selecionar o modelo, grupo do produto, produto, região e data de inicialização do modelo.
          - **DropDownTime.jsx** - Arquivo de componente que exibe as horas de previsão disponíveis para a configuração selecionada e permite trocar manualmente de previsão.
        - **FrameImage.jsx** - Arquivo de componente que exibe a imagem de previsão e um botão para download da imagem em uma nova aba do navegador.
  - **/contexts** - Diretório contendo arquivo com Context API de configurações do aplicativo. Reúne e disponibiliza de forma global o conteúdo dos arquivos JSON, define e salva configurações como exibir ou ocultar cabeçalho e rodapé, quantidade de frames (quadros) na tela, configurações de cada frame etc.
  - **/data** - Diretório contendo arquivos JSON essenciais para o funcionamento do aplicativo. Contém os seguintes arquivos:
    - **frames.json** - Arquivo JSON com configurações dos frames.
    - **models.json** - Arquivo JSON com dados e configurações dos modelos.
    - **regions.json** - Arquivo JSON com uma lista de informações sobre regiões.
  - **/layouts** - Diretório contendo arquivos de componentes de layout. Contém os seguintes arquivos:
    - **Header.jsx** - Arquivo de componente de cabeçalho com logotipo e links de navegação
    - **Container.jsx** - Arquivo de componente que engloba todo o conteúdo principal, como barra do topo *(TopBar.jsx)* e os quadros *(Frames.jsx)*.
    - **Footer.jsx** - Arquivo de componente de rodapé, contendo logotipo, links de navegação e outras informações.
  - **/lib** - Diretório que contém funções que podem ser utilizadas em todo o aplicativo, como formatação de datas.
  - **App.jsx** - Arquivo principal que contém os componentes pais e engloba tudo com o Context API.
  - **input.css** - Arquivo criado para estilização com o Tailwind, conforme a documentação oficial do Taiwind.
  - **main.jsx** - Arquivo que é o ponto de entrada para o aplicativo em React.
  - **output.css** - Arquivo de estilização do Tailwind. É gerado automaticamente ao rodar *npm run tailwind*.
- **index.html** - Página inicial do aplicativo
- **tailwind.config.js** - Arquivo contendo configurações do Tailwind, para estilização.
- **package.json** - Arquivo contendo as dependências e configurações do projeto

## Arquivos JSON no servidor backend

É necessário ter arquivos JSON que serão acessados pelo aplicativo e que informarão, as datas dos produtos que foram gerados. Esses arquivos ficaram no servidor backend e deverão ter o seguinte conteúdo:

- **model** - *(string)*. É o nome do modelo para a URL. Em minúsculo, sem acentuação e sem espaços
- **datesRun** - *(array de strings: string[])*. É um array, no seguinte padrão YYYY-MM-DD HHz (onde Y é ano (4 dígitos), M é mês (2 dígitos), D é dia (2 dígitos) e H é o turno (2 dígitos) e z é fixo, após o turno.

O endereço de URL deste arquivo JSON deverá estar no parâmetro **urlDates** do arquivo JSON **models.json**. Cada modelo deverá ter o seu arquivo JSON.

**Exemplo de arquivo:**

```bash
{
  "model": "bam",
  "datesRun": [
    "2024-04-02 12z",
    "2024-04-02 00z"
  ]
}
```

**Informações importantes:**

É necessário que no mesmo diretório contenha um arquivo **.htaccess**, caso o servidor seja Apache, para evitar o seguinte erro:

*Access to fetch at 'https://s1.cptec.inpe.br/grafico/Modelos/portal_previsao_numerica/mod_wrf.json' from origin 'http://...' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.*

A solução mais fácil para esse problema é criar um arquivo **.htaccess** no mesmo diretório que estão os arquivos .json do CPTEC. Esse arquivo **.htaccess** deve ter o seguinte conteúdo:

```bash
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin *
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS, PUT, DELETE"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

## Arquivos JSON da pasta */data*

O projeto necessita de arquivos JSON que estão no diretório **/data** para rodar o aplicativo. São eles:

- **regions.json** - Arquivo JSON contendo nome e slug de cada região
- **frames.json** - Arquivo JSON contendo a configuração inicial de cada frame (quadro), como modelo, produto, grupo, região etc.
- **models.json** - Arquivo JSON contendo as configurações padrão e opções possíveis de cada modelo, nome, slug da URL, template da URL da imagem, URL do arquivo JSON no servidor de backend contendo as datas, tempo de rodada, período ou intervalo (em horas) que tem cada imagem, período ou intervalo inicial e final, nome e valor dos grupos possíveis, nome, valor, grupo e regiões de cada produto.

Entrando mais em detalhes, abaixo a descrição de cada arquivo.

### Arquivo JSON *regions.json*

É um array contendo vários objetos com:

- **label** - *(string)*. Nome da região
- **value** - *(string)*. Slug de URL da região

Exemplo:

```bash
[
  {
    "label": "América do Sul",
    "value": "ams"
  },

  ...
]
```

### Arquivo JSON *frames.json*

É um array de objetos contendo a configuração inical de cada frame do aplicativo:

- **id** - *(number)*. É o identificador único do frame (quadro). Pode ir de 1 até 4
- **model** - *(string)*. É o valor de slug da URL do modelo. Necessário para comparações com os parâmetros **value** em alguns arquivos JSON e demais arquivos.
- **product** - *(string)*. Valor de slug do produto. Necessário para comparações com os parâmetros **value** em alguns arquivos JSON e demais arquivos.
- **group** - *(string)*. Valor de slug do grupo. Necessário para comparações com os parâmetros **value** em alguns arquivos JSON e demais arquivos.
- **region** - *(string)*. Valor de slug da região. Necessário para comparações com os parâmetros **value** no arquivo JSON **regions.json** e demais arquivos.
- **forecastTime** - *(null)*. Tempo de previsão atual. É obrigatório que seja *null* inicialmente.
- **isPlaying** - *(false)*. Define se a animação foi iniciada. É obrigatório que seja *false* inicialmente.
- **init** - *(null)*. Data inicial para obter as imagens do modelo. É obrigatório que seja *null* inicialmente.

Exemplo:

```bash
[
  {
    "id": 1,
    "model": "BRAMS08",
    "product": "prec_pnmm",
    "group": "prec_pnmm",
    "region": "ams",
    "forecastTime": null,
    "isPlaying": false,
    "init": null
  },

  ...
]
```

### Arquivo JSON *models.json*

É um array de objetos contendo o valor padrão e demais valores possíveis de cada modelo:

- **id** - *(number)*. É o identificador único do modelo. O primeiro modelo deve começar com 1 e os seguintes de forma incremental e crescente. Exemplo: 1, 2, 3...
- **label** - *(string)*. Nome que irá aparecer para o usuário na caixa de seleção do formulário. Exemplo: "BRAMS 08".
- **value** - *(string)*. Slug de URL e também valor do modelo. Serve para identificar o modelo também de forma única, a fins de comparação nos scripts. Também é o formato usado na URL para a obtenção da imagem. Exemplo: "BRAMS08".
- **urlImage** - *(string)*. Template de URL contendo informações de como as variáveis de cada modelo são transferidos para a URL.
  - **{{model}}** - *(string)*. Valor ou slug do modelo. Exemplos: "BRAMS08".
  - **{{region}}** - *(string)*. Região do produto do modelo. Exemplos: "sul", "ams", "norte", "bra".
  - **{{product}}** - *(string)*. Produto do modelo. Exemplos: "prec_pnmm", "aprec", "ageop_500", "cis_vento_3000".
  - **{{year}}** - *(string)*. Ano da rodada (YYYY). Exemplo: "2024".
  - **{{month}}** - *(string)*. Mês da rodada (MM). Exemplo: "08".
  - **{{day}}** - *(string)*. Dia da rodada (DD). Exemplo: "14".
  - **{{turn}}** - *(string)*. Turno da rodada (HH). Exemplos: "00", "12".
  - **{{forecastTime}}** - *(string)*. Hora (HHH) de execução atual da imagem. Tempo de previsão (forecast time). Exemplos: "000", "003", "012", "072", "144".
- **urlDates** - *(string)*. URL que obterá o arquivo JSON contendo as datas disponíveis do modelo com o parâmetro *datesRun*.
- **timeRun** - *(number)*. Tempo (em horas) que leva para rodar todo o modelo, ou de quanto em quanto tempo esse modelo é rodado.
- **periodHours** - *(number)*. As figuras são geradas em um intervalo de horas. Esse é o intervalo de horas de cada figura de previsão do modelo. É necessário para calcular e obter um array com as horas de previsão. Por exemplo, para um número de 3, será gerado um array ["000", "003", "006", ...] e para um número 6, será gerado um array ["000", "006", "012", ...]. Valores possíveis: 1, 3 ou 6.
- **periodStart** - *(string)*. Tempo inicial da figura. Exemplo: "000".
- **periodEnd** - *(string)*. Tempo final da figura. Exemplos: "180", "240".
- **default** - *(Object)*. Valores padrão para o modelo.
  - **product** - *(Object)*. Valor padrão de produto. Quando é selecionado um novo modelo, carrega esse valor padrão de produto.
    - **value** - *(string)*. Valor de slug do produto.
    - **group** - *(string)*. Valor de slug do grupo.
    - **region** - *(string)*. Valor de slug da região.
- **options** - *(Object)*. Valores possíveis do modelo que o usuário pode selecionar.
  - **groups** - *(array de objetos: Object[])*. Grupos do modelo que podem ser selecionados pelo usuário. Aqui ficam agrupados os nomes (value) dos produtos que são parecidos. Exemplo: Grupo *ageop* para os produtos *"ageop_250"*, *"ageop_500"*, *"ageop_700"* etc.
    - **label** - *(string)*. Nome do grupo que irá aparecer para o usuário escolher.
    - **value** - *(string)*. Valor de slug do grupo.
  - **products** - *(array de objetos: Object[])*. Produtos do modelo que podem selecionados pelo usuário.
    - **label** - *(string ou null: string | null)*. Nome do produto que irá aparecer para o usuário. Exemplos: *"Nível de 250"*, onde o grupo é *"ageop"*. Pode ser *null* também, se não tiver variações. Por exemplo: *null*, onde o *value* e o *group* são do mesmo nome, como *"prec_pnmm"*.
    - **value** - *(string)*. Valor de slug do produto. Exemplos: "prec_pnmm", "aprec", "ageop_500", "ageop_850", "lapserate", "cis_vento_1000", "cis_vento_3000".
    - **group** - *(string)*. Valor de slug do grupo que o produto pertence. Exemplo: "prec", "cis_vento", "lapserate", "ageop".
    - **regions** - (array de strings: string[]). Os valores possíveis são os que estão nos parâmetros **value** do arquivo JSON **regions.json**. Exemplo: *["ams", "bra", "nte"]*. No caso, aqui são somente os valores de região que este produto possui.

Exemplo:

```bash
[
  {
    "id": 1,
    "label": "BRAMS 8",
    "value": "BRAMS08",
    "urlImage": "https://s1.cptec.inpe.br/grafico/Modelos/{{model}}/pn/{{region}}/{{product}}/{{year}}/{{month}}/{{day}}/{{turn}}/{{model}}_{{product}}_{{region}}_{{year}}{{month}}{{day}}{{turn}}z_{{forecastTime}}z.png",
    "urlDates": "https://s1.cptec.inpe.br/grafico/Modelos/portal_previsao_numerica/mod_brams.json",
    "timeRun": 12,
    "periodHours": 3,
    "periodStart": "000",
    "periodEnd": "180",
    "default": {
      "product": {
        "value": "prec_pnmm",
        "group": "prec",
        "region": "ams"
      }
    },
    "options": {
      "groups": [
        {
          "label": "Precipitação",
          "value": "prec"
        },
        {
          "label": "Água Precipitável",
          "value": "aprec"
        },
        {
          "label": "Altura Geopotencial",
          "value": "ageop"
        },
        {
          "label": "Lapserate (formato novo)",
          "value": "lapserate"
        },
        {
          "label": "Cisalhamento do Vento",
          "value": "cis_vento"
        }
      ],
      "products": [
        {
          "label": "Precipitação, pressão e espessura",
          "value": "prec_pnmm",
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
          "label": "Precipitação a cada 3 horas",
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
          "label": "Precipitação acumulada em 24h, a cada 3h",
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
          "label": "Nível de 250",
          "value": "ageop_250",
          "group": "ageop",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 500",
          "value": "ageop_500",
          "group": "ageop",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 700",
          "value": "ageop_700",
          "group": "ageop",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 850",
          "value": "ageop_850",
          "group": "ageop",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 925",
          "value": "ageop_925",
          "group": "ageop",
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
          "label": "Nível de 1000",
          "value": "cis_vento_1000",
          "group": "cis_vento",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 2000",
          "value": "cis_vento_2000",
          "group": "cis_vento",
          "regions": [
            "ams",
            "bra"
          ]
        },
        {
          "label": "Nível de 3000",
          "value": "cis_vento_3000",
          "group": "cis_vento",
          "regions": [
            "ams",
            "bra"
          ]
        }
      ]
    }
  },

  ...
```

## Observações

As horas de previsão *(periodStart)* e *(periodEnd)* precisam ser fixas para cada modelo. Ou seja, não devem variar na quantidade de horas ao alterar um produto ou região do modelo. Por exemplo, para o modelo BRAMS 08, todos os produtos começam com "000" e terminam com "180". Para o BAM, todos os produtos poderiam começar com "000" e terminar com "240". Não é permitido haver personalização de horas de previsão para um produto do mesmo modelo.

Ou seja, se um modelo for até 180 horas e de 3 em 3 horas, todos os produtos e variáveis ou níveis deste modelo deverão ser assim.


## Sugestão de melhorias futuras

Algumas sugestões para serem desenvolvidas posteriormente:

- Um select no topo, ao lado do botão de animação de todos os quadros, para selecionar quantidade de horas de forecast de cada figura (1 em 1 hora, 2 em 2 horas, 3 em 3 horas, 6 em 6 horas).
- Arquivo de log para acompanhar o que os usuários acessam.
- Uso do Next.js ao invés de React.js.
