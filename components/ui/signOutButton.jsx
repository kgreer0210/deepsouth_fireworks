"use client";

import { useState } from "react";
import { createClient } from "@/app/utils/supabase/client";
import Link from "next/link";

const SignoutButton = () => {
  const [error, setError] = useState(null);

  const handleSignOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) setError(error.message);
    //redirect to login page
  };

  return (
    <Link href="/login">
      <button onClick={handleSignOut}>Sign Out</button>
    </Link>
  );
};

export default SignoutButton;
