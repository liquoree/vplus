import type {
  BookingLine,
  BookingLineErrors,
  ContactErrors,
  ContactValues,
} from '../model/types';
import {
  getMaxBookingDateValue,
  getSelectedDateTime,
  getTodayDateValue,
} from './booking-date';

export function validateBookingLines(lines: BookingLine[]) {
  const errors: Record<string, BookingLineErrors> = {};
  const today = getTodayDateValue();
  const maxDate = getMaxBookingDateValue();
  const now = new Date();

  lines.forEach((line) => {
    const lineErrors: BookingLineErrors = {};

    if (!line.catalogItemId) {
      lineErrors.catalogItemId = 'Выберите технику';
    }

    if (!line.bookingOptionId) {
      lineErrors.bookingOptionId = 'Выберите услугу';
    }

    if (!line.date) {
      lineErrors.date = 'Выберите дату';
    } else if (line.date < today) {
      lineErrors.date = 'Дата не может быть в прошлом';
    } else if (line.date > maxDate) {
      lineErrors.date = 'Можно выбрать дату максимум на год вперёд';
    }

    if (!line.time) {
      lineErrors.time = 'Выберите время';
    }

    const selectedDateTime = getSelectedDateTime(line.date, line.time);

    if (selectedDateTime && selectedDateTime <= now) {
      lineErrors.time = 'Выбранное время уже прошло';
    }

    if (Object.keys(lineErrors).length > 0) {
      errors[line.id] = lineErrors;
    }
  });

  return errors;
}

export function validateContacts(values: ContactValues) {
  const errors: ContactErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Введите имя';
  }

  if (!values.email.trim()) {
    errors.email = 'Введите email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Введите корректный email';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Введите телефон';
  }

  if (!values.privacy) {
    errors.privacy = 'Нужно согласие';
  }

  if (!values.personalData) {
    errors.personalData = 'Нужно согласие';
  }

  return errors;
}