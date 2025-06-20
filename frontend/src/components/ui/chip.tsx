import { X } from "lucide-react";
import { ReactNode } from "react";

interface ChipInterface {
  label: string;
  color?: string;
  icon?: ReactNode;
  onClickChip?: () => void;
  onClickRemove?: (t: string) => void;
}

const Chip = ({
  label,
  color = "gray",
  icon,
  onClickChip,
  onClickRemove,
}: ChipInterface) => {
  const bgColor = `bg-${color}-200`;
  const textColor = `text-${color}-800`;

  return (
    <span
      onClick={onClickChip}
      className={`inline-flex items-center rounded-full ${bgColor} px-2 py-[2px] text-xs ${textColor} cursor-pointer`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {label}
      <X
        size={12}
        className="ml-1 border border-gray-500 rounded-full"
        onClick={() => onClickRemove?.(label)}
      />
    </span>
  );
};

export default Chip;
