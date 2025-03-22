import React, { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import clsx from "clsx"; // Utility for conditionally joining classNames

// Define valid input types
type InputType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "date"
  | "time"
  | "tel"
  | "url";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputType;
  success?: boolean;
  error?: boolean;
  hint?: string; // Optional hint text for validation feedback
  register?: UseFormRegisterReturn; // React Hook Form integration
}

const Input: FC<InputProps> = ({
  type = "text",
  success = false,
  error = false,
  hint,
  register,
  className = "",
  disabled = false,
  ...rest
}) => {
  // Determine input styles based on state (disabled, success, error)
  const inputClasses = clsx(
    "h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800",
    {
      "text-gray-500 border-gray-300 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700":
        disabled,
      "text-error-800 border-error-500 focus:ring-error-500/10 dark:text-error-400 dark:border-error-500":
        error,
      "text-success-500 border-success-400 focus:ring-success-500/10 focus:border-success-300 dark:text-success-400 dark:border-success-500":
        success,
      "bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800":
        !disabled && !error && !success,
    },
    className
  );

  return (
    <div className="relative">
      <input
        type={type}
        disabled={disabled}
        className={inputClasses}
        aria-invalid={error ? "true" : "false"} // Accessibility for error state
        {...register} // Spread React Hook Form register props
        {...rest} // Spread all other native input props
      />

      {/* Hint Text (only shown for error or success states) */}
      {(error || success) && hint && (
        <p
          className={clsx("mt-1.5 text-xs", {
            "text-error-500": error,
            "text-success-500": success,
          })}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;