import { Logo } from "../icons/Logo";

interface tags {
  count: number;
  tag: string;
  _id: string;
}

export function Sidebar({ tags }: { tags: tags[] }) {
  console.log(tags);

  return (
    <div className="h-screen p-2 bg-white border-r w-52 fixed left-0 top-0 ">
      <div className="flex text-2xl gap-2 items-center">
        <div className="text-purple-600">
          <Logo />
        </div>
        <p>Brainly</p>
      </div>
      <div className="mt-3">
        <p>Top brain</p>
        <div className="flex flex-wrap gap-2 p-2">
          {tags?.map((tag) => (
            <div
              key={tag._id}
              className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <span className="font-medium text-sm">{tag.tag}</span>
              <span className="bg-gray-300 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                {tag.count}
              </span>
            </div>
          ))}
        </div>
        {/* <SidebarItem text="Twitter" icon={<Twitter />} />
        <SidebarItem text="Youtube" icon={<Youtube />} /> */}
      </div>
    </div>
  );
}
