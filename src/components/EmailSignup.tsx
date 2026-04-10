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
    <section id="signup" className="relative py-32 px-6 text-center bg-espresso">
      <div className="flex items-center justify-center gap-3 mb-6 font-mono text-[0.6rem] font-bold tracking-[0.25em] uppercase text-belt-gold">
        <span className="w-6 h-px bg-belt-gold/30" />
        Early Access
        <span className="w-6 h-px bg-belt-gold/30" />
      </div>

      <h2 className="font-display text-[clamp(1.8rem,4vw,2.4rem)] text-cream mb-3 leading-tight">
        Be the first
        <br />
        to <em className="text-belt-gold">step on the mat</em>
      </h2>

      <p className="text-base text-cream/50 mb-10">
        Sign up for beta testing updates and early access.
      </p>

      {state === "success" ? (
        <div className="max-w-md mx-auto">
          <p className="font-mono text-sm font-bold text-belt-gold tracking-wide">
            You&apos;re on the list!
          </p>
          <p className="text-sm text-cream/40 mt-2">
            We&apos;ll reach out when the beta is ready.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-[460px] mx-auto">
          <div className="flex border-2 border-cream/15 overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-shadow">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={state === "submitting"}
              className="flex-1 px-5 py-4 bg-cream text-ink text-sm outline-none placeholder:text-ink/25 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={state === "submitting"}
              className="font-mono text-[0.65rem] font-bold tracking-[0.12em] uppercase px-8 py-4 bg-mat-red text-cream border-l-2 border-cream/15 hover:bg-cream hover:text-espresso transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
            >
              {state === "submitting" ? "..." : "Sign Up"}
            </button>
          </div>

          {state === "error" && (
            <p className="mt-3 text-sm text-mat-red font-semibold">{errorMsg}</p>
          )}
        </form>
      )}

      <p className="mt-4 text-[0.7rem] text-cream/25">
        No spam. Unsubscribe anytime.
      </p>
    </section>
  );
}
