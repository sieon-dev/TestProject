import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string | boolean
}

export default function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-colors',
          'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
          error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
          className
        )}
        {...props}
      />
      {typeof error === 'string' && error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
