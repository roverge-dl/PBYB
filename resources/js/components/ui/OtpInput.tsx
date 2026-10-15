import React, {
  useRef,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { cn } from "../../lib/utils";
import { AlertCircle } from "lucide-react";

export interface OtpInputProps {
  /** Number of OTP digits (default 6) */
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  hint?: string;
  disabled?: boolean;
  /** Auto-focus the first cell on mount */
  autoFocus?: boolean;
  className?: string;
}

export interface OtpInputHandle {
  focus: () => void;
  clear: () => void;
}

/**
 * World-class OTP input component:
 * – Individual digit boxes with active / filled / error states
 * – Auto-advance on digit entry
 * – Backspace moves focus to previous cell
 * – Paste the full code into any cell and it fills them all
 * – Keyboard-only navigable (ArrowLeft / ArrowRight)
 * – Mobile-friendly: inputMode="numeric", pattern="[0-9]*"
 */
export const OtpInput = forwardRef<OtpInputHandle, OtpInputProps>(
  (
    {
      length = 6,
      value,
      onChange,
      error,
      label,
      hint,
      disabled = false,
      autoFocus = false,
      className,
    },
    ref,
  ) => {
    // digits array derived from value
    const digits = Array.from({ length }, (_, i) => value[i] ?? "");

    // refs to each cell input
    const cellRefs = useRef<(HTMLInputElement | null)[]>([]);

    // expose imperative handle
    useImperativeHandle(ref, () => ({
      focus: () => cellRefs.current[0]?.focus(),
      clear: () => onChange(""),
    }));

    // auto-focus on mount
    useEffect(() => {
      if (autoFocus) {
        setTimeout(() => cellRefs.current[0]?.focus(), 50);
      }
    }, [autoFocus]);

    const focusCell = useCallback(
      (index: number) => {
        const cell = cellRefs.current[Math.max(0, Math.min(length - 1, index))];
        cell?.focus();
      },
      [length],
    );

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number,
    ) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (digits[index]) {
          // clear current cell
          const newDigits = [...digits];
          newDigits[index] = "";
          onChange(newDigits.join(""));
        } else {
          // move back and clear previous
          const prev = index - 1;
          if (prev >= 0) {
            const newDigits = [...digits];
            newDigits[prev] = "";
            onChange(newDigits.join(""));
            focusCell(prev);
          }
        }
        return;
      }

      if (e.key === "Delete") {
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusCell(index - 1);
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        focusCell(index + 1);
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        focusCell(0);
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        focusCell(length - 1);
        return;
      }
    };

    const handleInput = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number,
    ) => {
      const raw = e.target.value;

      // Handle paste-like input on a single cell (more than 1 char typed somehow)
      const cleaned = raw.replace(/\D/g, "").slice(0, length);
      if (cleaned.length > 1) {
        // distribute across cells from this index
        const newDigits = [...digits];
        cleaned.split("").forEach((ch, offset) => {
          if (index + offset < length) newDigits[index + offset] = ch;
        });
        onChange(newDigits.join(""));
        focusCell(Math.min(index + cleaned.length, length - 1));
        return;
      }

      const char = cleaned[0] ?? "";
      const newDigits = [...digits];
      newDigits[index] = char;
      onChange(newDigits.join(""));
      if (char && index < length - 1) {
        focusCell(index + 1);
      }
    };

    const handlePaste = (
      e: React.ClipboardEvent<HTMLInputElement>,
      index: number,
    ) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, length);
      if (!pasted) return;
      const newDigits = [...digits];
      pasted.split("").forEach((ch, offset) => {
        if (index + offset < length) newDigits[index + offset] = ch;
      });
      onChange(newDigits.join(""));
      focusCell(Math.min(index + pasted.length, length - 1));
    };

    // Select all text on focus so typing replaces the digit
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select();
    };

    const isError = Boolean(error);

    return (
      <div className={cn("w-full flex flex-col gap-2", className)}>
        {label && (
          <label className="text-sm font-medium text-neutral-800 select-none">
            {label}
          </label>
        )}

        <div
          className="flex items-center gap-2 mobilemd:gap-3"
          role="group"
          aria-label={label ?? "One-time password input"}>
          {digits.map((digit, index) => {
            const isFilled = digit.length > 0;
            return (
              <input
                key={index}
                ref={(el) => {
                  cellRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={disabled}
                aria-label={`Digit ${index + 1} of ${length}`}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
                onFocus={handleFocus}
                className={cn(
                  // Layout — square boxes, flex-1 so they share available width
                  "flex-1 min-w-0 aspect-square max-h-[60px]",
                  "text-center text-xl font-bold tabular-nums",
                  "rounded-lg border transition-all duration-150 outline-none",
                  "select-none caret-transparent",
                  // Default idle state
                  !isFilled &&
                    !isError &&
                    "border-neutral-200 bg-white text-neutral-900",
                  // Filled (has a digit)
                  isFilled &&
                    !isError &&
                    "border-primary bg-primary/5 text-primary shadow-[0_0_0_3px_rgba(128,0,144,0.08)]",
                  // Error state
                  isError && "border-red-400 bg-red-50 text-red-600",
                  // Focus ring — additional ring on top of border
                  !isError && [
                    "focus:border-primary focus:ring-[3px] focus:ring-primary/20",
                    isFilled && "focus:ring-primary/25",
                  ],
                  isError &&
                    "focus:border-red-500 focus:ring-[3px] focus:ring-red-500/20",
                  // Disabled
                  disabled &&
                    "bg-neutral-50 text-neutral-400 border-neutral-200 cursor-not-allowed",
                )}
              />
            );
          })}
        </div>

        {isError ? (
          <div className="flex items-center gap-1.5 text-xs text-red-500 mt-0.5">
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

OtpInput.displayName = "OtpInput";
