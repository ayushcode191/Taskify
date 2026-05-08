import { forwardRef } from "react";

import { Loader2 } from "lucide-react";

import { cn } from "../../utils/cn.js";

const variants = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400",

  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",

  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100",

  danger:
    "bg-rose-600 text-white hover:bg-rose-700 disabled:bg-rose-300",

  outline:
    "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50",
};

const sizes = {
  sm: "h-8 px-3 text-sm",

  md: "h-10 px-4 text-sm",

  lg: "h-11 px-5 text-base",

  icon: "h-10 w-10 p-0",
};

const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    leftIcon,
    rightIcon,
    className,
    children,
    disabled,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        leftIcon
      )}

      {children}

      {!loading && rightIcon}
    </button>
  );
});

export default Button;