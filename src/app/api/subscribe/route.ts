import { NextResponse } from "next/server";
import { getDb } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  try {
    const db = getDb();
    const subscribers = db.collection("subscribers");

    // Check for duplicate
    const existing = await subscribers.where("email", "==", email).limit(1).get();
    if (!existing.empty) {
      return NextResponse.json({ message: "You're already on the list!" });
    }

    await subscribers.add({
      email,
      subscribed_at: Timestamp.now(),
      source: "website",
    });

    return NextResponse.json({ message: "Successfully subscribed!" });
  } catch (err) {
    console.error("Subscribe error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
