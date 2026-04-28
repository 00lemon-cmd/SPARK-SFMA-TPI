"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getStaffPassword,
  isAuthenticated,
  setAuthenticated,
} from "@/lib/security-config";

function LoginContent() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace(params.get("redirect") || "/");
    }
  }, [router, params]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const expected = getStaffPassword();
    if (!expected) {
      setError("Staff password not configured in build.");
      return;
    }
    if (password !== expected) {
      setError("Incorrect password.");
      return;
    }
    setAuthenticated();
    const redirect = params.get("redirect") || "/";
    router.replace(redirect);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 shadow-lg p-6">
        <div className="text-center mb-5">
          <h1 className="text-xl font-bold text-slate-800">Staff Login</h1>
          <p className="text-sm text-slate-500 mt-1">
            Restricted clinical tool. Authorized Spark staff only.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter staff password"
            className="w-full rounded-md border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-spark-primary/40"
            autoFocus
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-md bg-spark-primary py-3 text-white font-bold hover:brightness-110"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-5">
          <div className="text-slate-500 font-bold">Loading login...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
