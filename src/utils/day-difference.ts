export default function DayDifference(previousDate: string, currentDate: string, arrayDay: number[]) {
  const previousDateObj = new Date(previousDate);
  const currentDateObj = new Date(currentDate);

  const dayDefference = (currentDateObj.getTime() - previousDateObj.getTime()) / (1000 * 60 * 60 * 24);

  let countDay = 0;

  for (let i = 0; i < dayDefference; i++) {
    const hariSaatIni = previousDateObj.getDay();

    if (arrayDay.includes(hariSaatIni)) {
      countDay++;
    }

    previousDateObj.setDate(previousDateObj.getDate() + 1);
  };

  return countDay;
}