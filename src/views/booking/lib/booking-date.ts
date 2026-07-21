export function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getTodayDateValue() {
  return formatDateInputValue(new Date());
}

export function getMaxBookingDateValue() {
  const date = new Date();

  date.setFullYear(date.getFullYear() + 1);

  return formatDateInputValue(date);
}

export function getSelectedDateTime(date: string, time: string) {
  if (!date || !time) {
    return null;
  }

  const value = new Date(`${date}T${time}:00`);

  return Number.isNaN(value.getTime()) ? null : value;
}