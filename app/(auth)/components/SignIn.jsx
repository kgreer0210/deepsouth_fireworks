"use client";

import { useState } from "react";
import { login } from "../actions";
import Link from "next/link";

export default function SignIn() {
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setError("");

    try {
      await login(formData);
    } catch (error) {
      setError(error.message || "Invalid email or password");
    }
  };

  return (
    <form action={handleSubmit}>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="signin-email"
        >
          Email
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="signin-email"
          name="email"
          type="email"
          placeholder="Email"
          required
        />
      </div>
      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="signin-password"
        >
          Password
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="signin-password"
          name="password"
          type="password"
          placeholder="******************"
          required
        />
      </div>
      <div className="flex items-center justify-center mb-4">
        <Link
          className="text-blue-500 hover:text-blue-700"
          href="/forgot-password"
        >
          Forgot Password?
        </Link>
      </div>
      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
      )}

      <div className="flex items-center justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}
