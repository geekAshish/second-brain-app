import { Twitter, Youtube } from "lucide-react";
import { Logo } from "../icons/Logo";
import { SidebarItem } from "./SidebarItem";

export function Sidebar() {
  return (
    <div className="h-screen p-2 bg-white border-r w-52 fixed left-0 top-0 ">
      <div className="flex text-2xl gap-2 items-center">
        <div className="text-purple-600">
          <Logo />
        </div>
        <p>Brainly</p>
      </div>
      <div className="mt-3">
        <SidebarItem text="Twitter" icon={<Twitter />} />
        <SidebarItem text="Youtube" icon={<Youtube />} />
      </div>
    </div>
  );
}
