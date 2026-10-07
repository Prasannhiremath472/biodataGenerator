import { InputHTMLAttributes, forwardRef } from 'react';

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function TextInput(
  props,
  ref,
) {
  return (
    <input
      ref={ref}
      {...props}
      className={`w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-gray-500 focus:outline-none ${props.className ?? ''}`}
    />
  );
});
