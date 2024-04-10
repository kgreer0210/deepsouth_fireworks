import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Sidebar() {
  return (
    <div className="flex flex-col w-64 h-screen bg-gray-800 text-white p-6 justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">Inventory Management</h2>
        <ul>
          <Link href="/">
            <li className="mb-2 p-2 hover:bg-gray-700 rounded">Inventory</li>
          </Link>
          <Link href="/shows">
            <li className="mb-2 p-2 hover:bg-gray-700 rounded">Shows</li>
          </Link>
          <li className="mb-2 p-2 hover:bg-gray-700 rounded">Team</li>
        </ul>
      </div>
      <div>
        <div className="flex-row p-4">
          <Avatar>
            <AvatarImage src="/Kyle-17.jpg" />
            <AvatarFallback>KG</AvatarFallback>
          </Avatar>
          <h3 className="text-lg font-semibold flex">Kyle Greer</h3>
          <p className="flex">Admin</p>
        </div>
      </div>
    </div>
  );
}
