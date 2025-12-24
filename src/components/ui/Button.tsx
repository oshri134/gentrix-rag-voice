"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "danger" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#4CAF50",
    color: "white",
  },
  danger: {
    backgroundColor: "#f44336",
    color: "white",
  },
  secondary: {
    backgroundColor: "#e0e0e0",
    color: "#333",
  },
};

const baseStyles: React.CSSProperties = {
  padding: "15px 30px",
  fontSize: "16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "opacity 0.2s",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", isLoading, disabled, children, style, ...props },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={{
          ...baseStyles,
          ...variantStyles[variant],
          opacity: isDisabled ? 0.6 : 1,
          cursor: isDisabled ? "not-allowed" : "pointer",
          ...style,
        }}
        {...props}
      >
        {isLoading && <span>⏳</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
