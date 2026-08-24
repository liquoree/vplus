import { useRef, useState } from 'react';

import { getBookingAvailability } from '@/entities/booking';

import { getSelectedBookingOption } from '../../lib/booking-catalog';

import type { BookingLine, BookingLineAvailability, BookingPageProps } from '../types';

export function useBookingAvailability(bookingOptions: BookingPageProps['bookingOptions']) {
    const [availabilityByLine, setAvailabilityByLine] = useState<
        Record<string, BookingLineAvailability>
    >({});

    const availabilityRequestIds = useRef<Record<string, number>>({});

    const clearAvailability = (lineId: string) => {
        availabilityRequestIds.current[lineId] = (availabilityRequestIds.current[lineId] ?? 0) + 1;

        setAvailabilityByLine((currentAvailability) => ({
            ...currentAvailability,
            [lineId]: {
                isLoading: false,
                timeOptions: [],
            },
        }));
    };

    const removeAvailability = (lineId: string) => {
        availabilityRequestIds.current[lineId] = (availabilityRequestIds.current[lineId] ?? 0) + 1;

        setAvailabilityByLine((currentAvailability) => {
            const nextAvailability = {
                ...currentAvailability,
            };

            delete nextAvailability[lineId];

            return nextAvailability;
        });

        delete availabilityRequestIds.current[lineId];
    };

    const loadAvailability = async (line: BookingLine) => {
        const requestId = (availabilityRequestIds.current[line.id] ?? 0) + 1;

        availabilityRequestIds.current[line.id] = requestId;

        const selectedOption = getSelectedBookingOption(line, bookingOptions);

        if (
            !line.bookableItemId ||
            !line.date ||
            !selectedOption ||
            selectedOption.durationMinutes <= 0
        ) {
            setAvailabilityByLine((currentAvailability) => ({
                ...currentAvailability,
                [line.id]: {
                    isLoading: false,
                    timeOptions: [],
                },
            }));

            return;
        }

        setAvailabilityByLine((currentAvailability) => ({
            ...currentAvailability,
            [line.id]: {
                isLoading: true,
                timeOptions: [],
            },
        }));

        try {
            const result = await getBookingAvailability({
                bookableItemId: line.bookableItemId,
                date: line.date,
                durationMinutes: selectedOption.durationMinutes,
            });

            if (availabilityRequestIds.current[line.id] !== requestId) {
                return;
            }

            setAvailabilityByLine((currentAvailability) => ({
                ...currentAvailability,
                [line.id]: {
                    isLoading: false,
                    timeOptions: result.slots.map((slot) => ({
                        value: slot.startTime,
                        label: `${slot.startTime}–${slot.endTime}`,
                    })),
                },
            }));
        } catch {
            if (availabilityRequestIds.current[line.id] !== requestId) {
                return;
            }

            setAvailabilityByLine((currentAvailability) => ({
                ...currentAvailability,
                [line.id]: {
                    isLoading: false,
                    timeOptions: [],
                },
            }));
        }
    };

    return {
        availabilityByLine,

        loadAvailability,
        clearAvailability,
        removeAvailability,
    };
}
