import React, { forwardRef } from "react";
import { cn } from "../../lib/utils";
import { AlertCircle } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      containerClassName,
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const isError = Boolean(error);

    return (
      <div className={cn("w-full flex flex-col gap-1.5", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-800 select-none">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-neutral-400">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-normal rounded-lg border transition-all duration-200 outline-none",
              "min-h-[48px] px-4 py-3",
              leftIcon && "pl-11",
              rightIcon && "pr-11",
              isError
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-neutral-200 hover:border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
              disabled &&
                "bg-neutral-50 text-neutral-400 cursor-not-allowed border-neutral-200",
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-neutral-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-center gap-1.5 text-xs text-red-500 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        ) : hint ? (
          <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
