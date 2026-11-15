"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";

const inputClass = "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("request");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestCode = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/forgot-password`,
        { email },
        { withCredentials: true }
      );
      setMessage(response.data.message || "If an account exists for that email, a reset code will be sent shortly.");
      setStep("reset");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to request a reset code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (password.length < 8) {
      setErrorMessage("Your new password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/reset-password`,
        { email, code, password },
        { withCredentials: true }
      );
      setMessage(response.data.message || "Your password has been reset successfully.");
      setStep("complete");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Unable to reset your password. Please check the code and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-[75vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-7 shadow-lg sm:p-9">
        <div className="mb-7 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-orange-600">NutriBlogHub account recovery</p>
          <h1 className="text-3xl font-bold text-gray-900">
            {step === "request" ? "Forgot password?" : step === "reset" ? "Create a new password" : "Password updated"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {step === "request"
              ? "Enter the email address linked to your account. We will send a one-time verification code if an account exists."
              : step === "reset"
                ? "Enter the 6-digit code sent to your email and choose a new password."
                : "Your password has been changed. You can now sign in using your new password."}
          </p>
        </div>

        {step === "request" && (
          <form onSubmit={handleRequestCode} className="space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
              <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className={inputClass} />
            </div>
            {message && <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}
            {errorMessage && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}
            <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Sending..." : "Send verification code"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="reset-email" className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
              <input id="reset-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="code" className="mb-1.5 block text-sm font-medium text-gray-700">6-digit verification code</label>
              <input id="code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Enter your code" className={inputClass} />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">New password</label>
              <input id="password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" className={inputClass} />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-gray-700">Confirm new password</label>
              <input id="confirmPassword" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Enter the password again" className={inputClass} />
            </div>
            {message && <p role="status" className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}
            {errorMessage && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorMessage}</p>}
            <button type="submit" disabled={isSubmitting || code.length !== 6} className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Updating password..." : "Reset password"}
            </button>
            <button type="button" onClick={() => { setStep("request"); setCode(""); setMessage(""); setErrorMessage(""); }} className="w-full text-sm font-semibold text-orange-700 hover:underline">
              Use a different email address
            </button>
          </form>
        )}

        {step === "complete" && (
          <div className="space-y-4">
            {message && <p role="status" className="rounded-lg bg-green-50 px-3 py-3 text-sm text-green-700">{message}</p>}
            <Link href="/login" className="block w-full rounded-lg bg-orange-600 py-3 text-center font-semibold text-white transition hover:bg-orange-700">
              Go to login
            </Link>
          </div>
        )}

        {step !== "complete" && (
          <p className="mt-7 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/login" className="font-semibold text-orange-700 hover:underline">Back to login</Link>
          </p>
        )}
      </section>
    </main>
  );
}
