import { DateTime, Settings } from "luxon";
Settings.defaultZone = "Australia/Victoria";

export const getCurrentDate = () => {
  return DateTime.local().startOf("day").toObject();
};

export const getStartOfWeek = () => {
  return DateTime.local().startOf("week").toObject();
};

export const getFullWeek = (startOfWeek: Date) => {
  const monday = DateTime.fromJSDate(startOfWeek);

  return {
    mon: monday.toObject(),
    tue: monday.plus({ days: 1 }).toObject(),
    wed: monday.plus({ days: 2 }).toObject(),
    thu: monday.plus({ days: 3 }).toObject(),
    fri: monday.plus({ days: 4 }).toObject(),
    sat: monday.plus({ days: 5 }).toObject(),
    sun: monday.plus({ days: 6 }).toObject(),
  };
};

export const getTimeOptions = () => {
  const response = [];
  let dateTime = DateTime.local().startOf("day").set({ hour: 6 });

  for (let i = 0; i <= 64; i++) {
    const timeOption = dateTime.toFormat("h:mm a").toLowerCase();
    response.push(timeOption);
    dateTime = dateTime.plus({ minutes: 15 });
  }
  return response;
};

export default DateTime;
