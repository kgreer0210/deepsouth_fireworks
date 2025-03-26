"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeExchanged, setCodeExchanged] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // Extract parameters from URL
        const code = searchParams.get("code");
        const type = searchParams.get("type");

        // Handle hash parameters (sometimes Supabase uses URL hash)
        let hashParams = {};
        if (window.location.hash) {
          const hash = window.location.hash.substring(1);
          hashParams = hash.split("&").reduce((result, item) => {
            const parts = item.split("=");
            result[parts[0]] = decodeURIComponent(parts[1]);
            return result;
          }, {});
        }

        // Check if we already have a session
        const supabase = createClient();
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData?.session) {
          setCodeExchanged(true);
          return;
        }

        // Try to exchange code if available
        if (code) {
          await exchangeCodeForSession(code);
        }
        // Type recovery without code means Supabase might have already handled the auth
        else if (type === "recovery" || hashParams.access_token) {
          setCodeExchanged(true);
        } else {
          setError("Missing reset code. Please use the link from your email.");
        }
      } catch (err) {
        setError("Error initializing password reset. Please try again.");
      }
    };

    handleAuth();
  }, [searchParams]);

  const exchangeCodeForSession = async (code) => {
    try {
      setIsLoading(true);
      const supabase = createClient();

      // Try the modern exchangeCodeForSession method first
      try {
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code
        );

        if (error) {
          throw error;
        }

        setCodeExchanged(true);
        return;
      } catch (exchangeError) {
        // If the modern method fails, try directly using the code as a token
        // This is a fallback for some Supabase versions/configurations
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (!sessionError && sessionData?.session) {
          setCodeExchanged(true);
          return;
        }

        throw exchangeError;
      }
    } catch (err) {
      setError(
        "Invalid or expired reset link. Please request a new password reset."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const supabase = createClient();

      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setMessage("Password updated successfully!");
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 px-4 py-8 shadow-lg rounded-lg bg-white">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your new password below.
        </p>
      </div>

      {message && (
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-green-800">{message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!codeExchanged && !error ? (
        <div className="flex justify-center">
          <p className="text-gray-600">Validating your reset link...</p>
        </div>
      ) : (
        !error && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? "Updating..." : "Reset Password"}
              </button>
            </div>
          </form>
        )
      )}
    </div>
  );
}
