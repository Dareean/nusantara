"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"learner" | "holder">("learner");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Integrate with Supabase Auth
    alert("Registration will be connected to Supabase Auth.");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 py-24 px-6">
        <div className="mx-auto max-w-[400px]">
          <h1 className="font-display text-3xl text-foreground text-center mb-2">
            Join the chain
          </h1>
          <p className="text-sm text-text-secondary text-center mb-8">
            Create an account to start learning or sharing cultural knowledge.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-foreground mb-1.5">
                Full name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
              />
            </div>
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
                minLength={8}
                className="w-full px-4 py-3 border border-border rounded-md bg-background text-foreground placeholder:text-text-secondary/50 focus:outline-none focus:border-accent"
              />
            </div>

            {/* Role selection */}
            <div>
              <label className="block text-sm text-foreground mb-2">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("learner")}
                  className={cn(
                    "px-4 py-3 border rounded-md text-sm text-left transition-colors",
                    role === "learner"
                      ? "border-accent text-accent"
                      : "border-border text-text-secondary hover:text-foreground"
                  )}
                >
                  <span className="block font-medium">Learner</span>
                  <span className="text-xs opacity-70">
                    I want to learn cultural knowledge
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("holder")}
                  className={cn(
                    "px-4 py-3 border rounded-md text-sm text-left transition-colors",
                    role === "holder"
                      ? "border-accent text-accent"
                      : "border-border text-text-secondary hover:text-foreground"
                  )}
                >
                  <span className="block font-medium">Cultural Holder</span>
                  <span className="text-xs opacity-70">
                    I carry knowledge to share
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-5 py-3 bg-accent text-white rounded-md hover:bg-accent-hover transition-colors text-sm font-medium"
            >
              Create Account
            </button>
          </form>

          <p className="text-sm text-text-secondary text-center mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-accent hover:text-accent-hover"
            >
              Log in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
