import Charts from "./Charts";

export default function FrameCharts({ date, cityId, urlCharts, urlCsv }) {
  // console.log("date", date);
  // console.log("cityId", cityId);

  return (
    <div>
      <Charts
        date={date}
        urlCharts={
          urlCharts !== null &&
          urlCharts
            .replace("{{year}}", date.year)
            .replace("{{month}}", date.month)
            .replace("{{day}}", date.day)
            .replace("{{turn}}", date.turn)
            .replace("{{cityId}}", cityId)
        }
        urlCsv={
          urlCsv !== null &&
          urlCsv
            .replace("{{year}}", date.year)
            .replace("{{month}}", date.month)
            .replace("{{day}}", date.day)
            .replace("{{turn}}", date.turn)
            .replace("{{cityId}}", cityId)
        }
      />
    </div>
  );
}
