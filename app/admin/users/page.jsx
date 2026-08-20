import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";
import { getUserRole } from "@/app/data/userProfile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateUserForm from "./createUserForm";

function formatTimestamp(ts) {
  if (!ts) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(ts));
  } catch {
    return ts;
  }
}

async function loadUsers() {
  const admin = createAdminClient();
  const [{ data: authData, error: authError }, { data: profiles, error: profileError }] =
    await Promise.all([
      admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      admin.from("profiles").select("id, role"),
    ]);

  if (authError) {
    throw new Error(authError.message);
  }
  if (profileError) {
    throw new Error(profileError.message);
  }

  const roleById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.role?.toLowerCase() ?? "viewer"])
  );

  return (authData?.users ?? [])
    .map((user) => ({
      id: user.id,
      email: user.email ?? "—",
      role: roleById.get(user.id) ?? "viewer",
      createdAt: user.created_at,
    }))
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await getUserRole(supabase, user);
  if (role !== "admin") {
    redirect("/");
  }

  let users = [];
  let loadError = null;
  try {
    users = await loadUsers();
  } catch (error) {
    loadError = error?.message || "Failed to load users";
    console.error("[AdminUsers] Load error:", loadError);
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <h1 className="text-2xl text-center font-bold mt-4">Users</h1>
      <div className="p-4">
        <CreateUserForm />

        {loadError ? (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            Failed to load users: {loadError}
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-3">
              {users.length} user{users.length === 1 ? "" : "s"}
            </p>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-32">Role</TableHead>
                    <TableHead className="w-52">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground py-8"
                      >
                        No users found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>{entry.email}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                            {entry.role}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">
                          {formatTimestamp(entry.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
