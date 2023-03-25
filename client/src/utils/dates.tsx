const toTodayFormat = (date: Date) => {
  return date.toLocaleTimeString("ru-Ru", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
const toGlobalFormat = (date: Date) => {
  return date.toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
};

const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export { isToday, toTodayFormat, toGlobalFormat };
