import { cn } from '@/lib/utils'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string | boolean
  options: { value: string; label: string }[]
  placeholder?: string
}

export default function Select({ label, error, options, placeholder, className, id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors bg-white',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {typeof error === 'string' && error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
