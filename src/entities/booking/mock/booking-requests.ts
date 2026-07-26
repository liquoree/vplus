import type { BookingRequestRecord } from '../model/types';

function getRelativeDateValue(daysAhead: number) {
  const date = new Date();

  date.setDate(date.getDate() + daysAhead);

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const tomorrow = getRelativeDateValue(1);
const dayAfterTomorrow = getRelativeDateValue(2);
const thirdDay = getRelativeDateValue(3);

export const initialBookingRequests: BookingRequestRecord[] =
  [
    {
      id: 'booking-request-1',

      customer: {
        name: 'Иван',
        phone: '+79216216789',
        email: 'ivanivanov@inbox.ru',
      },

      items: [
        {
          bookingOptionId:
            'quad-base-2-2h',

          bookableItemId: 'quad-bike',
          bookableItemTitle:
            'Квадроцикл',

          serviceId: 'base-rental',
          serviceTitle:
            'Базовый прокат',

          bookingOptionTitle:
            '2 человека, 2 ч. — 7 000 ₽',

          date: tomorrow,
          time: '10:00',

          durationMinutes: 120,
          price: 7000,
        },
      ],

      totalPrice: 7000,
      prepaymentPrice: 3500,

      status: 'pending',

      createdAt: new Date().toISOString(),
      reviewedAt: null,
    },
    {
      id: 'booking-request-2',

      customer: {
        name: 'Анна',
        phone: '+79114238600',
        email: 'anna@example.ru',
      },

      items: [
        {
          bookingOptionId:
            'quad-fishing-2-3h',

          bookableItemId: 'quad-bike',
          bookableItemTitle:
            'Квадроцикл',

          serviceId: 'fishing',
          serviceTitle: 'Рыбалка',

          bookingOptionTitle:
            '2 человека, 3 ч. — 9 500 ₽',

          date: dayAfterTomorrow,
          time: '14:00',

          durationMinutes: 180,
          price: 9500,
        },
      ],

      totalPrice: 9500,
      prepaymentPrice: 4750,

      status: 'approved',

      createdAt: new Date(
        Date.now() - 86_400_000
      ).toISOString(),

      reviewedAt: new Date().toISOString(),
    },
    {
      id: 'booking-request-3',

      customer: {
        name: 'Сергей',
        phone: '+79211234567',
        email: 'sergey@example.ru',
      },

      items: [
        {
          bookingOptionId:
            'snowmobile-base-1-1h',

          bookableItemId: 'snowmobile',
          bookableItemTitle: 'Снегоход',

          serviceId: 'winter-route',
          serviceTitle:
            'Зимний маршрут',

          bookingOptionTitle:
            '1 человек, 1 ч. — 4 500 ₽',

          date: thirdDay,
          time: '10:00',

          durationMinutes: 60,
          price: 4500,
        },
      ],

      totalPrice: 4500,
      prepaymentPrice: 2250,

      status: 'rejected',

      createdAt: new Date(
        Date.now() - 172_800_000
      ).toISOString(),

      reviewedAt: new Date(
        Date.now() - 86_400_000
      ).toISOString(),
    },
  ];