import PropTypes from 'prop-types'

export default function DropDownTime({ frame, setFrame, model }) {

  const classButtonTime = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 text-xs md:text-sm"

  const classButtonTimeActive = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-medium bg-blue-700 border border-gray-200 text-gray-50 text-xs md:text-sm"

  return (
    <>
      <div className="absolute top-12 right-0 bg-gray-100 border border-gray-200 rounded-md p-4">
        <div>
          <label>Horas de previsão</label>
          <div>
            {model.possibleValues.time.map((time, index) => (
              <button key={index} className={frame.currentTime === time ? classButtonTimeActive : classButtonTime} onClick={() => setFrame({ ...frame, currentTime: time })}>{time}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

DropDownTime.propTypes = {
  frame: PropTypes.object,
  setFrame: PropTypes.func,
  model: PropTypes.object
}
