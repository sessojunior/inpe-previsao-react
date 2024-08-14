export default function FrameImage({ frame, model, dates }) {

  // console.log("FrameImage")

  const init = frame.init ?? dates[0]
  const year = init?.slice(0, 4)
  const month = init?.slice(5, 7)
  const day = init?.slice(8, 10)
  const turn = init?.slice(11, 13)
  const forecastTime = frame.forecastTime ?? model.possibleValues.time[0]

  // console.log("init", init)
  // console.log("FrameImage dates", dates)
  // console.log("FrameImage frame", frame)
  // console.log("FrameImage model", model)

  // console.log("model.urlImage", model.urlImage)

  return (
    <div>
      <p className="pb-2">Exemplo de URL da imagem:
        <br />[https://s1.cptec.inpe.br/grafico/Modelos/<b>{frame.model}</b>/<b>{frame.region}</b>/<b>{frame.product}</b>
        <br />/<b>{year}</b>/<b>{month}</b>/<b>{day}</b>/<b>{turn}</b>/modelo_<b>{forecastTime}</b>_<b>{model.defaultValues.timeRun}</b>h_glo_<b>{year}{month}{day}{turn}</b>Z.png]</p>
      <p className="pb-2">URL do modelo:
        <br /><b>{model.urlImage.replaceAll("{{", " {{").replaceAll("}}", "}} ")}</b></p>
      <p className="pb-2">URL convertida:
        <br />[<b>{
          model.urlImage.replaceAll("{{model}}", " " + model.value + " ")
            .replaceAll("{{region}}", " " + frame.region + " ")
            .replaceAll("{{product}}", " " + frame.product + " ")
            .replaceAll("{{forecastTime}}", " " + forecastTime + " ")
            .replaceAll("{{timeRun}}", " " + model.defaultValues.timeRun + " ")
            .replaceAll("{{turn}}", " " + turn + " ")
            .replaceAll("{{year}}", " " + year + " ")
            .replaceAll("{{month}}", " " + month + " ")
            .replaceAll("{{day}}", " " + day + " ")}</b>]</p>
      <p className="pb-2">Dados para a troca de imagem:</p>
      <p>[frame.model: <b>{frame.model}</b>]</p>
      <p>[frame.region: <b>{frame.region}</b>]</p>
      <p>[frame.product: <b>{frame.product}</b>]</p>
      <p>[model.possibleValues.time: <b>{model.possibleValues.time.map(time => time + " ")}</b>]</p>
      <p><b>[frame.forecastTime: <b>{frame.forecastTime}</b>]</b></p>
      <p><b>[forecastTime: <b>{forecastTime}</b>]</b></p>
      <p>[frame.isPlaying: <b>{frame.isPlaying ? "true" : "false"}</b>]</p>
      <p>[frame.timeRun: <b>{frame.timeRun}</b>]</p>
      <p>[frame.init: <b>{frame.init}</b>]</p>
      <p>[init: <b>{init}</b>]</p>
      <p>[timeRun: <b>{frame.timeRun}</b>]</p>
      <p>[year: <b>{year}</b>]</p>
      <p>[month: <b>{month}</b>]</p>
      <p>[day: <b>{day}</b>]</p>
      <p>[turn: <b>{turn}</b>]</p>
      <div className="w-full">
        <img src="https://s1.cptec.inpe.br/grafico/Modelos/SMNA/figuras/precipitacao/2024/07/11/00/prec_6h_glo_2024071100Z_2024071100Z.png" alt="imagem" className="rounded-md mt-4 w-full " />
        <div className="mt-4 flex justify-end">
          <a href="https://s1.cptec.inpe.br/grafico/Modelos/SMNA/figuras/precipitacao/2024/07/11/00/prec_6h_glo_2024071100Z_2024071100Z.png" download="imagem-de-previsao.png" target="_blank" rel="noreferrer" className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700">Download da imagem</a>
        </div>
      </div>
    </div>
  )
}
