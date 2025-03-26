"use client";

import { useState } from "react";
import { signup } from "../actions";
import CheckYourEmailModal from "./CheckYourEmailModal";
import { redirect } from "next/navigation";
export default function SignUp() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    const password = formData.get("password");
    const confirmPassword = formData.get("passwordConfirm");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    const email = formData.get("email");
    setEmail(email);

    try {
      await signup(formData);
      setShowEmailModal(true);
      setTimeout(() => {
        redirect("/sign-in");
      }, 3000);
    } catch (error) {
      setError(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <form action={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="signup-email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="signup-email"
            name="email"
            type="email"
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="signup-password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="signup-password"
            name="password"
            type="password"
            placeholder="******************"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="signup-password-confirm"
          >
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="signup-password-confirm"
            name="passwordConfirm"
            type="password"
            placeholder="******************"
            required
          />
        </div>
        {error && (
          <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
        )}
        <div className="flex items-center justify-center">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Create Account
          </button>
        </div>
      </form>

      <CheckYourEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        email={email}
      />
    </>
  );
}
