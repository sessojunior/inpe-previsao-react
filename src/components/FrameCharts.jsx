import Charts from "./Charts";

export default function FrameCharts({ date, cityId, urlCharts }) {
  // console.log("cityId", cityId);

  return (
    <div>
      <Charts
        date={date}
        urlCharts={urlCharts
          .replace("{{year}}", date.year)
          .replace("{{month}}", date.month)
          .replace("{{day}}", date.day)
          .replace("{{turn}}", date.turn)
          .replace("{{cityId}}", cityId)}
      />
    </div>
  );
}
