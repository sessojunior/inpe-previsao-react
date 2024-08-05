import PropTypes from 'prop-types'

export default function FrameImage({ frame, model, date }) {

  console.log("FrameImage")
  // console.log("frame", frame)
  // console.log("model", model)
  // console.log("date", date)

  return (
    <div>
      <p>Exemplo de URL da imagem:
        <br />[https://s1.cptec.inpe.br/grafico/Modelos/<b>{frame.model}</b>/<b>{frame.region}</b>/<b>{frame.options}</b>/<b>{frame.field}</b>
        <br />/<b>{date.yearMinusTimeRun[0]}</b>/<b>{date.monthMinusTimeRun[0]}</b>/<b>{date.dayMinusTimeRun[0]}</b>/<b>{date.lastTurn[0]}</b>/modelo_<b>{frame.currentTime}</b>_<b>{Number(date.timeRun)}</b>h_glo_<b>{date.yearMinusTimeRun[0]}{date.monthMinusTimeRun[0]}{date.dayMinusTimeRun[0]}{date.lastTurn[0]}</b>Z.png]</p>
      {/* <p>URL normal: <span>{frame.urlImage}</span></p>
      <p>URL convertida: <span>{
        frame.urlImage.replaceAll("{{region}}", frame.region)
          .replaceAll("{{options}}", frame.options)
          .replaceAll("{{field}}", frame.field)
          .replaceAll("{{timeRun}}", frame.timeRun)
          .replaceAll("{{lastTurn}}", date.lastTurn[0])
          .replaceAll("{{year}}", date.yearMinusTimeRun[0])
          .replaceAll("{{month}}", date.monthMinusTimeRun[0])
          .replaceAll("{{day}}", date.dayMinusTimeRun[0])}</span></p> */}
      <p>Dados para a troca de imagem:</p>
      <p>[frame.model: <b>{frame.model}</b>]</p>
      <p>[frame.region: <b>{frame.region}</b>]</p>
      <p>[frame.options: <b>{frame.options}</b>]</p>
      <p>[frame.field: <b>{frame.field}</b>]</p>
      <p>[model.possibleValues.time: <b>{model.possibleValues.time.map(time => time + " ")}</b>]</p>
      <p><b>[frame.currentTime: <b>{frame.currentTime}</b>]</b></p>
      <p>[frame.isPlaying: <b>{frame.isPlaying ? "true" : "false"}</b>]</p>
      <p>[frame.timeRun: <b>{frame.timeRun}</b>]</p>
      <p>[frame.init: <b>{frame.init}</b>]</p>
      <p>Data atual: <b>{date.year}-{date.month}-{date.day} {date.hour}:{date.minute} - {date.weekName} {date.day} {date.monthName} {date.year}</b></p>
      <p>[timeRun: <b>{date.timeRun}</b>]</p>
      <p>Data menos o timeRun: <b>{date.yearMinusTimeRun[0]} {date.monthMinusTimeRun[0]} {date.dayMinusTimeRun[0]}</b></p>
      <p>[lastTurn: <b>{date.lastTurn[0]}</b>]</p>
      <p>Último turno de timeRun (00, 06, 12, 18]: <b>{date.yearMinusTimeRun[0]}{date.monthMinusTimeRun[0]}{date.dayMinusTimeRun[0]}<u>{date.lastTurn[0]}</u>Z</b></p>
      <img src="https://s1.cptec.inpe.br/grafico/Modelos/SMNA/figuras/precipitacao/2024/07/11/00/prec_6h_glo_2024071100Z_2024071100Z.png" alt="imagem" className="rounded-md mt-4 w-full " />
    </div>
  )
}

FrameImage.propTypes = {
  frame: PropTypes.object,
  model: PropTypes.object,
  date: PropTypes.object,
}
