import PropTypes from 'prop-types'

export default function DropDownConfig({ frame, setFrame, models, model, setModel }) {

  const handleChangeModel = (e) => {
    const model = models.find(model => model.value === e.target.value)
    setModel(model)
    setFrame({
      ...frame,
      model: e.target.value,
      region: model.defaultValues.region.value,
      options: model.defaultValues.options.value,
      field: model.defaultValues.field.value,
      init: model.defaultValues.init,
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

  // console.log("frames", frames)
  // console.log("possibleValues", model.possibleValues)
  // console.log("possibleValues.model", model.possibleValues.model)
  // console.log("id", id)
  // console.log("TopFrame (frame)", frame)

  return (
    <>
      <form>
          <div className="absolute top-12 left-0 bg-gray-100 border border-gray-200 rounded-md p-4">
            <div className="border-b border-gray-200">
              <div>
                <label>Modelo e região</label>
                <select name="model" value={frame.model} onChange={e => handleChangeModel(e)}>
                  {models.map((model, index) => (
                    <option key={index} value={model.value}>{model.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <select name="region" value={frame.region} onChange={e => handleChangeRegion(e)}>
                  {model.possibleValues.region.map((region, index) => (
                    <option key={index} value={region.value}>Região {region.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="border-b border-gray-200">
              <div>
                <label>Características do modelo</label>
                {model.possibleValues.options.map((option, index) => (
                  <div key={index}>
                    <input type="radio" name="options" value={option.value} onChange={e => handleChangeOptions(e)} defaultChecked={frame.options === option.value} /> {option.label}
                  </div>
                ))}
                <select name="field" value={frame.field} onChange={e => handleChangeField(e)}>
                  {model.possibleValues.field.map((field, index) => (
                    <option key={index} value={field.value}>{field.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div>
                <label htmlFor="init">Inicialização</label>
                <select name="init" value={frame.init} onChange={e => handleChangeInit(e)}>
                  {model.possibleValues.init.map((init, index) => (
                    <option key={index} value={init}>{init}</option>
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
  setModel: PropTypes.func
}
