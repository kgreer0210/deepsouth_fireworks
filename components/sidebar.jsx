import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "@/app/data/userProfile";

export default async function Sidebar() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return null;
  }
  const role = await getUserRole(supabase, data.user);
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
          {role === "admin" && (
            <>
              <Link href="/admin/users">
                <li className="mb-2 p-2 hover:bg-gray-700 rounded">Users</li>
              </Link>
              <Link href="/admin/audit-log">
                <li className="mb-2 p-2 hover:bg-gray-700 rounded">Audit Log</li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
