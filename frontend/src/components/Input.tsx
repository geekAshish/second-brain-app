import { ChangeEvent, KeyboardEvent, RefObject } from "react";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (name: string, value: string) => void;
  onEnter?: (name: string, value: string) => void;
  reference?: RefObject<HTMLInputElement>;
}

export function Input({
  value,
  onChange,
  onEnter,
  placeholder,
  label,
  reference,
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
      <input
        value={value}
        onChange={(e) => changeHandler(e)}
        onKeyDown={(e) => {
          enterHandler(e);
        }}
        ref={reference}
        placeholder={placeholder}
        name={label}
        type={"text"}
        className="px-4 py-2 border rounded m-2"
      ></input>
    </div>
  );
}
