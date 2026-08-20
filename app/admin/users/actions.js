"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getUserRole } from "@/app/data/userProfile";
import { logAction } from "@/app/data/auditLog";

const ALLOWED_ROLES = ["admin", "viewer"];

export async function createUser(formData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  const role = await getUserRole(supabase, user);
  if (role !== "admin") {
    return { success: false, message: "Unauthorized" };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const assignedRole = String(formData.get("role") ?? "viewer")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return { success: false, message: "A valid email is required" };
  }
  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters" };
  }
  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }
  if (!ALLOWED_ROLES.includes(assignedRole)) {
    return { success: false, message: "Role must be admin or viewer" };
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (error) {
    console.error("[createUser] Admin client error:", error.message);
    return {
      success: false,
      message: "Server is missing SUPABASE_SERVICE_ROLE_KEY",
    };
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    console.error("[createUser] Auth error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to create user",
    };
  }

  const createdUser = data?.user;
  if (!createdUser?.id) {
    return { success: false, message: "Failed to create user" };
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    { id: createdUser.id, role: assignedRole },
    { onConflict: "id" }
  );

  if (profileError) {
    console.error("[createUser] Profile upsert error:", profileError.message);
    return {
      success: false,
      message: `User was created in Auth, but assigning role failed: ${profileError.message}`,
    };
  }

  try {
    await logAction(supabase, user.id, "user.created", {
      email,
      role: assignedRole,
      created_user_id: createdUser.id,
    });
  } catch (_) {}

  revalidatePath("/admin/users");
  return {
    success: true,
    message: `Created ${email} as ${assignedRole}`,
  };
}
