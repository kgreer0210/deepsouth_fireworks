"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/app/(auth)/actions";
import ProfileModal from "./ProfileModal";

export default function Sidebar({ initialUser }) {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

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
        </ul>
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar
            className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsProfileModalOpen(true)}
          >
            <AvatarImage src={initialUser?.avatar_url} />
            <AvatarFallback className="bg-gray-400 text-white">
              {initialUser?.full_name?.charAt(0).toUpperCase() ||
                initialUser?.username?.charAt(0).toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">
            {initialUser?.full_name || initialUser?.username || "User"}
          </span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full px-2 py-1 text-sm border border-gray-300 text-white hover:text-white hover:bg-red-500 rounded-lg text-center"
          >
            Sign Out
          </button>
        </form>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={initialUser}
      />
    </div>
  );
}
