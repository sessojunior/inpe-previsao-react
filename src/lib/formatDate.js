// Input date: YYYY-MM-DD HHz. Ex: 2024-08-07 12z
// Output date: Weekday DD Monthname YYYY HH UTC. Ex: Ter 07 Ago 2024 12 UTC
const INIT_PATTERN = /^(\d{4})-(\d{2})-(\d{2}) (\d{2})z$/i;

export function isValidForecastInit(value) {
  if (typeof value !== "string") {
    return false;
  }

  const match = value.match(INIT_PATTERN);
  if (!match) {
    return false;
  }

  const [, year, month, day, turn] = match;
  const parsedDate = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day), Number(turn))
  );

  return (
    parsedDate.getUTCFullYear() === Number(year) &&
    parsedDate.getUTCMonth() === Number(month) - 1 &&
    parsedDate.getUTCDate() === Number(day) &&
    parsedDate.getUTCHours() === Number(turn)
  );
}

export function formatDate(date) {
  // console.log("formatDate date", date)

  if (!isValidForecastInit(date)) {
    return;
  }

  const year = date.slice(0, 4);
  const month = date.slice(5, 7);
  const day = date.slice(8, 10);
  const turn = date.slice(11, 13);

  // Criar um objeto Date em UTC
  const fullDate = new Date(`${year}-${month}-${day}T${turn}:00:00Z`);

  // Obter o nome do dia da semana (abreviado e capitalizado)
  const weekNameLowercase = fullDate
    .toLocaleDateString("pt-BR", { weekday: "short", timeZone: "UTC" })
    .replace(".", "");
  const weekName =
    weekNameLowercase.charAt(0).toUpperCase() + weekNameLowercase.slice(1);

  // Obter o nome do mês (abreviado e capitalizado)
  const monthNameLowercase = fullDate
    .toLocaleDateString("pt-BR", { month: "short", timeZone: "UTC" })
    .replace(".", "");
  const monthName =
    monthNameLowercase.charAt(0).toUpperCase() + monthNameLowercase.slice(1);

  return `${weekName} ${day} ${monthName} ${year} ${turn} UTC`;
}
