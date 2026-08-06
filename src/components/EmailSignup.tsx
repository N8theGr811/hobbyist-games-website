"use client";

import { useState, type FormEvent } from "react";
import BeltStrip from "./BeltStrip";
import Watermark from "./Watermark";

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
    <section id="signup" className="relative isolate section-rhythm px-6 text-center bg-pixel-grid overflow-hidden border-t border-steam-gold/20">
      <Watermark name="saddle" className="-right-28 top-16 h-[380px] w-[500px]" />
      <Watermark name="doubleleg" className="-left-24 bottom-8 h-[300px] w-[400px]" />

      <div className="flex items-center justify-center gap-3 mb-6 font-pixel text-pixel-xs tracking-[0.2em] uppercase text-steam-gold">
        <span className="w-6 h-px bg-steam-gold/40" />
        Early Access
        <span className="w-6 h-px bg-steam-gold/40" />
      </div>

      <h2 className="font-pixel text-pixel-lg text-cream mb-4 leading-snug">
        Be The First
        <br />
        To <span className="text-steam-gold">Step On The Mat</span>
      </h2>

      <p className="text-sm text-cream/55 mb-8 max-w-md mx-auto leading-relaxed">
        Sign up for beta testing updates and early access.
      </p>

      {state === "success" ? (
        <div className="max-w-md mx-auto">
          <p className="font-pixel text-sm text-steam-gold tracking-wider mb-3">
            YOU&apos;RE ON THE LIST!
          </p>
          <p className="text-sm text-cream/55">
            We&apos;ll reach out when the beta is ready.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-[460px] mx-auto">
          <div
            className="surface-card flex overflow-hidden border-2 border-steam-gold/60 hover:border-steam-gold focus-within:border-steam-gold transition-colors"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={state === "submitting"}
              className="flex-1 px-5 py-4 bg-steam-navy-2 text-cream text-sm outline-none placeholder:text-cream/55 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={state === "submitting"}
              className="font-pixel text-pixel-sm tracking-[0.1em] uppercase px-7 py-4 bg-steam-gold text-steam-navy hover:bg-steam-gold-2 transition-colors whitespace-nowrap disabled:opacity-50 cursor-pointer"
            >
              {state === "submitting" ? "..." : "Sign Up"}
            </button>
          </div>

          {state === "error" && (
            <p className="mt-3 text-sm text-mat-red font-semibold">{errorMsg}</p>
          )}
        </form>
      )}

      <p className="mt-4 text-xs text-cream/55">
        No spam. Unsubscribe anytime.
      </p>

      <div className="mt-8 max-w-[280px] mx-auto">
        <BeltStrip height={8} />
      </div>
    </section>
  );
}
