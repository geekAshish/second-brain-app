import { ChangeEvent, KeyboardEvent, RefObject } from "react";

interface InputProps {
  value?: string;
  label?: string;
  name: string;
  isRequired?: boolean;
  disabled?: boolean;
  type?: string;
  textLimit?: number;
  error?: boolean | string;
  showErrorText?: boolean;

  placeholder?: string;
  reference?: RefObject<HTMLInputElement>;
  helperText?: string;

  className?: string;

  onChange?: (name: string, value: string) => void;
  onEnter?: (name: string, value: string) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Input({
  value,
  onChange,
  onEnter,
  onBlur,
  placeholder,
  textLimit,
  label,
  reference,
  className,
  error,
  showErrorText,
  helperText,
  isRequired,
  name,
  type = "text",
}: InputProps) {
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange?.(name, value);
  };

  const enterHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    if (e.key === "Enter") {
      onEnter?.(name, value);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-700 mt-2">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        value={value}
        onChange={(e) => changeHandler(e)}
        onKeyDown={(e) => {
          enterHandler(e);
        }}
        onBlur={onBlur}
        ref={reference}
        placeholder={placeholder}
        name={name}
        type={type}
        className={`px-4 py-2 border rounded ${
          error ? "!border-red-500" : ""
        } ${className}`}
        autoComplete="off"
      ></input>

      {textLimit && value && textLimit < value.toString().length && (
        <div className="text-red-500 text-sm mt-1 inline">
          must be {textLimit} only
        </div>
      )}
      {error && showErrorText && helperText && (
        <div className="text-red-500 text-sm mt-1">{helperText}</div>
      )}
    </div>
  );
}
