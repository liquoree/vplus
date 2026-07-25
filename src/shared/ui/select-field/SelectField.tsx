import Image from 'next/image';

import { cn } from '@/shared/lib/cn';

import './SelectField.scss';

export type SelectFieldOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  options: SelectFieldOption[];
  onChange: (value: string) => void;

  error?: string;
  required?: boolean;
  className?: string;

  allowEmptySelection?: boolean;
  isDisabled?: boolean;
};

export function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
  error,
  required = false,
  className,
  allowEmptySelection = false,
  isDisabled = false,
}: SelectFieldProps) {
  return (
    <label
      className={cn(
        'select-field',
        isDisabled && 'select-field--disabled',
        className
      )}
    >
      <span className="select-field__label">
        {label}

        {required && (
          <span
            className="select-field__required"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </span>

      <span className="select-field__control">
        <select
          className={cn(
            'select-field__select',
            error && 'select-field__select--error'
          )}
          value={value}
          required={required}
          disabled={isDisabled}
          aria-invalid={Boolean(error)}
          onChange={(event) =>
            onChange(event.target.value)
          }
        >
          <option
            value=""
            disabled={!allowEmptySelection}
          >
            {placeholder}
          </option>

          {options.map((option) => (
            <option
              value={option.value}
              disabled={option.disabled}
              key={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        <Image
          className="select-field__icon"
          src="/images/icons/select-arrow.svg"
          alt=""
          width={18}
          height={18}
          aria-hidden="true"
        />
      </span>

      {error && (
        <span className="select-field__error">
          {error}
        </span>
      )}
    </label>
  );
}