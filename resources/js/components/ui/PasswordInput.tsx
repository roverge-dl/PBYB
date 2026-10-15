import React, { forwardRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  hint?: string;
  error?: string;
  requirementText?: string;
  isRequirementMet?: boolean;
  containerClassName?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      label = "Password",
      hint,
      error,
      requirementText = "minimum 8 characters",
      isRequirementMet,
      containerClassName,
      id,
      value,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const isError = Boolean(error);

    // Compute requirement state if not explicitly passed
    const strVal = typeof value === "string" ? value : "";
    const requirementSatisfied =
      typeof isRequirementMet === "boolean"
        ? isRequirementMet
        : strVal.length >= 8;

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
          <input
            id={inputId}
            ref={ref}
            type={showPassword ? "text" : "password"}
            disabled={disabled}
            value={value}
            className={cn(
              "w-full bg-white text-neutral-900 placeholder:text-neutral-400 text-sm font-normal rounded-lg border transition-all duration-200 outline-none",
              "min-h-[48px] px-4 py-3 pr-11 tracking-normal",
              isError
                ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : "border-neutral-200 hover:border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
              disabled &&
                "bg-neutral-50 text-neutral-400 cursor-not-allowed border-neutral-200",
              className,
            )}
            {...props}
          />

          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        </div>

        {requirementText && (
          <div className="flex items-center gap-1.5 text-xs mt-0.5 select-none">
            <span
              className={cn(
                "w-1.5 h-1.5 rounded-full inline-block shrink-0",
                isError
                  ? "bg-red-500"
                  : requirementSatisfied
                    ? "bg-emerald-500"
                    : "bg-neutral-400",
              )}
            />
            <span
              className={cn(
                isError
                  ? "text-red-500"
                  : requirementSatisfied
                    ? "text-emerald-600 font-medium"
                    : "text-neutral-500",
              )}>
              {requirementText}
            </span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-center gap-1.5 text-xs text-red-500 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!error && hint && (
          <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>
        )}
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
