export const BOOKING_SCHEDULE = {
  slotStepMinutes: 30,

  workingIntervals: [
    {
      startTime: '10:00',
      endTime: '13:00',
    },
    {
      startTime: '14:00',
      endTime: '20:00',
    },
  ],
} as const;