"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function logout() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function forgotPassword(formData) {
  const supabase = createClient();

  const { email } = formData;

  // Get the base URL
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/forgot-password/reset`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
