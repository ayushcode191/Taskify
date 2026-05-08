


import { forwardRef, useId } from "react";

import { cn } from "../../utils/cn.js";

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    leftIcon,
    rightIcon,
    className,
    id: idProp,
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

      {/* Input Wrapper */}
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          id={id}
          ref={ref}
          className={cn(
            "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400",
            "focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error &&
              "border-rose-300 focus:border-rose-400 focus:ring-rose-100",
            className
          )}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {rightIcon}
          </div>
        )}
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

export default Input;