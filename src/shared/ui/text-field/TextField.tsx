import Image from 'next/image';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

import './TextField.scss';

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  icon?: 'select-date' | 'select-time';
};

export function TextField({
  label,
  error,
  icon,
  className,
  ...props
}: TextFieldProps) {
  return (
    <label className={cn('text-field', className)}>
      <span className="text-field__label">{label}</span>

      <span className="text-field__control">
        <input
          {...props}
          className={cn(
            'text-field__input',
            error && 'text-field__input--error'
          )}
        />

        {icon && (
          <Image
            className="text-field__icon"
            src={`/images/icons/${icon}.svg`}
            alt=""
            width={18}
            height={18}
          />
        )}
      </span>

      <span className="text-field__error">{error}</span>
    </label>
  );
}