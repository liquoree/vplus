import { useState } from 'react';

import { validateContacts } from '../../lib/booking-validation';

import type { ContactErrors, ContactValues } from '../types';

const initialContacts: ContactValues = {
    name: '',
    email: '',
    phone: '',
    bookingTerms: false,
    personalData: false,
};

export function useBookingContacts() {
    const [contacts, setContacts] = useState<ContactValues>(initialContacts);

    const [contactErrors, setContactErrors] = useState<ContactErrors>({});

    const updateContact = <Key extends keyof ContactValues>(
        key: Key,
        value: ContactValues[Key],
    ) => {
        setContacts((currentContacts) => ({
            ...currentContacts,
            [key]: value,
        }));

        setContactErrors((currentErrors) => {
            if (!currentErrors[key]) {
                return currentErrors;
            }

            const nextErrors = {
                ...currentErrors,
            };

            delete nextErrors[key];

            return nextErrors;
        });
    };

    const validate = () => {
        const errors = validateContacts(contacts);

        setContactErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const applyValidationErrors = (errors: ContactErrors) => {
        setContactErrors((currentErrors) => ({
            ...currentErrors,
            ...errors,
        }));
    };

    return {
        contacts,
        contactErrors,

        updateContact,
        validate,
        applyValidationErrors,
    };
}
