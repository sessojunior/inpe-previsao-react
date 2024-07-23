import PropTypes from 'prop-types'

export default function DropDownConfig({ frame, setFrame, models, model, setModel, date }) {

  const classSelect = "py-2 px-2 block w-full border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"

  const classRadio = "block shrink-0 mr-1 border border-gray-200 rounded-full text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"

  const handleChangeModel = (e) => {
    const model = models.find(model => model.value === e.target.value)
    setModel(model)
    setFrame({
      ...frame,
      model: e.target.value,
      region: model.defaultValues.region.value,
      options: model.defaultValues.options.value,
      field: model.defaultValues.field.value,
      maxDays: model.defaultValues.maxDays,
      timeRun: model.defaultValues.timeRun,
      currentTime: model.defaultValues.currentTime,
      urlImage: model.urlImage,
    })
    // console.log("handleChangeModel (model)", model)
    // console.log("handleChangeModel (frame)", frame)
    // console.log("frame.region", frame.region)
    // console.log("model.possibleValues.region", model.possibleValues.region.find(region => region.value === frame.region))
    // console.log("model.possibleValues.region.find", model.possibleValues.region.find(region => region.value === frame.region))
  }

  const handleChangeRegion = (e) => {
    setFrame({ ...frame, region: e.target.value })
  }

  const handleChangeOptions = (e) => {
    setFrame({ ...frame, options: e.target.value })
  }

  const handleChangeField = (e) => {
    setFrame({ ...frame, field: e.target.value })
  }

  const handleChangeInit = (e) => {
    setFrame({ ...frame, init: e.target.value })
  }

  console.log("date.formattedDateMinusTimeRun", date.formattedDateMinusTimeRun)

  console.log("date init", date)

  // console.log("frames", frames)
  // console.log("possibleValues", model.possibleValues)
  // console.log("possibleValues.model", model.possibleValues.model)
  // console.log("id", id)
  // console.log("TopFrame (frame)", frame)

  return (
    <>
      <form>
          <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-md w-60">
            <div className="border-b border-gray-200 p-4">
              <div className="mb-2">
                <label className="block w-full pb-3 text-sm font-bold">Modelo e região</label>
                <select name="model" value={frame.model} onChange={e => handleChangeModel(e)} className={classSelect}>
                  {models.map((model, index) => (
                    <option key={index} value={model.value}>{model.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <select name="region" value={frame.region} onChange={e => handleChangeRegion(e)} className={classSelect}>
                  {model.possibleValues.region.map((region, index) => (
                    <option key={index} value={region.value}>Região {region.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="border-b border-gray-200 p-4">
              <div className="mb-2">
                <label className="block w-full pb-3 text-sm font-bold">Características do modelo</label>
                {model.possibleValues.options.map((option, index) => (
                  <div key={index} className="flex items-center h-6">
                    <input type="radio" name="options" id={`options-${frame.id}-${index}`} value={option.value} onChange={e => handleChangeOptions(e)} defaultChecked={frame.options === option.value} className={classRadio} />
                    <label className="block text-sm cursor-pointer" htmlFor={`options-${frame.id}-${index}`}>{option.label}</label>
                  </div>
                ))}
              </div>
              <select name="field" value={frame.field} onChange={e => handleChangeField(e)} className={classSelect}>
                {model.possibleValues.field.map((field, index) => (
                  <option key={index} value={field.value}>{field.label}</option>
                ))}
              </select>
            </div>
            <div className="border-b border-gray-200 p-4">
              <div>
                <label htmlFor="init" className="block w-full pb-3 text-sm font-bold">Inicialização</label>
                <select name="init" value={frame.init === null ? date.formattedDateMinusTimeRun[0] : frame.init} onChange={e => handleChangeInit(e)} className={classSelect}>
                  {date.formattedDateMinusTimeRun.map((date, index) => (
                    <option key={index} value={date}>{date}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>
    </>
  )
}

DropDownConfig.propTypes = {
  frame: PropTypes.object,
  setFrame: PropTypes.func,
  models: PropTypes.array,
  model: PropTypes.object,
  setModel: PropTypes.func,
  date: PropTypes.object,
}
