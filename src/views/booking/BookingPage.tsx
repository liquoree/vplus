'use client';

import { BookingModal } from '@/entities/booking';

import { Button } from '@/shared/ui';

import { Footer, Header, TemplateInfoPage } from '@/widgets';

import { BookingContacts } from './booking-contacts/BookingContacts';

import { BookingSummary } from './booking-summary/BookingSummary';

import { BookingUnitCard } from './booking-unit-card/BookingUnitCard';

import type { BookingPageProps } from './model/types';

import { useBookingForm } from './model/useBookingForm';

import './BookingPage.scss';

export function BookingPage(props: BookingPageProps) {
    const form = useBookingForm(props);

    return (
        <div className="booking-page">
            <Header />

            <main className="booking-page__main">
                <TemplateInfoPage
                    title="Бронирование техники"
                    description="Выберите услугу, технику, дату и удобное время"
                >
                    <form className="booking-page__form" onSubmit={form.handleSubmit} noValidate>
                        <div className="booking-page__panel">
                            <div className="booking-page__units">
                                {form.bookingLines.map((line, index) => {
                                    const availability = form.availabilityByLine[line.id];

                                    const isPackage = form.isLinePackage(line);

                                    return (
                                        <BookingUnitCard
                                            key={line.id}
                                            index={index}
                                            canRemove={form.bookingLines.length > 1}
                                            serviceValue={line.serviceId}
                                            bookableItemValue={line.bookableItemId}
                                            bookingOptionValue={line.bookingOptionId}
                                            dateValue={line.date}
                                            timeValue={line.time}
                                            serviceOptions={form.getLineServiceOptions(line)}
                                            bookableItemOptions={form.getLineBookableOptions(line)}
                                            bookingOptionOptions={form.getLineProgramOptions(line)}
                                            timeOptions={availability?.timeOptions ?? []}
                                            isPackage={isPackage}
                                            isTimeLoading={availability?.isLoading ?? false}
                                            errors={form.bookingLineErrors[line.id]}
                                            minDate={form.minDate}
                                            maxDate={form.maxDate}
                                            onChangeService={(value) =>
                                                form.handleServiceChange(line, value)
                                            }
                                            onChangeBookableItem={(value) =>
                                                form.handleBookableItemChange(line, value)
                                            }
                                            onChangeBookingOption={(value) =>
                                                form.handleBookingOptionChange(line, value)
                                            }
                                            onChangeDate={(value) =>
                                                form.handleDateChange(line, value)
                                            }
                                            onChangeTime={(value) =>
                                                form.handleTimeChange(line.id, value)
                                            }
                                            onRemove={() => form.removeBookingLine(line.id)}
                                        />
                                    );
                                })}
                            </div>

                            <BookingSummary
                                totalPrice={form.totalPrice}
                                prepaymentPrice={form.prepaymentPrice}
                            />

                            <Button
                                type="button"
                                text="Добавить ещё"
                                variant="mid"
                                className="booking-page__add"
                                onClick={form.addBookingLine}
                            />

                            <div className="booking-page__divider" />

                            <BookingContacts
                                values={form.contacts}
                                errors={form.contactErrors}
                                isSubmitting={form.isSubmitting}
                                onChange={form.updateContact}
                                onCaptchaSuccess={form.handleCaptchaSuccess}
                                captchaError={form.captchaError}
                                captchaResetKey={form.captchaResetKey}
                                onCaptchaExpired={form.handleCaptchaExpired}
                            />
                        </div>
                    </form>
                </TemplateInfoPage>
            </main>

            <Footer />

            {form.modalStatus && (
                <BookingModal
                    status={form.modalStatus}
                    bookingItems={form.submittedBookingItems}
                    totalPrice={form.submittedTotalPrice}
                    prepaymentPrice={form.submittedPrepaymentPrice}
                    errorMessage={form.modalErrorMessage}
                    onClose={form.closeModal}
                />
            )}
        </div>
    );
}
