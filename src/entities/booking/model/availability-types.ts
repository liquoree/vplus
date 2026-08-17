export type BookingAvailabilityQuery = {
    bookableItemId: string;
    date: string;
    durationMinutes: number;
};

export type BookingTimeSlot = {
    startTime: string;
    endTime: string;
};

export type BookingAvailabilityResult = {
    date: string;
    bookableItemId: string;
    durationMinutes: number;
    slots: BookingTimeSlot[];
};
