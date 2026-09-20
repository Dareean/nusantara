"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Integrate with Supabase Auth
    alert("Login functionality will be connected to Supabase Auth.");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-24 px-6">
        <div className="mx-auto max-w-[400px]">
          <h1 className="font-display text-3xl text-foreground text-center mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-text-secondary text-center mb-8">
            Log in to track your learning progress and apprenticeships.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-foreground mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full px-5 py-3 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors text-sm font-medium"
            >
              Log in
            </button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-accent hover:text-accent-hover"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
