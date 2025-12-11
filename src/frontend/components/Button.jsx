import * as React from "react";
import clsx from "clsx";

const variantClasses = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
  outline:
    "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-gray-300",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  success: "bg-success text-white hover:bg-success/90",
  violet: "bg-violet-600 text-white hover:bg-violet-700",
};

const sizeClasses = {
  sm: "h-9 px-4 text-sm rounded-lg",
  md: "h-11 px-5 py-3 text-md rounded-xl",
  lg: "h-14 px-7 py-4 text-lg rounded-2xl",
  default: "h-14 px-5 py-3 text-base rounded-lg",
};

const defaultVariant = {
  variant: "default",
  size: "default",
};

const Button = ({
  children,
  variant = defaultVariant.variant,
  size = defaultVariant.size,
  className,
  disabled,
  type = "button",
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...props}
      className={clsx(
        "inline-flex items-center justify-center font-medium gap-2 transition-all disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
