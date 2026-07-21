import Image from 'next/image';
import { cn } from '@/shared/lib/cn';

import './SelectField.scss';

export type SelectFieldOption = {
  value: string;
  label: string;
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
};

export function SelectField({
  label,
  value,
  placeholder,
  options,
  onChange,
  error,
  required,
  className,
}: SelectFieldProps) {
  return (
    <label className={cn('select-field', className)}>
      <span className="select-field__label">{label}</span>

      <span className="select-field__control">
        <select
          className={cn(
            'select-field__select',
            error && 'select-field__select--error'
          )}
          value={value}
          required={required}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option value={option.value} key={option.value}>
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
        />
      </span>

      <span className="select-field__error">{error}</span>
    </label>
  );
}