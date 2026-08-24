import { useState } from 'react';

import {
    createEmptyBookingLine,
    createInitialBookingLine,
    getBookableItemOptions,
    getCatalogItem,
    getProgramOptions,
    getServiceOptions,
    isBookableItemCompatibleWithService,
    isPackageBookingLine,
} from '../../lib/booking-catalog';

import { validateBookingLines } from '../../lib/booking-validation';

import type { BookingLine, BookingLineErrors, BookingPageProps } from '../types';

type UseBookingLinesParams = {
    items: BookingPageProps['items'];
    bookingOptions: BookingPageProps['bookingOptions'];

    initialVehicleSlug?: string;
    initialServiceSlug?: string;
    initialPackageSlug?: string;

    loadAvailability: (line: BookingLine) => Promise<void>;
    clearAvailability: (lineId: string) => void;
    removeAvailability: (lineId: string) => void;
};

export function useBookingLines({
    items,
    bookingOptions,

    initialVehicleSlug,
    initialServiceSlug,
    initialPackageSlug,

    loadAvailability,
    clearAvailability,
    removeAvailability,
}: UseBookingLinesParams) {
    const [bookingLines, setBookingLines] = useState<BookingLine[]>(() => [
        createInitialBookingLine(items, bookingOptions, {
            initialVehicleSlug,
            initialServiceSlug,
            initialPackageSlug,
        }),
    ]);

    const [bookingLineErrors, setBookingLineErrors] = useState<Record<string, BookingLineErrors>>(
        {},
    );

    const clearBookingLineErrors = (lineId: string, patch: Partial<BookingLine>) => {
        setBookingLineErrors((currentErrors) => {
            const currentLineErrors = currentErrors[lineId];

            if (!currentLineErrors) {
                return currentErrors;
            }

            const nextLineErrors = {
                ...currentLineErrors,
            };

            const errorFields: Array<keyof BookingLineErrors> = [
                'serviceId',
                'bookableItemId',
                'bookingOptionId',
                'date',
                'time',
            ];

            errorFields.forEach((field) => {
                if (field in patch) {
                    delete nextLineErrors[field];
                }
            });

            const nextErrors = {
                ...currentErrors,
            };

            if (Object.keys(nextLineErrors).length === 0) {
                delete nextErrors[lineId];
            } else {
                nextErrors[lineId] = nextLineErrors;
            }

            return nextErrors;
        });
    };

    const updateBookingLine = (lineId: string, patch: Partial<BookingLine>) => {
        setBookingLines((currentLines) =>
            currentLines.map((line) =>
                line.id === lineId
                    ? {
                          ...line,
                          ...patch,
                      }
                    : line,
            ),
        );

        clearBookingLineErrors(lineId, patch);
    };

    const handleServiceChange = (line: BookingLine, serviceId: string) => {
        if (!serviceId) {
            updateBookingLine(line.id, {
                serviceId: '',
                bookingOptionId: '',
                selectionSource: line.bookableItemId ? 'bookable' : null,
                time: '',
            });

            clearAvailability(line.id);

            return;
        }

        const canKeepBookableItem = isBookableItemCompatibleWithService(
            line.bookableItemId,
            serviceId,
            bookingOptions,
        );

        const nextBookableItemId = canKeepBookableItem ? line.bookableItemId : '';

        const nextSelectionSource = nextBookableItemId
            ? (line.selectionSource ?? 'service')
            : 'service';

        updateBookingLine(line.id, {
            serviceId,
            bookableItemId: nextBookableItemId,
            bookingOptionId: '',
            selectionSource: nextSelectionSource,
            time: '',
        });

        clearAvailability(line.id);
    };

    const handleBookableItemChange = (line: BookingLine, bookableItemId: string) => {
        if (!bookableItemId) {
            updateBookingLine(line.id, {
                bookableItemId: '',
                bookingOptionId: '',
                selectionSource: line.serviceId ? 'service' : null,
                time: '',
            });

            clearAvailability(line.id);

            return;
        }

        const selectedItem = getCatalogItem(items, bookableItemId);

        if (selectedItem?.kind === 'package') {
            updateBookingLine(line.id, {
                serviceId: '',
                bookableItemId,
                bookingOptionId: '',
                selectionSource: 'bookable',
                time: '',
            });

            clearAvailability(line.id);

            return;
        }

        const canKeepService = isBookableItemCompatibleWithService(
            bookableItemId,
            line.serviceId,
            bookingOptions,
        );

        const nextServiceId = canKeepService ? line.serviceId : '';

        const nextSelectionSource = nextServiceId
            ? (line.selectionSource ?? 'bookable')
            : 'bookable';

        updateBookingLine(line.id, {
            serviceId: nextServiceId,
            bookableItemId,
            bookingOptionId: '',
            selectionSource: nextSelectionSource,
            time: '',
        });

        clearAvailability(line.id);
    };

    const handleBookingOptionChange = (line: BookingLine, bookingOptionId: string) => {
        const nextLine: BookingLine = {
            ...line,
            bookingOptionId,
            time: '',
        };

        updateBookingLine(line.id, {
            bookingOptionId,
            time: '',
        });

        if (bookingOptionId && nextLine.date) {
            void loadAvailability(nextLine);

            return;
        }

        clearAvailability(line.id);
    };

    const handleDateChange = (line: BookingLine, date: string) => {
        const nextLine: BookingLine = {
            ...line,
            date,
            time: '',
        };

        updateBookingLine(line.id, {
            date,
            time: '',
        });

        void loadAvailability(nextLine);
    };

    const handleTimeChange = (lineId: string, time: string) => {
        updateBookingLine(lineId, {
            time,
        });
    };

    const addBookingLine = () => {
        setBookingLines((currentLines) => [...currentLines, createEmptyBookingLine()]);
    };

    const removeBookingLine = (lineId: string) => {
        setBookingLines((currentLines) => currentLines.filter((line) => line.id !== lineId));

        setBookingLineErrors((currentErrors) => {
            const nextErrors = {
                ...currentErrors,
            };

            delete nextErrors[lineId];

            return nextErrors;
        });

        removeAvailability(lineId);
    };

    const getLineServiceOptions = (line: BookingLine) => {
        return getServiceOptions(line, items, bookingOptions);
    };

    const getLineBookableOptions = (line: BookingLine) => {
        return getBookableItemOptions(line, items, bookingOptions);
    };

    const getLineProgramOptions = (line: BookingLine) => {
        return getProgramOptions(line, bookingOptions);
    };

    const isLinePackage = (line: BookingLine) => {
        return isPackageBookingLine(line, items);
    };

    const validate = () => {
        const errors = validateBookingLines(bookingLines, items, bookingOptions);

        setBookingLineErrors(errors);

        return Object.keys(errors).length === 0;
    };

    return {
        bookingLines,
        bookingLineErrors,

        getLineServiceOptions,
        getLineBookableOptions,
        getLineProgramOptions,
        isLinePackage,

        handleServiceChange,
        handleBookableItemChange,
        handleBookingOptionChange,
        handleDateChange,
        handleTimeChange,

        addBookingLine,
        removeBookingLine,

        validate,
    };
}
