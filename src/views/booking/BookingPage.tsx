'use client';

import { Button } from '@/shared/ui';
import { BookingModal } from '@/entities/booking';
import { Footer, Header, TemplateInfoPage } from '@/widgets';

import { BookingContacts } from './booking-contacts/BookingContacts';
import { BookingSummary } from './booking-summary/BookingSummary';
import { BookingUnitCard } from './booking-unit-card/BookingUnitCard';
import { useBookingForm } from './model/useBookingForm';
import type { BookingPageProps } from './model/types';

import './BookingPage.scss';

export function BookingPage(props: BookingPageProps) {
  const form = useBookingForm(props);

  return (
    <div className="booking-page">
      <Header />

      <main className="booking-page__main">
        <TemplateInfoPage
          title="Бронирование техники"
          description="Выберите технику, а также дату и время, когда подъедете на базу"
        >
          <form
            className="booking-page__form"
            onSubmit={form.handleSubmit}
            noValidate
          >
            <div className="booking-page__panel">
              <div className="booking-page__units">
                {form.bookingLines.map((line, index) => {
                  const availability =
                    form.availabilityByLine[line.id];

                  return (
                    <BookingUnitCard
                      key={line.id}
                      index={index}
                      canRemove={form.bookingLines.length > 1}
                      catalogValue={line.catalogItemId}
                      serviceValue={line.bookingOptionId}
                      dateValue={line.date}
                      timeValue={line.time}
                      catalogOptions={form.catalogOptions}
                      serviceOptions={form.getServiceOptions(line)}
                      timeOptions={availability?.timeOptions ?? []}
                      isTimeLoading={
                        availability?.isLoading ?? false
                      }
                      errors={form.bookingLineErrors[line.id]}
                      minDate={form.minDate}
                      maxDate={form.maxDate}
                      onChangeCatalog={(value) =>
                        form.handleCatalogChange(line, value)
                      }
                      onChangeService={(value) =>
                        form.handleServiceChange(line, value)
                      }
                      onChangeDate={(value) =>
                        form.handleDateChange(line, value)
                      }
                      onChangeTime={(value) =>
                        form.handleTimeChange(line.id, value)
                      }
                      onRemove={() =>
                        form.removeBookingLine(line.id)
                      }
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
          totalPrice={form.totalPrice}
          prepaymentPrice={form.prepaymentPrice}
          onClose={form.closeModal}
        />
      )}
    </div>
  );
}