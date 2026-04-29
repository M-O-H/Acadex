import { clsx } from "clsx";
import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            "block w-full rounded-lg border px-3 py-2 text-gray-900 dark:text-white",
            "bg-white dark:bg-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "transition-colors duration-200",
            "border-gray-300 dark:border-gray-600",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "focus:border-primary-500 focus:ring-primary-500/20",
            props.disabled && "bg-gray-100 dark:bg-gray-600 cursor-not-allowed",
            className,
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
