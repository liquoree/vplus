import { Button, TextField } from '@/shared/ui';

import type {
  ContactErrors,
  ContactValues,
} from '../model/types';

import {
  SmartCaptcha,
} from '@/widgets';

type BookingContactsProps = {
  values: ContactValues;
  errors: ContactErrors;
  isSubmitting: boolean;

  onChange: <
    Key extends keyof ContactValues,
  >(
    key: Key,
    value: ContactValues[Key]
  ) => void;

  onCaptchaSuccess: (
    token: string
  ) => void;
  captchaError?: string;
  captchaResetKey: number;
  onCaptchaExpired: () => void;
};

export function BookingContacts({
  values,
  errors,
  isSubmitting,
  onCaptchaSuccess,
  captchaError,
  captchaResetKey,
  onCaptchaExpired,
  onChange,
}: BookingContactsProps) {
  return (
    <div className="booking-page__contacts">
      <div className="booking-page__contacts-inner">
        <h2 className="booking-page__contacts-title">
          Ваши контактные данные
        </h2>

        <div className="booking-page__contact-fields">
          <TextField
            label="Имя"
            placeholder="Введите ваше имя"
            value={values.name}
            error={errors.name}
            onChange={(event) =>
              onChange(
                'name',
                event.target.value
              )
            }
          />

          <TextField
            label="Email"
            type="email"
            placeholder="Введите Email"
            value={values.email}
            error={errors.email}
            onChange={(event) =>
              onChange(
                'email',
                event.target.value
              )
            }
          />

          <TextField
            label="Телефон"
            type="tel"
            placeholder="Введите телефон"
            value={values.phone}
            error={errors.phone}
            onChange={(event) =>
              onChange(
                'phone',
                event.target.value
              )
            }
          />
        </div>

        <div className="booking-page__verification">
          <div className="booking-page__agreements">
            <div className="booking-page__agreement-item">
              <div className="booking-page__agreement">
                <input
                  id="booking-terms"
                  type="checkbox"
                  checked={
                    values.bookingTerms
                  }
                  onChange={(event) =>
                    onChange(
                      'bookingTerms',
                      event.target.checked
                    )
                  }
                />

                <span>
                  <label htmlFor="booking-terms">
                    Ознакомлен и согласен с{' '}
                  </label>

                  <a
                    href="/booking-terms"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Условиями бронирования
                    и аренды
                  </a>
                </span>
              </div>

              {errors.bookingTerms && (
                <span className="booking-page__agreement-error">
                  {errors.bookingTerms}
                </span>
              )}
            </div>

            <div className="booking-page__agreement-item">
              <div className="booking-page__agreement">
                <input
                  id="personal-data-consent"
                  type="checkbox"
                  checked={
                    values.personalData
                  }
                  onChange={(event) =>
                    onChange(
                      'personalData',
                      event.target.checked
                    )
                  }
                />

                <span>
                  <label htmlFor="personal-data-consent">
                    Даю согласие на{' '}
                  </label>

                  <a
                    href="/personal-data-consent"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    обработку персональных
                    данных
                  </a>
                </span>
              </div>

              {errors.personalData && (
                <span className="booking-page__agreement-error">
                  {errors.personalData}
                </span>
              )}
            </div>
          </div>

          <div className="booking-page__captcha-wrapper">
            <div className="booking-page__captcha">
              <SmartCaptcha
                resetKey={
                  captchaResetKey
                }
                onSuccess={
                  onCaptchaSuccess
                }
                onTokenExpired={
                  onCaptchaExpired
                }
              />
            </div>

            {captchaError && (
              <span className="booking-page__captcha-error">
                {captchaError}
              </span>
            )}
          </div>
        </div>

        <Button
          type="submit"
          text="Отправить заявку"
          variant="hero"
          className="booking-page__submit"
          isLoading={isSubmitting}
        />

        <p className="booking-page__note">
          После одобрения заявки на
          указанный email придёт письмо
          со ссылкой на предоплату
        </p>
      </div>
    </div>
  );
}