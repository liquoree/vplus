import { Button, TextField } from '@/shared/ui';
import type {
  ContactErrors,
  ContactValues,
} from '../model/types';

type BookingContactsProps = {
  values: ContactValues;
  errors: ContactErrors;
  isSubmitting: boolean;
  onChange: <Key extends keyof ContactValues>(
    key: Key,
    value: ContactValues[Key]
  ) => void;
};

export function BookingContacts({
  values,
  errors,
  isSubmitting,
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
              onChange('name', event.target.value)
            }
          />

          <TextField
            label="Email"
            type="email"
            placeholder="Введите Email"
            value={values.email}
            error={errors.email}
            onChange={(event) =>
              onChange('email', event.target.value)
            }
          />

          <TextField
            label="Телефон"
            type="tel"
            placeholder="Введите телефон"
            value={values.phone}
            error={errors.phone}
            onChange={(event) =>
              onChange('phone', event.target.value)
            }
          />
        </div>

        <div className="booking-page__verification">
          <div className="booking-page__agreements">
            <div className="booking-page__agreement-item">
              <label className="booking-page__agreement">
                <input
                  type="checkbox"
                  checked={values.privacy}
                  onChange={(event) =>
                    onChange('privacy', event.target.checked)
                  }
                />

                <span>
                  Согласен с{' '}
                  <a href="/privacy">
                    политикой конфиденциальности
                  </a>
                </span>
              </label>

              {errors.privacy && (
                <span className="booking-page__agreement-error">
                  {errors.privacy}
                </span>
              )}
            </div>

            <div className="booking-page__agreement-item">
              <label className="booking-page__agreement">
                <input
                  type="checkbox"
                  checked={values.personalData}
                  onChange={(event) =>
                    onChange(
                      'personalData',
                      event.target.checked
                    )
                  }
                />

                <span>
                  Согласен на{' '}
                  <a href="/personal-data">
                    обработку персональных данных
                  </a>
                </span>
              </label>

              {errors.personalData && (
                <span className="booking-page__agreement-error">
                  {errors.personalData}
                </span>
              )}
            </div>
          </div>

          <div className="booking-page__captcha">
            Заглушка SmartCaptcha
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
          После одобрения заявки на указанный email придёт письмо
          со ссылкой на предоплату
        </p>
      </div>
    </div>
  );
}