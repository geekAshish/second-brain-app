import { ReactElement } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses = {
  primary: "bg-purple-600 text-white",
  secondary: "bg-purple-200 text-purple-600",
};

const defaultStyles = "px-2 py-1 gap-2 rounded-md font-light flex items-center";

export function Button({
  variant,
  text,
  startIcon,
  onClick,
  fullWidth,
  loading,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={
        variantClasses[variant] +
        " " +
        defaultStyles +
        `${fullWidth ? " flex items-center justify-between" : ""} ${
          loading ? "opacity-45	" : ""
        }`
      }
      disabled={loading}
    >
      {startIcon && <div className="">{startIcon}</div>}
      <p>{text}</p>
    </button>
  );
}
