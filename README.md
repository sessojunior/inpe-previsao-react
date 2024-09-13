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

```json
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
- **models.json** - Arquivo JSON contendo as configurações padrão e opções possíveis de cada modelo, nome, slug da URL, template da URL da imagem, URL do arquivo JSON no servidor de backend contendo as datas, tempo de rodada, período ou intervalo (em horas) que tem cada imagem, período ou intervalo inicial e final, nome e valor dos grupos possíveis, nome, valor, grupo e regiões de cada produto.

Entrando mais em detalhes, abaixo a descrição de cada arquivo.

### Arquivo JSON *regions.json*

É um array contendo vários objetos com:

- **label** - *(string)*. Nome da região
- **value** - *(string)*. Slug de URL da região

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

```json
[
  {
    "id": 1,
    "label": "BRAMS 8 km",
    "value": "BRAMS08",
    "urlImage": "https://s1.cptec.inpe.br/grafico/Modelos/{{model}}/pn/{{product}}/{{year}}/{{month}}/{{day}}/{{turn}}/{{model}}_{{product}}_{{region}}_{{year}}{{month}}{{day}}{{turn}}z_{{forecastTime}}z.png",
    "urlDates": "https://s1.cptec.inpe.br/grafico/Modelos/portal_previsao_numerica/mod_brams.json",
    "timeRun": 12,
    "periodHours": 3,
    "periodStart": "000",
    "periodEnd": "168",
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
        }
      ]
    }
  },

  ...
```

## Observações

Cada modelo possui as chaves *periodStart* e *periodEnd*, que funcionam para todos os produtos São fixos. Ou seja, não devem variar na quantidade de horas ao alterar um produto ou região do modelo. Por exemplo, para o modelo BRAMS 08, todos os produtos começam com "000" e terminam com "180". Para o BAM, todos os produtos poderiam começar com "000" e terminar com "240".

Ou seja, se um modelo for até 180 horas e de 3 em 3 horas, todos os produtos e variáveis ou níveis deste modelo serão assim.

Entretanto, alguns produtos por serem mais específicos, possuem particularidades, como é o caso de temperatura mínima, temperatura máxima e umidade relativa mínima, que tem um intervalo maior que é de 24 horas. Ou seja, roda 1 vez por dia. Neste caso, esses produtos teriam mais algumas chaves, específicas para estes produtos, como: *periodStart*, *periodEnd* e *periodHours*.

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
  base: "/inpe-previsao-react"
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
