export type tDayNameID = "minggu" | "senin" | "selasa" | "rabu" | "kamis" | "jum'at" | "sabtu";
const DayNameID: tDayNameID[] = ["minggu", "senin", "selasa", "rabu", "kamis", "jum'at", "sabtu"];

export function GetDayNameID(day: number): tDayNameID {
  return DayNameID[day];
}

export type tMonth = "januari" | "februari" | "maret" | "april" | "mei" | "juni" | "juli" | "agustus" | "september" | "oktober" | "november" | "desember";
const MonthNameID: tMonth[] = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];

export function GetMonthID(month: number): tMonth {
  return MonthNameID[month];
}

export function FormatDateID(date: string | Date) {
  const _date = new Date(date);
  const day = GetDayNameID(_date.getDay());
  const month = GetMonthID(_date.getMonth());
  const dateNumber = _date.getDate();
  const year = _date.getFullYear();
  return `${day}, ${dateNumber} ${month} ${year}`;
}

type DateV2 = {
  year: number;
  month: number;
  day: number;
};

export function FormatDateIDv2(date: DateV2) {
  const _date = new Date(`${date.year}-${date.month > 9 ? date.month : `0${date.month}`}-${date.day > 9 ? date.day : `0${date.day}`}`);
  const day = GetDayNameID(_date.getDay());
  const month = GetMonthID(_date.getMonth());
  const dateNumber = _date.getDate();
  const year = _date.getFullYear();
  return `${day}, ${dateNumber} ${month} ${year}`;
}

export function ThisDate(): string {
  const _date = new Date();
  const date = _date.getDate();
  const month = _date.getMonth() + 1;
  const getFullYear = _date.getFullYear();
  return `${getFullYear}-${month > 9 ? month : `0${month}`}-${date > 9 ? date : `0${date}`}`;
}