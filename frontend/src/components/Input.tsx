import { ChangeEvent, LegacyRef } from "react";

interface InputProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (name: string, value: string) => void;
  reference?: LegacyRef<HTMLInputElement>;
}

export function Input({
  value,
  onChange,
  placeholder,
  label,
  reference,
}: InputProps) {
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange?.(name, value);
  };

  return (
    <div>
      <input
        value={value}
        onChange={(e) => changeHandler(e)}
        ref={reference}
        placeholder={placeholder}
        name={label}
        type={"text"}
        className="px-4 py-2 border rounded m-2"
      ></input>
    </div>
  );
}
