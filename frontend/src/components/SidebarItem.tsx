import { ReactElement } from "react";

export function SidebarItem({
  text,
  icon,
}: {
  text: string;
  icon: ReactElement;
}) {
  return (
    <div className="flex items-center gap-2 p-2 text-gray-700 cursor-pointer hover:bg-gray-200 rounded max-w-48 transition-all duration-150">
      <div>{icon}</div>
      <div>{text}</div>
    </div>
  );
}
