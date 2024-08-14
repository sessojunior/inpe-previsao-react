export default function DropDownTime({ currentTime, setCurrentTime, frame, setFrame, model }) {

  console.log("DropDownTime currentTime", currentTime)
  // console.log("currentTime", currentTime)

  const classButtonTime = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-bold bg-white text-black hover:bg-gray-100 text-xs md:text-sm"

  const classButtonTimeActive = "size-9 md:size-[38px] inline-flex justify-center items-center gap-2 rounded-md font-bold bg-blue-600 text-gray-50 text-xs md:text-sm"

  const handleChangeTime = (time) => {
    setCurrentTime(time)
    setFrame({ ...frame, currentTime: time })
  }

  return (
    <>
      <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-md w-60">
        <div className="p-4">
          <label className="block w-full pb-3 text-sm font-bold">Horas de previsão</label>
          <div className="flex flex-wrap gap-1">
            {model.possibleValues.time.map((time, index) => (
              <button key={index} className={currentTime === time ? classButtonTimeActive : classButtonTime} onClick={() => handleChangeTime(time)}>{time}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

