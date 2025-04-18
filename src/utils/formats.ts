import moment from "moment";

const collapseLongString = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength).concat("...");
  } else {
    return text;
  }
};

const formatFirstAndLastName = (userName: string) => {
  const splittedName = userName.split(" ");
  const firstName = splittedName[0];
  const lastName = splittedName[splittedName.length - 1];
  return firstName + " " + lastName;
};

const formatPhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    const formattedPhone = `+55${digits}`;
    return formattedPhone;
  } else {
    throw new Error("Invalid phone number format");
  }
};

const unformatPhoneNumber = (number: string): string => {
  const localNumber = number.slice(3);

  const areaCode = localNumber.slice(0, 2);
  const nineDigit = localNumber.slice(2, 3);
  const firstPart = localNumber.slice(3, 7);
  const secondPart = localNumber.slice(7);

  return `(${areaCode}) ${nineDigit}${firstPart}-${secondPart}`;
};

const formatDate = (date: string) => {
  return moment.utc(date).format("DD/MM/YYYY");
};

const formatDateAmericanPattern = (dateString: string) => {
  const [month, day, year] = dateString.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const formatTimeString = (time: string): string => {
  // Split the input time string "HH:MM:SS" into separate parts
  const [hoursStr, minutesStr, secondsStr] = time.split(":");
  let hours = parseInt(hoursStr, 10);
  let minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);

  // Round the minutes based on the seconds value
  if (seconds >= 30) {
    minutes += 1;
  }

  // If minutes exceed 59, increment hours and reset minutes
  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }

  // Determine the appropriate format based on the values of hours and minutes
  if (hours === 0) {
    // Only minutes are present
    return `${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  } else if (minutes === 0) {
    // Only whole hours are present
    return `${hours} ${hours === 1 ? "hora" : "horas"}`;
  } else {
    // Both hours and minutes are present
    return `${hours} ${hours === 1 ? "hora" : "horas"} e ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
  }
};

const secondsToFullTimeString = (durationInSeconds: number): string => {
  const hours = Math.floor(durationInSeconds / 3600);
  const minutes = Math.floor((durationInSeconds % 3600) / 60);
  const seconds = durationInSeconds % 60;

  const hourString = hours > 0 ? `${hours} hora${hours > 1 ? "s" : ""}` : "";
  const minuteString =
    minutes > 0 ? `${minutes} minuto${minutes > 1 ? "s" : ""}` : "";
  const secondString =
    seconds > 0 ? `${seconds} segundo${seconds > 1 ? "s" : ""}` : "";

  if (hours > 0) {
    return `${hourString}${minutes > 0 ? ` e ${minuteString}` : ""}`;
  } else if (minutes > 0) {
    return `${minuteString}${seconds > 0 ? ` e ${secondString}` : ""}`;
  } else {
    return secondString;
  }
};

const formatPhoneNumberWithoutCountryCode = (contactNumber: string): string => {
  return contactNumber.slice(3);
};

export {
  collapseLongString,
  formatDate,
  formatDateAmericanPattern,
  formatFirstAndLastName,
  formatPhoneNumber,
  formatPhoneNumberWithoutCountryCode,
  formatTimeString,
  secondsToFullTimeString,
  unformatPhoneNumber,
};
