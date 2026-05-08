import { forwardRef, useId } from "react";

import { ChevronDown } from "lucide-react";

import { cn } from "../../utils/cn.js";

const Select = forwardRef(function Select(
  {
    label,
    error,
    hint,
    options = [],
    className,
    id: idProp,
    children,
    ...props
  },
  ref
) {
  const generatedId = useId();

  const id = idProp || generatedId;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      {/* Select */}
      <div className="relative">
        <select
          id={id}
          ref={ref}
          className={cn(
            "h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm text-slate-900 shadow-sm transition-colors",
            "focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200",
            "disabled:cursor-not-allowed disabled:bg-slate-50",
            error &&
              "border-rose-300 focus:border-rose-400 focus:ring-rose-100",
            className
          )}
          {...props}
        >
          {children ||
            options.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
        </select>

        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden
        />
      </div>

      {/* Messages */}
      {error ? (
        <p className="mt-2 text-xs text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Select;