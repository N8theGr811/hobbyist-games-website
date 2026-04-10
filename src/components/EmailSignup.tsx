"use client";

import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      setEmail("");
    } catch {
      setState("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <section id="signup" className="relative py-32 px-6 text-center">
      {/* Vertical connector */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-ink/10" />

      <div className="flex items-center justify-center gap-3 mb-6 font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-mat-red">
        <span className="w-6 h-px bg-mat-red/30" />
        Early Access
        <span className="w-6 h-px bg-mat-red/30" />
      </div>

      <h2 className="font-display text-[clamp(1.8rem,4vw,2.4rem)] text-ink mb-3 leading-tight">
        Be the first
        <br />
        to <em className="text-mat-red">step on the mat</em>
      </h2>

      <p className="text-base text-ink/45 mb-10">
        Sign up for beta testing updates and early access.
      </p>

      {state === "success" ? (
        <div className="max-w-md mx-auto">
          <p className="font-mono text-sm font-bold text-mat-red tracking-wide">
            You&apos;re on the list!
          </p>
          <p className="text-sm text-ink/40 mt-2">
            We&apos;ll reach out when the beta is ready.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-[460px] mx-auto">
          <div className="flex border-2 border-ink overflow-hidden hover:shadow-[0_4px_20px_rgba(27,22,18,0.08)] transition-shadow">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={state === "submitting"}
              className="flex-1 px-5 py-4 bg-paper text-ink text-sm outline-none placeholder:text-ink/25 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={state === "submitting"}
              className="font-mono text-[0.65rem] font-bold tracking-[0.12em] uppercase px-8 py-4 bg-mat-red text-cream border-l-2 border-ink hover:bg-ink transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
            >
              {state === "submitting" ? "..." : "Sign Up"}
            </button>
          </div>

          {state === "error" && (
            <p className="mt-3 text-sm text-mat-red">{errorMsg}</p>
          )}
        </form>
      )}

      <p className="mt-4 text-[0.7rem] text-ink/25">
        No spam. Unsubscribe anytime.
      </p>
    </section>
  );
}
