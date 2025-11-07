"use server";

import { getFirestore, collection, addDoc, getDocs, orderBy, limit, query } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import { isLocalhost } from "@/hooks/isLocalHost";

interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
}

// Firebase инициализация
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);

async function verifyTurnstileToken(token: string): Promise<TurnstileResponse> {
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: isLocalhost ? process.env.NEXT_PUBLIC_CF_SECRET_KEY_LOCAL : process.env.NEXT_PUBLIC_CF_SECRET_KEY, response: token }),
    }
  );

  return (await response.json()) as TurnstileResponse;
}

export async function submitManagedForm(currentState: any, formData: FormData) {
  try {
    const token = formData.get("cf-turnstile-response") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!token) return { success: false, error: "Please complete the Turnstile challenge" };
    if (!name || !email) return { success: false, error: "Please fill in all required fields" };

    const verification = await verifyTurnstileToken(token);
    if (!verification.success) {
      return { success: false, error: "Turnstile verification failed", errors: verification["error-codes"] };
    }

    const docRef = await addDoc(collection(db, "formSubmissions"), {
      formType: "managed",
      turnstileToken: token,
      turnstileVerified: true,
      name,
      email,
      challengeTs: verification.challenge_ts ? new Date(verification.challenge_ts) : null,
      hostname: verification.hostname || null,
      action: verification.action || null,
      createdAt: new Date(),
    });

    return { success: true, message: "Contact form submitted successfully!", submissionId: docRef.id };
  } catch (error) {
    console.error("Error submitting managed form:", error);
    return { success: false, error: "Server error during form submission" };
  }
}

export async function submitNonInteractiveForm(currentState: any, formData: FormData) {
  try {
    const token = formData.get("cf-turnstile-response") as string;
    const message = formData.get("message") as string;

    if (!token) return { success: false, error: "Please wait for verification to complete" };
    if (!message) return { success: false, error: "Please enter a message" };

    const verification = await verifyTurnstileToken(token);
    if (!verification.success) {
      return { success: false, error: "Turnstile verification failed", errors: verification["error-codes"] };
    }

    const docRef = await addDoc(collection(db, "formSubmissions"), {
      formType: "non-interactive",
      turnstileToken: token,
      turnstileVerified: true,
      message,
      challengeTs: verification.challenge_ts ? new Date(verification.challenge_ts) : null,
      hostname: verification.hostname || null,
      action: verification.action || null,
      createdAt: new Date(),
    });

    return { success: true, message: "Message sent successfully!", submissionId: docRef.id };
  } catch (error) {
    console.error("Error submitting non-interactive form:", error);
    return { success: false, error: "Server error during message submission" };
  }
}

export async function submitInvisibleForm(currentState: any, formData: FormData) {
  try {
    const token = formData.get("cf-turnstile-response") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!token) return { success: false, error: "Verification in progress..." };
    if (!username || !password) return { success: false, error: "Please enter username and password" };

    const verification = await verifyTurnstileToken(token);
    if (!verification.success) {
      return { success: false, error: "Turnstile verification failed", errors: verification["error-codes"] };
    }

    const docRef = await addDoc(collection(db, "formSubmissions"), {
      formType: "invisible",
      turnstileToken: token,
      turnstileVerified: true,
      username,
      challengeTs: verification.challenge_ts ? new Date(verification.challenge_ts) : null,
      hostname: verification.hostname || null,
      action: verification.action || null,
      createdAt: new Date(),
    });

    return { success: true, message: "Login successful!", submissionId: docRef.id };
  } catch (error) {
    console.error("Error submitting invisible form:", error);
    return { success: false, error: "Server error during login" };
  }
}

export async function getFormSubmissions() {
  try {
    // Firestore: загрузка последних 10 записей
    const snap = await getDocs(query(collection(db, "formSubmissions"), orderBy("createdAt", "desc"), limit(10)));

    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return { success: false, error: "Failed to fetch submissions" };
  }
}
